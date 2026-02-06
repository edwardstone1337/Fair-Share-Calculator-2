import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/utils/logger";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/auth/error", request.url));
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL("/auth/error", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    logger.error("auth/callback: code exchange failed", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}
