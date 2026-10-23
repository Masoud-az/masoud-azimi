import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
