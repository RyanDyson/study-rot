import { type Config } from "drizzle-kit";

import { env } from "@/env";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
