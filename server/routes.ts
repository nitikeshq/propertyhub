import type { Request, Response, NextFunction } from "express";
import express, { type Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import connectPg from "connect-pg-simple";
import multer from "multer";
import path from "path";
import { db } from "./db";
import { users, properties, leads, insertPropertySchema, insertLeadSchema, updateLeadSchema, updatePropertySchema } from "@shared/schema";
import { createUser, getUserByEmail, verifyPassword, getUserById } from "./auth";
import { eq, desc, and } from "drizzle-orm";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { sendLeadNotifications } from "./notifications";
import pg from "pg";

const PgStore = connectPg(session);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

interface AuthRequest extends Request {
  userId?: string;
}

// Middleware to check authentication
function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.userId = req.session.userId;
  next();
}

// Middleware to check admin role
async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const user = await getUserById(req.session.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  
  req.userId = req.session.userId;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static files from uploads directory
  app.use('/uploads', express.static('uploads'));

  // Serve static files from attached_assets directory
  app.use('/attached_assets', express.static('attached_assets'));

  // Session middleware with PostgreSQL store
  const pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });

  app.use(
    session({
      store: new PgStore({
        pool: pgPool,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "property-hub-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = await createUser({
        email,
        password,
        name,
        role: role || "broker",
        phone: req.body.phone,
      });

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Missing credentials" });
      }

      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // File upload endpoint
  app.post("/api/upload", requireAuth, upload.array('images', 10), (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
      res.json({ urls: fileUrls });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await getUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Property routes
  app.get("/api/properties", async (req, res) => {
    try {
      const brokerId = req.query.brokerId as string | undefined;

      let propertiesQuery = db.select().from(properties);

      if (brokerId) {
        propertiesQuery = propertiesQuery.where(eq(properties.brokerId, brokerId)) as any;
      }

      const allProperties = await propertiesQuery.orderBy(desc(properties.createdAt));
      res.json(allProperties);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/with-brokers", async (req, res) => {
    try {
      const propertiesWithBrokers = await db
        .select({
          property: properties,
          broker: users,
        })
        .from(properties)
        .leftJoin(users, eq(properties.brokerId, users.id))
        .orderBy(desc(properties.createdAt));

      const formattedProperties = propertiesWithBrokers.map(({ property, broker }) => {
        if (broker) {
          const { password: _, ...brokerWithoutPassword } = broker;
          return { ...property, broker: brokerWithoutPassword };
        }
        return property;
      });

      res.json(formattedProperties);
    } catch (error) {
      console.error("Failed to fetch properties with brokers:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = req.params.id;

      const [property] = await db
        .select()
        .from(properties)
        .where(eq(properties.id, propertyId));

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Increment views
      await db
        .update(properties)
        .set({ views: property.views + 1 })
        .where(eq(properties.id, propertyId));

      // Get broker info
      const [broker] = await db
        .select()
        .from(users)
        .where(eq(users.id, property.brokerId));

      if (broker) {
        const { password: _, ...brokerWithoutPassword } = broker;
        res.json({ ...property, broker: brokerWithoutPassword });
      } else {
        res.json(property);
      }
    } catch (error) {
      console.error("Failed to fetch property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", requireAuth, async (req: AuthRequest, res) => {
    try {
      const data = insertPropertySchema.parse(req.body);

      // Ensure brokerId matches authenticated user
      const [property] = await db
        .insert(properties)
        .values({
          ...data,
          brokerId: req.userId!,
        })
        .returning();

      res.json(property);
    } catch (error) {
      console.error("Failed to create property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.patch("/api/properties/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const propertyId = req.params.id;
      const data = updatePropertySchema.parse(req.body);

      // Verify ownership
      const [existing] = await db
        .select()
        .from(properties)
        .where(eq(properties.id, propertyId));

      if (!existing) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (existing.brokerId !== req.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const [updated] = await db
        .update(properties)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(properties.id, propertyId))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error("Failed to update property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const propertyId = req.params.id;

      const [existing] = await db
        .select()
        .from(properties)
        .where(eq(properties.id, propertyId));

      if (!existing) {
        return res.status(404).json({ message: "Property not found" });
      }

      if (existing.brokerId !== req.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await db.delete(properties).where(eq(properties.id, propertyId));

      res.json({ message: "Property deleted" });
    } catch (error) {
      console.error("Failed to delete property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Lead routes
  app.get("/api/leads", requireAdmin, async (req: AuthRequest, res) => {
    try {
      const allLeads = await db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt));

      // Get property details for each lead
      const leadsWithProperties = await Promise.all(
        allLeads.map(async (lead) => {
          if (lead.propertyId) {
            const [property] = await db
              .select()
              .from(properties)
              .where(eq(properties.id, lead.propertyId));
            return { ...lead, property: property || null };
          }
          return { ...lead, property: null };
        })
      );

      res.json(leadsWithProperties);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertLeadSchema.parse(req.body);

      const [lead] = await db.insert(leads).values(data).returning();

      // Get property title for notification
      let propertyTitle: string | undefined;
      if (lead.propertyId) {
        const [property] = await db
          .select()
          .from(properties)
          .where(eq(properties.id, lead.propertyId));
        propertyTitle = property?.title;
      }

      // Send notifications (non-blocking)
      sendLeadNotifications(lead, propertyTitle).catch((error) => {
        console.error("Failed to send lead notifications:", error);
      });

      res.json(lead);
    } catch (error) {
      console.error("Failed to create lead:", error);
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  app.patch("/api/leads/:id", requireAdmin, async (req: AuthRequest, res) => {
    try {
      const leadId = req.params.id;
      const data = updateLeadSchema.parse(req.body);

      const [updated] = await db
        .update(leads)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(leads.id, leadId))
        .returning();

      if (!updated) {
        return res.status(404).json({ message: "Lead not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Failed to update lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  // Object storage routes
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Failed to get upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  app.put("/api/property-images", async (req, res) => {
    try {
      if (!req.body.imageURL) {
        return res.status(400).json({ error: "imageURL is required" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting property image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
