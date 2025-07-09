// backend/src/db/client.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./src";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error(" DATABASE_URL not found in .env");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, {
  schema,
  // Optional: converts camelCase <-> snake_case
  // casing: "snake_case",
});
