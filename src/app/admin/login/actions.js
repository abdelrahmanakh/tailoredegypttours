'use server'
import { cookies } from 'next/headers'

export async function setAdminCookie(username, password) {
  // Check BOTH username and password
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    
    // Set a cookie that expires in 1 day
    const cookieStore = await cookies()
    
    // We store the password (or a token) in the cookie to verify identity in middleware
    cookieStore.set('admin_session', password, { 
      httpOnly: true, 
      path: '/',
      maxAge: 60 * 60 * 24 
    })
    return true
  }
  return false
}