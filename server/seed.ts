import { db } from "./db";
import { users, properties } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Starting seed...");

  // Create admin account
  const adminHashedPassword = await bcrypt.hash("admin123", 10);
  
  await db
    .insert(users)
    .values({
      name: "Super Admin",
      email: "admin@propertyhub.com",
      password: adminHashedPassword,
      role: "admin",
      phone: "+91 9999999999",
    })
    .onConflictDoNothing();

  console.log("✅ Created admin account:");
  console.log("   Email: admin@propertyhub.com");
  console.log("   Password: admin123");

  // Create demo broker account
  const hashedPassword = await bcrypt.hash("demo123", 10);
  
  const [broker] = await db
    .insert(users)
    .values({
      name: "Demo Broker",
      email: "broker@demo.com",
      password: hashedPassword,
      role: "broker",
      phone: "+91 9876543210",
    })
    .onConflictDoNothing()
    .returning();

  console.log("✅ Created demo broker account:");
  console.log("   Email: broker@demo.com");
  console.log("   Password: demo123");

  if (!broker) {
    console.log("⚠️  Broker already exists, fetching...");
    const { eq } = await import("drizzle-orm");
    const [existingBroker] = await db
      .select()
      .from(users)
      .where(eq(users.email, "broker@demo.com"))
      .limit(1);
    
    if (existingBroker) {
      console.log("✅ Using existing broker for properties");
      await seedProperties(existingBroker.id);
    }
  } else {
    await seedProperties(broker.id);
  }

  console.log("🎉 Seed completed successfully!");
}

async function seedProperties(brokerId: string) {
  const sampleProperties = [
    {
      title: "Luxury 3BHK Apartment in South Delhi",
      description: "Spacious 3 bedroom apartment with modern amenities, gym, swimming pool, and parking. Located in prime location with easy access to markets and metro.",
      propertyType: "residential" as const,
      listingType: "sale" as const,
      priceMin: 7000000,
      priceMax: 8000000,
      location: "Saket",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110017",
      area: 1850,
      bedrooms: 3,
      bathrooms: 3,
      status: "available" as const,
      images: ["/attached_assets/stock_images/modern_residential_h_93df657f.jpg"],
      amenities: ["Gym", "Swimming Pool", "Parking", "Security", "Power Backup"],
      facilities: ["Elevator", "Club House", "Garden"],
      nearbyPlaces: ["Metro Station - 500m", "Schools - 1km", "Hospital - 2km"],
      brokerId,
    },
    {
      title: "Modern Office Space in Cyber City",
      description: "Premium commercial office space with high-speed internet, 24/7 power backup, and ample parking. Perfect for IT companies and startups.",
      propertyType: "commercial" as const,
      listingType: "rent" as const,
      priceMin: 150000,
      priceMax: null,
      location: "Cyber City",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      area: 3500,
      bedrooms: null,
      bathrooms: 4,
      status: "available" as const,
      images: ["/attached_assets/stock_images/commercial_office_bu_e3030318.jpg"],
      amenities: ["High Speed Internet", "Power Backup", "AC", "Parking"],
      facilities: ["Reception", "Conference Room", "Cafeteria"],
      nearbyPlaces: ["Metro - 200m", "Food Court - 100m", "Banks - 500m"],
      brokerId,
    },
    {
      title: "Residential Plot in Noida Extension",
      description: "Prime residential plot ready for construction. Clear title, approved by authority. Great investment opportunity in developing area.",
      propertyType: "land" as const,
      listingType: "sale" as const,
      priceMin: 4000000,
      priceMax: 5000000,
      location: "Greater Noida West",
      city: "Greater Noida",
      state: "Uttar Pradesh",
      pincode: "201306",
      area: 2000,
      bedrooms: null,
      bathrooms: null,
      status: "available" as const,
      images: ["/attached_assets/stock_images/vacant_land_property_82ce77fb.jpg"],
      amenities: ["Clear Title", "Approved by Authority"],
      facilities: ["Road Access", "Electricity Connection"],
      nearbyPlaces: ["Highway - 1km", "Metro Station - 3km"],
      brokerId,
    },
    {
      title: "Penthouse with Terrace Garden",
      description: "Luxurious penthouse with private terrace garden, modular kitchen, and panoramic city views. Premium fixtures and fittings throughout.",
      propertyType: "residential" as const,
      listingType: "sale" as const,
      priceMin: 14000000,
      priceMax: 16000000,
      location: "Golf Course Road",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001",
      area: 3200,
      bedrooms: 4,
      bathrooms: 4,
      status: "available" as const,
      images: ["/attached_assets/stock_images/modern_residential_h_93df657f.jpg"],
      amenities: ["Terrace Garden", "Modular Kitchen", "Parking", "Gym", "Pool"],
      facilities: ["Elevator", "Club House", "Security"],
      nearbyPlaces: ["Golf Course - 500m", "Shopping Mall - 1km", "School - 2km"],
      brokerId,
    },
    {
      title: "Retail Shop in Prime Market",
      description: "Ground floor retail space in busy commercial market. High footfall area, perfect for retail business. Ready to move in.",
      propertyType: "commercial" as const,
      listingType: "rent" as const,
      priceMin: 85000,
      priceMax: null,
      location: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      area: 800,
      bedrooms: null,
      bathrooms: 2,
      status: "available" as const,
      images: ["/attached_assets/stock_images/commercial_office_bu_e3030318.jpg"],
      amenities: ["Prime Location", "High Footfall", "Parking"],
      facilities: ["Security", "Washrooms"],
      nearbyPlaces: ["Metro - 300m", "Restaurants - Walking Distance"],
      brokerId,
    },
    {
      title: "Farmhouse Plot in NCR",
      description: "Large agricultural land perfect for farmhouse development. Peaceful location with good connectivity to highways.",
      propertyType: "land" as const,
      listingType: "lease" as const,
      priceMin: 23000000,
      priceMax: 27000000,
      location: "Chattarpur",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110074",
      area: 10000,
      bedrooms: null,
      bathrooms: null,
      status: "available" as const,
      images: ["/attached_assets/stock_images/vacant_land_property_82ce77fb.jpg"],
      amenities: ["Peaceful Location", "Highway Access"],
      facilities: ["Water Connection", "Electricity"],
      nearbyPlaces: ["Highway - 2km", "Market - 5km"],
      brokerId,
    },
    {
      title: "2BHK Apartment Near Metro",
      description: "Well-maintained 2 bedroom apartment with modern interiors. Walking distance to metro station and schools. Family-friendly community.",
      propertyType: "residential" as const,
      listingType: "rent" as const,
      priceMin: 25000,
      priceMax: null,
      location: "Dwarka",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110075",
      area: 1100,
      bedrooms: 2,
      bathrooms: 2,
      status: "available" as const,
      images: ["/attached_assets/stock_images/modern_residential_h_93df657f.jpg"],
      amenities: ["Parking", "Security", "Power Backup"],
      facilities: ["Playground", "Park"],
      nearbyPlaces: ["Metro - 300m", "Schools - 500m", "Market - 1km"],
      brokerId,
    },
    {
      title: "Commercial Warehouse Space",
      description: "Large warehouse with high ceiling, loading dock, and 24/7 security. Ideal for logistics and storage businesses.",
      propertyType: "commercial" as const,
      listingType: "sale" as const,
      priceMin: 17000000,
      priceMax: 19000000,
      location: "Manesar",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122051",
      area: 8000,
      bedrooms: null,
      bathrooms: 3,
      status: "available" as const,
      images: ["/attached_assets/stock_images/commercial_office_bu_e3030318.jpg"],
      amenities: ["Loading Dock", "High Ceiling", "24/7 Security"],
      facilities: ["CCTV", "Fire Safety", "Washrooms"],
      nearbyPlaces: ["Highway - 1km", "Industrial Area - 500m"],
      brokerId,
    },
  ];

  for (const property of sampleProperties) {
    await db.insert(properties).values(property).onConflictDoNothing();
    console.log(`✅ Added property: ${property.title}`);
  }

  console.log(`\n✅ Added ${sampleProperties.length} sample properties`);
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .then(() => {
    console.log("Exiting...");
    process.exit(0);
  });
