'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { del } from '@vercel/blob'

function sanitizeSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
}

// 1. CREATE BASE (Uses Default Language)
export async function createCategory(formData) {
  const name = formData.get('name')
  const slug = sanitizeSlug(formData.get('slug') || name)

  let newId;

  try {
    // 1. Try to find the current default language
    let defaultLang = await prisma.language.findFirst({ where: { isDefault: true } })
    
    // 2. Fallback: If no default exists, create English as default (System Bootstrap)
    if (!defaultLang) {
      defaultLang = await prisma.language.upsert({
        where: { code: 'en' },
        update: { isDefault: true },
        create: { code: 'en', name: 'English', isDefault: true }
      })
    }

    const newCat = await prisma.category.create({
      data: {
        slug,
        translations: {
          create: {
            languageId: defaultLang.id,
            name: name,
            description: '' 
          }
        }
      }
    })
    
    newId = newCat.id;

  } catch (error) {
    console.error("Create error:", error)
    throw error 
  }

  if (newId) redirect(`/admin/categories/${newId}`)
}

// 2. UPDATE SHARED
export async function updateCategoryShared(formData) {
  const id = formData.get('id')
  const slug = sanitizeSlug(formData.get('slug'))
  const imageUrl = formData.get('imageUrl')

  const isFeatured = formData.get('isFeatured') === 'on'
  const featuredOrder = isFeatured 
  ? parseInt(formData.get('featuredOrder') || '0') 
  : null;

  // SLUG VALIDATION
  if (!slug || slug.trim() === '') throw new Error("Validation Failed: Slug cannot be empty.")
  
  const oldCat = await prisma.category.findUnique({ where: { id } })
  if (oldCat?.imageUrl && oldCat.imageUrl !== imageUrl && oldCat.imageUrl.includes('public.blob.vercel-storage.com')) {
      try { await del(oldCat.imageUrl) } catch(e) {}
  }

  // UPDATE CATEGORY
  await prisma.category.update({
    where: { id },
    data: { slug, imageUrl, isFeatured, featuredOrder }
  })
  
  revalidatePath(`/admin/categories/${id}`)
  revalidatePath('/admin/categories')
}

export async function toggleCategoryStatus(id, newStatus) {
  if (newStatus) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { translations: { include: { language: true } } }
    })
    // Check for DEFAULT language translation instead of 'en'
    const defaultTrans = category.translations.find(t => t.language.isDefault)

    if (!defaultTrans || !defaultTrans.name || defaultTrans.name.trim() === '') {
      throw new Error("Cannot Activate: Default Language Name is missing.")
    }
  }
  await prisma.category.update({ where: { id }, data: { isActive: newStatus } })
  revalidatePath('/admin/categories')
}

// 3. SAVE TRANSLATION
export async function saveTranslation(formData) {
  const categoryId = formData.get('categoryId')
  const languageId = formData.get('languageId')
  const name = formData.get('name')
  const description = formData.get('description')

  if (!name || name.trim() === '') {
    const lang = await prisma.language.findUnique({ where: { id: languageId } })
    // If we are removing the name from the DEFAULT language, force deactivate
    if (lang?.isDefault) {
        await prisma.category.update({
            where: { id: categoryId },
            data: { isActive: false }
        })
    }
  }

  await prisma.categoryTranslation.upsert({
    where: {
      categoryId_languageId: { categoryId, languageId }
    },
    update: { name, description },
    create: { categoryId, languageId, name, description }
  })

  revalidatePath(`/admin/categories/${categoryId}`)
}

// 4. DELETE
export async function deleteCategory(id) {
  try {
    // A. Find the record first
    const cat = await prisma.category.findUnique({ where: { id } })
    
    if (cat?.imageUrl && cat.imageUrl.includes('public.blob.vercel-storage.com')) {
       // B. Delete the file from Vercel
       try { await del(cat.imageUrl) } catch(e) { console.error("Blob delete failed", e) }
    }
    await prisma.category.delete({ where: { id } })
    revalidatePath('/admin/categories')
  } catch (error) {
    console.error("Delete failed", error)
  }
}