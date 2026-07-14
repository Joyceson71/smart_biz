import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/callback
 *
 * Supabase OAuth callback handler. After a user signs in via a third-party
 * provider (Google, GitHub, etc.), Supabase redirects here with a `code`
 * parameter. We exchange the code for a session and redirect to the dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    // No code means this is not a valid OAuth callback; send to login
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("OAuth callback error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  // Successful exchange — redirect to the intended destination
  return NextResponse.redirect(`${origin}${next}`);
}
