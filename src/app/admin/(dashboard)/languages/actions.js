'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// 1. UPSERT (Create/Edit)
export async function upsertLanguage(formData) {
  const id = formData.get('id')
  const code = formData.get('code').toLowerCase()
  const name = formData.get('name')
  // We don't handle isDefault here anymore (done via separate action), unless it's the first one.
  
  const data = { code, name }

  if (id) {
    await prisma.language.update({ where: { id }, data })
  } else {
    // If it's the FIRST language, make it default automatically
    const count = await prisma.language.count()
    await prisma.language.create({
      data: { ...data, isDefault: count === 0 }
    })
  }

  revalidatePath('/admin/languages')
}

// 2. MAKE DEFAULT (Enforces "Only One")
export async function setLanguageDefault(id) {
  // Transaction: Unset all -> Set new one
  await prisma.$transaction([
    prisma.language.updateMany({
      data: { isDefault: false }
    }),
    prisma.language.update({
      where: { id },
      data: { isDefault: true, isActive: true } // Force active if default
    })
  ])

  revalidatePath('/admin/languages')
}

// 3. TOGGLE ACTIVE STATUS (Soft Delete)
export async function toggleLanguageStatus(id, isActive) {
  const lang = await prisma.language.findUnique({ where: { id } })
  
  // Prevent disabling the Default language
  if (lang.isDefault && !isActive) {
    throw new Error("You cannot disable the Default language. Please set a new default first.")
  }

  await prisma.language.update({
    where: { id },
    data: { isActive }
  })
  
  revalidatePath('/admin/languages')
}

// 4. DELETE (Hard Delete - Use with caution)
export async function deleteLanguage(id) {
  const lang = await prisma.language.findUnique({ where: { id } })
  if (lang.isDefault) throw new Error("Cannot delete the default language.")
  
  await prisma.language.delete({ where: { id } })
  revalidatePath('/admin/languages')
}