import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, bigint, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["broker", "owner", "admin"]);
export const propertyTypeEnum = pgEnum("property_type", ["residential", "commercial", "land"]);
export const listingTypeEnum = pgEnum("listing_type", ["sale", "rent", "lease"]);
export const propertyStatusEnum = pgEnum("property_status", ["available", "rented", "sold"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "in_progress", "qualified", "closed_won", "closed_lost"]);
export const leadTypeEnum = pgEnum("lead_type", ["property_inquiry", "interior_design"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("broker"),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brokerId: varchar("broker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  propertyType: propertyTypeEnum("property_type").notNull(),
  listingType: listingTypeEnum("listing_type").notNull().default("sale"),
  status: propertyStatusEnum("status").notNull().default("available"),
  priceMin: bigint("price_min", { mode: "number" }).notNull(),
  priceMax: bigint("price_max", { mode: "number" }), // null for rent (fixed price)
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: integer("area").notNull(), // in sq ft
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  videos: text("videos").array().notNull().default(sql`ARRAY[]::text[]`),
  amenities: text("amenities").array().notNull().default(sql`ARRAY[]::text[]`),
  facilities: text("facilities").array().notNull().default(sql`ARRAY[]::text[]`),
  nearbyPlaces: text("nearby_places").array().notNull().default(sql`ARRAY[]::text[]`),
  featured: boolean("featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Leads table
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id, { onDelete: "set null" }),
  leadType: leadTypeEnum("lead_type").notNull(),
  status: leadStatusEnum("status").notNull().default("new"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  budget: bigint("budget", { mode: "number" }),
  requirements: text("requirements"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  broker: one(users, {
    fields: [properties.brokerId],
    references: [users.id],
  }),
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  property: one(properties, {
    fields: [leads.propertyId],
    references: [properties.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schemas
export const updatePropertySchema = insertPropertySchema.partial();
export const updateLeadSchema = insertLeadSchema.partial().extend({
  status: z.enum(["new", "contacted", "in_progress", "qualified", "closed_won", "closed_lost"]).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type UpdateProperty = z.infer<typeof updatePropertySchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type UpdateLead = z.infer<typeof updateLeadSchema>;

// Extended types for frontend
export type PropertyWithBroker = Property & {
  broker: User;
};

export type LeadWithProperty = Lead & {
  property: Property | null;
};
