import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { authRateLimit, apiRateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? '127.0.0.1'
  const path = request.nextUrl.pathname

  // Apply Auth rate limit
  if (path === '/login' || path === '/register' || path === '/reset-password') {
    const { success } = await authRateLimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      )
    }
  } 
  // Apply API rate limit
  else if (path.startsWith('/api/')) {
    const { success } = await apiRateLimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: "Too many API requests. Please try again later." },
        { status: 429 }
      )
    }
  }

  const response = await updateSession(request)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
