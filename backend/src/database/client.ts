// src/database/client.ts

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import "dotenv/config";

// Ensure the environment variable is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found in .env");
}

// Create the Neon SQL client
const sql = neon(process.env.DATABASE_URL);

// Export the Drizzle database instance
export const db = drizzle(sql, {
  schema,
  casing: "snake_case", // Optional: adjust if your DB uses snake_case
});
