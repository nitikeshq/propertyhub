import { db } from "./db";
import { users, properties } from "@shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Starting seed...");

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
    const [existingBroker] = await db
      .select()
      .from(users)
      .where({ email: "broker@demo.com" as any })
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
      price: 7500000,
      location: "Saket",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110017",
      area: 1850,
      bedrooms: 3,
      bathrooms: 3,
      status: "available" as const,
      brokerId,
    },
    {
      title: "Modern Office Space in Cyber City",
      description: "Premium commercial office space with high-speed internet, 24/7 power backup, and ample parking. Perfect for IT companies and startups.",
      propertyType: "commercial" as const,
      price: 12000000,
      location: "Cyber City",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      area: 3500,
      bedrooms: null,
      bathrooms: 4,
      status: "available" as const,
      brokerId,
    },
    {
      title: "Residential Plot in Noida Extension",
      description: "Prime residential plot ready for construction. Clear title, approved by authority. Great investment opportunity in developing area.",
      propertyType: "land" as const,
      price: 4500000,
      location: "Greater Noida West",
      city: "Greater Noida",
      state: "Uttar Pradesh",
      pincode: "201306",
      area: 2000,
      bedrooms: null,
      bathrooms: null,
      status: "available" as const,
      brokerId,
    },
    {
      title: "Penthouse with Terrace Garden",
      description: "Luxurious penthouse with private terrace garden, modular kitchen, and panoramic city views. Premium fixtures and fittings throughout.",
      propertyType: "residential" as const,
      price: 15000000,
      location: "Golf Course Road",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001",
      area: 3200,
      bedrooms: 4,
      bathrooms: 4,
      status: "available" as const,
      brokerId,
    },
    {
      title: "Retail Shop in Prime Market",
      description: "Ground floor retail space in busy commercial market. High footfall area, perfect for retail business. Ready to move in.",
      propertyType: "commercial" as const,
      price: 8500000,
      location: "Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      area: 800,
      bedrooms: null,
      bathrooms: 2,
      status: "available" as const,
      brokerId,
    },
    {
      title: "Farmhouse Plot in NCR",
      description: "Large agricultural land perfect for farmhouse development. Peaceful location with good connectivity to highways.",
      propertyType: "land" as const,
      price: 25000000,
      location: "Chattarpur",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110074",
      area: 10000,
      bedrooms: null,
      bathrooms: null,
      status: "available" as const,
      brokerId,
    },
    {
      title: "2BHK Apartment Near Metro",
      description: "Well-maintained 2 bedroom apartment with modern interiors. Walking distance to metro station and schools. Family-friendly community.",
      propertyType: "residential" as const,
      price: 4200000,
      location: "Dwarka",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110075",
      area: 1100,
      bedrooms: 2,
      bathrooms: 2,
      status: "available" as const,
      brokerId,
    },
    {
      title: "Commercial Warehouse Space",
      description: "Large warehouse with high ceiling, loading dock, and 24/7 security. Ideal for logistics and storage businesses.",
      propertyType: "commercial" as const,
      price: 18000000,
      location: "Manesar",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122051",
      area: 8000,
      bedrooms: null,
      bathrooms: 3,
      status: "available" as const,
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
