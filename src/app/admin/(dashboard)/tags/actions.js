'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function sanitizeSlug(text) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
}

// 1. CREATE BASE (Uses Default Language)
export async function createTag(formData) {
  const name = formData.get('name')
  const slug = sanitizeSlug(formData.get('slug') || name)

  let newId;

  try {
    // 1. Try to find the current default language
    let defaultLang = await prisma.language.findFirst({ where: { isDefault: true } })
    
    // 2. Fallback
    if (!defaultLang) {
      defaultLang = await prisma.language.upsert({
        where: { code: 'en' },
        update: { isDefault: true },
        create: { code: 'en', name: 'English', isDefault: true }
      })
    }

    const newTag = await prisma.tag.create({
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
    
    newId = newTag.id;

  } catch (error) {
    console.error("Create error:", error)
    throw error 
  }

  if (newId) redirect(`/admin/tags/${newId}`)
}

// 2. UPDATE SHARED (Slug only, NO Image)
export async function updateTagShared(formData) {
  const id = formData.get('id')
  const slug = sanitizeSlug(formData.get('slug'))
  const isFeatured = formData.get('isFeatured') === 'on'
  const featuredOrder = isFeatured 
  ? parseInt(formData.get('featuredOrder') || '0') 
  : null;

  // SLUG CHECK
  if (!slug || slug.trim() === '') throw new Error("Validation Failed: Slug cannot be empty.")
  
  // UPDATE TAG
  await prisma.tag.update({
    where: { id },
    data: { slug, isFeatured, featuredOrder, }
  })
  
  revalidatePath(`/admin/tags/${id}`)
  revalidatePath('/admin/tags')
}

export async function toggleTagStatus(id, newStatus) {
  if (newStatus) {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { translations: { include: { language: true } } }
    })
    // Check Default Language
    const defaultTrans = tag.translations.find(t => t.language.isDefault)
    if (!defaultTrans || !defaultTrans.name || defaultTrans.name.trim() === '') {
      throw new Error("Cannot Activate: Default Language Name is missing.")
    }
  }
  await prisma.tag.update({ where: { id }, data: { isActive: newStatus } })
  revalidatePath('/admin/tags')
}

// 3. SAVE TRANSLATION
export async function saveTranslation(formData) {
  const tagId = formData.get('tagId')
  const languageId = formData.get('languageId')
  const name = formData.get('name')
  const description = formData.get('description')

  if (!name || name.trim() === '') {
    const lang = await prisma.language.findUnique({ where: { id: languageId } })
    // If we are editing the Default Language
    if (lang?.isDefault) {
        await prisma.tag.update({
            where: { id: tagId },
            data: { isActive: false }
        })
    }
  }

  await prisma.tagTranslation.upsert({
    where: {
      tagId_languageId: { tagId, languageId }
    },
    update: { name, description },
    create: { tagId, languageId, name, description }
  })

  revalidatePath(`/admin/tags/${tagId}`)
}

// 4. DELETE
export async function deleteTag(id) {
  try {
    await prisma.tag.delete({ where: { id } })
    revalidatePath('/admin/tags')
  } catch (error) {
    console.error("Delete failed", error)
  }
}