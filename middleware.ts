import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Skip auth for API status endpoint (for Clawdbot to ping)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('eden-auth')
  
  if (authCookie?.value === process.env.DASHBOARD_SECRET) {
    return NextResponse.next()
  }

  // Check for login attempt
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // Redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
