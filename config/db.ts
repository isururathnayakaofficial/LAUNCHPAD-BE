import { MongoClient, Db } from "mongodb";

let client: MongoClient | undefined;
let db: Db;

export async function connectDB(): Promise<Db> {
  const uri: string | undefined = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log("MongoDB Connected");

    db = client.db("launchpad");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}