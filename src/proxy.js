import { NextResponse } from 'next/server'

export function proxy(req) {
  // Check if user is trying to access admin pages
  const isLogin = req.nextUrl.pathname === '/admin/login'

  // Check for a specific cookie "admin_session"
  const isAuthenticated = req.cookies.get('admin_session')?.value === process.env.ADMIN_PASS

  if (!isAuthenticated && !isLogin) {
    // Redirect to custom login page
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}