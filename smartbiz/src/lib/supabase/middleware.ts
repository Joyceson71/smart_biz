import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { ROUTES } from "@/lib/constants/routes";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/invoices", "/expenses", "/customers", "/vendors", "/cash-flow", "/reports", "/ai-assistant", "/settings", "/notifications"];

// Routes accessible only when NOT authenticated
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

// Routes excluded from auth middleware entirely
const PUBLIC_ROUTES = ["/api/health", "/api/webhooks", "/", "/api/auth"];

// Role-restricted routes
const ROLE_RESTRICTED_ROUTES: Record<string, string[]> = {
  "/settings/team": ["owner", "admin"],
  "/settings/billing": ["owner"],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — MUST be called before any auth checks
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Skip middleware for public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return supabaseResponse;
  }

  // Redirect unauthenticated users to login
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.DASHBOARD;
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (user && isProtected) {
    const restrictedRoute = Object.entries(ROLE_RESTRICTED_ROUTES).find(([route]) =>
      pathname.startsWith(route)
    );

    if (restrictedRoute) {
      const [, allowedRoles] = restrictedRoute;
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userData && !allowedRoles.includes(userData.role)) {
        const url = request.nextUrl.clone();
        url.pathname = ROUTES.DASHBOARD;
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
