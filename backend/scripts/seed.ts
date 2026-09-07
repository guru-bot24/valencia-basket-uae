import { db } from "../db";
import { events, adminUsers } from "../shared/schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const existingAdmins = await db.select().from(adminUsers);
  if (existingAdmins.length > 0) {
    console.log("Admin users already seeded, skipping...");
  } else {
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    if (!adminPassword) {
      console.log("ADMIN_SEED_PASSWORD not set, skipping admin user seed.");
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await db.insert(adminUsers).values({
        username: "admin",
        passwordHash,
        role: "admin",
      });
      console.log("Admin user seeded.");
    }
  }

  const existingEvents = await db.select().from(events);
  if (existingEvents.length > 0) {
    console.log("Events already seeded, skipping...");
  } else {
    await db.insert(events).values([
      {
        slug: "spring-break-camp",
        title: "Spring Break Camp",
        date: "March 24 - March 27, 2026",
        endDate: "2026-03-27",
        time: "9:00 AM - 1:00 PM",
        location: "Umm Suqueim Girls School",
        description: "A 4-day intensive camp during spring break. Perfect for players looking to sharpen their skills and stay active during the holidays. Focus on fundamentals, teamwork, and game situations.",
        status: "Completed",
        price: "850 AED",
        image: "/images/mini-basket-team.jpg",
        category: "Camp",
        featured: true,
      },
      {
        slug: "valencia-trip",
        title: "Trip to L\u2019Alqueria del Basket, Valencia",
        date: "June 15 - June 19, 2026",
        endDate: "2026-06-19",
        time: "5-Day Trip",
        location: "Valencia, Spain",
        description: "An exclusive 5-day basketball experience at the home of Valencia Basket. Train at L\u2019Alqueria del Basket, experience the ROIG Arena, and immerse yourself in Spanish basketball culture. A once-in-a-lifetime opportunity.",
        status: "Completed",
        price: "10,000 AED",
        image: "/images/spain-camp.jpg",
        category: "International",
        featured: true,
      },
      {
        slug: "summer-camp",
        title: "Summer Camp UAE",
        date: "July - August 2026",
        endDate: "2026-08-31",
        time: "Multiple Sessions",
        location: "Dubai Sports City",
        description: "Our flagship summer program returns with multiple weekly sessions throughout July and August. Age-appropriate training, competitions, and fun activities to keep players engaged all summer long.",
        status: "Registration Open",
        price: "TBA",
        image: "/images/summer-camp-1.jpg",
        category: "Camp",
        featured: true,
      },
    ]);
    console.log("Events seeded.");
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});