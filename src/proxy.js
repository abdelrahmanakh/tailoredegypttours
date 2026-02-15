import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth' // You'll need to adapt verifySession for Edge or use standard jose here

// NOTE: We copy the verify logic here because 'lib/auth' might import 'next/headers' 
// which sometimes causes issues in Middleware depending on Next.js version.
// Ideally, split 'verifySession' into a pure-logic file. 
// For now, let's use direct jose verification here for safety.
import { jwtVerify } from 'jose'

const secretKey = process.env.AUTH_SECRET || 'your-super-secret-key-change-this-in-env'
const encodedKey = new TextEncoder().encode(secretKey)

export async function proxy(req) {
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const cookie = req.cookies.get('session')?.value

  // 1. Validate the session
  let session = null
  if (cookie) {
    try {
      const { payload } = await jwtVerify(cookie, encodedKey, {
        algorithms: ['HS256'],
      })
      session = payload
    } catch (err) {
      // Invalid token
    }
  }

  // 2. Protection Logic
  // If user is NOT authenticated and trying to access admin pages (except login)
  if (!session && req.nextUrl.pathname.startsWith('/admin') && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // If user IS authenticated and trying to access login page, send to dashboard
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}