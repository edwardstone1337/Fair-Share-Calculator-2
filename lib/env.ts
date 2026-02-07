import { logger } from "@/lib/utils/logger";

export function getServerEnv() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

  if (!SUPABASE_URL) {
    logger.warn("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!SUPABASE_ANON_KEY) {
    logger.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }

  return {
    SUPABASE_URL: SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ?? "",
    SITE_URL: SITE_URL ?? "http://localhost:3000",
  };
}
