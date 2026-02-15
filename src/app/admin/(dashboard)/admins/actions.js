'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/auth' //

export async function createAdmin(formData) {
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password || !name) {
    throw new Error('All fields are required.')
  }

  // 1. Check if email exists
  const existing = await prisma.admin.findUnique({
    where: { email }
  })

  if (existing) {
    throw new Error('Admin with this email already exists.')
  }

  // 2. Hash Password
  const hashedPassword = await bcrypt.hash(password, 12)

  // 3. Create Admin
  await prisma.admin.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  revalidatePath('/admin/admins')
}

export async function deleteAdmin(adminId) {
  // 1. Get current session
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session')?.value
  const session = await verifySession(sessionToken) //

  // 2. Security Check
  if (!session || !session.userId) {
     throw new Error('Unauthorized')
  }

  // 3. Prevent Self-Deletion
  if (session.userId === adminId) {
      throw new Error("You cannot delete your own account.")
  }

  try {
    await prisma.admin.delete({
      where: { id: adminId }
    })
    revalidatePath('/admin/admins')
  } catch (error) {
    throw new Error('Failed to delete admin')
  }
}