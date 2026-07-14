import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/health
 *
 * Returns the operational status of the application and its database
 * connection. Used by monitoring tools and Vercel deployment checks.
 * This route is intentionally public (no auth required).
 */
export async function GET() {
  const start = Date.now();

  try {
    // Ping the database with a lightweight query
    const supabase = await createClient();
    const { error } = await supabase
      .from("customers")
      .select("count", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        {
          status: "degraded",
          db: "error",
          error: error.message,
          latency_ms: Date.now() - start,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "ok",
      db: "connected",
      latency_ms: Date.now() - start,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        db: "unreachable",
        error: err instanceof Error ? err.message : String(err),
        latency_ms: Date.now() - start,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
