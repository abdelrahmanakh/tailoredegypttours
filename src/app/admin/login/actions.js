'use server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth' // Import from your new auth lib
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function loginAdmin(prevState, formData) {
  console.log("Prisma Instance:", prisma); // Should NOT be undefined
  console.log("Available Models:", Object.keys(prisma || {})); // Should include 'admin'
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { message: 'Please enter all fields' }
  }

  // 1. Find user in DB
  const admin = await prisma.admin.findUnique({
    where: { email },
  })

  if (!admin) {
    return { message: 'Invalid credentials' } // Generic message for security
  }

  // 2. Compare the provided password with the stored hash
  const passwordsMatch = await bcrypt.compare(password, admin.password)

  if (!passwordsMatch) {
    return { message: 'Invalid credentials' }
  }

  // 3. Create secure session
  await createSession(admin.id)

  // 4. Redirect
  redirect('/admin')
}