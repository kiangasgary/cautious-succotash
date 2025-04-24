import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Refresh session if expired
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    // If there's an error or no session on protected routes, redirect to login
    const protectedRoutes = ['/my-summaries']
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

    if ((error || !session) && isProtectedRoute) {
      const redirectUrl = new URL('/login', request.url)
      // Preserve the original URL to redirect back after login
      redirectUrl.searchParams.set('returnTo', request.nextUrl.pathname + request.nextUrl.search)
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (e) {
    console.error('Middleware error:', e)
    return NextResponse.next()
  }
}

// Ensure the middleware is run for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 