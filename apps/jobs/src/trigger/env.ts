import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  ENCRYPTION_SECRET_KEY: process.env.ENCRYPTION_SECRET_KEY as string,
  APP_ENV: process.env.APP_ENV || "development",
};