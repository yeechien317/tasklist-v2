import "dotenv/config";
import { connectToDatabase, closeDatabaseConnection } from "./server/mongodb.js";

async function testConnection() {
  try {
    console.log("Testing MongoDB connection...");
    const db = await connectToDatabase();

    // Ping the database to confirm connection
    await db.command({ ping: 1 });
    console.log("✓ Successfully pinged MongoDB deployment!");

    // List collections to verify access
    const collections = await db.listCollections().toArray();
    console.log(`✓ Found ${collections.length} collections`);

    await closeDatabaseConnection();
    console.log("✓ Connection closed successfully");
  } catch (error) {
    console.error("✗ Connection failed:", error);
    process.exit(1);
  }
}

testConnection();
