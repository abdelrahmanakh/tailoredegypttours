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
export async function createDestination(formData) {
  const name = formData.get('name')
  const slug = sanitizeSlug(formData.get('slug') || name)
  const imageUrl = formData.get('imageUrl')
  let newDestId;

  try {
    // 1. Try to find the current default language
    let defaultLang = await prisma.language.findFirst({ where: { isDefault: true } })
    
    // 2. Fallback: Bootstrap English if no default exists
    if (!defaultLang) {
      defaultLang = await prisma.language.upsert({
        where: { code: 'en' },
        update: { isDefault: true },
        create: { code: 'en', name: 'English', isDefault: true }
      })
    }

    // Create Destination + Default Translation
    const newDest = await prisma.destination.create({
      data: {
        slug,
        imageUrl,
        translations: {
          create: {
            languageId: defaultLang.id,
            name: name,
            description: '' 
          }
        }
      }
    })
    newDestId = newDest.id

  } catch (error) {
    console.error("Create error:", error)
    throw error 
  }
  if (newDestId) {
    redirect(`/admin/destinations/${newDestId}`)
  }
}

// 2. UPDATE SHARED FIELDS (Image, Slug)
export async function updateDestinationShared(formData) {
  const id = formData.get('id')
  const slug = sanitizeSlug(formData.get('slug'))
  const imageUrl = formData.get('imageUrl')

  const isFeatured = formData.get('isFeatured') === 'on'
  const featuredOrder = isFeatured 
  ? parseInt(formData.get('featuredOrder') || '0') 
  : null;

  // 1. SLUG VALIDATION
  if (!slug || slug.trim() === '') {
    throw new Error("Validation Failed: Slug cannot be empty.")
  }

  // 2. UPDATE DESTINATION
  await prisma.destination.update({
    where: { id },
    data: { slug, imageUrl, isFeatured, featuredOrder }
  })
  
  revalidatePath(`/admin/destinations/${id}`)
  revalidatePath('/admin/destinations')
}

// 3. SAVE TRANSLATION
export async function saveTranslation(formData) {
  const destinationId = formData.get('destinationId')
  const languageId = formData.get('languageId')
  const name = formData.get('name')
  const description = formData.get('description')

  if (!name || name.trim() === '') {
    const lang = await prisma.language.findUnique({ where: { id: languageId } })
    
    // Check if this is the DEFAULT language
    if (lang?.isDefault) {
        // FORCE DEACTIVATE
        await prisma.destination.update({
            where: { id: destinationId },
            data: { isActive: false }
        })
    }
  }
  
  await prisma.destinationTranslation.upsert({
    where: {
      destinationId_languageId: { destinationId, languageId }
    },
    update: { name, description },
    create: { destinationId, languageId, name, description }
  })

  revalidatePath(`/admin/destinations/${destinationId}`)
}

export async function toggleDestinationStatus(id, newStatus) {
  // If activating, run validation
  if (newStatus) {
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: { translations: { include: { language: true } } }
    })
    // Check Default Language
    const defaultTrans = destination.translations.find(t => t.language.isDefault)
    
    if (!defaultTrans || !defaultTrans.name || defaultTrans.name.trim() === '') {
      throw new Error("Cannot Activate: Default Language Name is missing.")
    }
  }

  await prisma.destination.update({
    where: { id },
    data: { isActive: newStatus }
  })
  
  revalidatePath('/admin/destinations')
}

// 4. DELETE
export async function deleteDestination(id) {
  try {
  await prisma.destination.delete({ where: { id } })
  revalidatePath('/admin/destinations')
  } catch (error) {
    console.error("Delete error:", error)
  }
}