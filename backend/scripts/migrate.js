const sequelize = require("../config/database");
const { User, Store, Rating } = require("../models");
require("dotenv").config();

async function migrate() {
  try {
    console.log("Starting database migration...");

    // Sync all models
    await sequelize.sync({ force: true });
    console.log("Database synced successfully");

    // Create default admin user (password will be hashed by model hook)
    const admin = await User.create({
      name: "System Administrator Account",
      email: "admin@example.com",
      password: "Admin@123",
      address: "123 Admin Street, Admin City, AdminState 12345",
      role: "admin",
    });
    console.log("Admin user created:", admin.email);

    // Create sample stores
    const store1 = await Store.create({
      name: "Awesome Electronics Store Location",
      email: "electronics@store.com",
      address: "456 Market Street, Tech City, State 54321",
    });

    const store2 = await Store.create({
      name: "Premium Fashion Boutique Shop",
      email: "fashion@boutique.com",
      address: "789 Fashion Avenue, Style City, State 67890",
    });

    console.log("Sample stores created");

    // Create store owners (passwords will be hashed by model hook)
    const owner1 = await User.create({
      name: "Store Owner Electronics",
      email: "owner1@example.com",
      password: "Owner@123",
      address: "456 Market Street, Tech City, State 54321",
      role: "owner",
      storeId: store1.id,
    });

    const owner2 = await User.create({
      name: "Store Owner Fashion Boutique",
      email: "owner2@example.com",
      password: "Owner@123",
      address: "789 Fashion Avenue, Style City, State 67890",
      role: "owner",
      storeId: store2.id,
    });

    console.log("Store owners created");

    // Create sample normal user (password will be hashed by model hook)
    const user1 = await User.create({
      name: "Regular User Test Account",
      email: "user@example.com",
      password: "User@123",
      address: "321 User Lane, Customer City, State 11111",
      role: "user",
    });

    console.log("Sample user created");

    // Create sample ratings
    await Rating.create({
      userId: user1.id,
      storeId: store1.id,
      rating: 5,
    });

    await Rating.create({
      userId: user1.id,
      storeId: store2.id,
      rating: 4,
    });

    // Update store ratings
    await store1.update({ averageRating: 5.0, totalRatings: 1 });
    await store2.update({ averageRating: 4.0, totalRatings: 1 });

    console.log("Sample ratings created");
    console.log("\n=== Migration Completed Successfully ===");
    console.log("\nDefault Credentials:");
    console.log("Admin: admin@example.com / Admin@123");
    console.log("Owner1: owner1@example.com / Owner@123");
    console.log("Owner2: owner2@example.com / Owner@123");
    console.log("User: user@example.com / User@123\n");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
