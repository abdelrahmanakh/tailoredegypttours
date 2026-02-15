'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { validateTourData } from './validation'
import { del } from '@vercel/blob';

// -----------------------------------------------------------------------------
// HELPER: VALIDATION LOGIC
// -----------------------------------------------------------------------------

export async function validateTour(tourId) {
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: {
      translations: { include: { language: true } },
      images: true,
      schedules: true,
      location: true,
      itinerary: true,
      audioGuides: true,
      FAQs: true
    }
  });
  return validateTourData(tour);
}

// HELPER: Strict Slugify (Lower case, numbers, hyphens only)
function sanitizeSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^a-z0-9-]/g, '')  // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '')          // Trim - from end
}
// 2. Validate Helper (Throws error if missing)
function requireNumber(value, fieldName) {
  if (value === null || value === undefined || value.toString().trim() === '') {
    throw new Error(`${fieldName} cannot be empty.`)
  }
  const num = Number(value)
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a valid number.`)
  }
  return num
}

// 1. CREATE BASE (Used by new/page.js)
export async function createBaseTour(formData) {
  const title = formData.get('title')
  const slug = sanitizeSlug(formData.get('slug') || title)
  
  let durationDays, priceAdult, priceChild;
  
  try {
      durationDays = requireNumber(formData.get('durationDays'), 'Duration')
      priceAdult = Math.round(requireNumber(formData.get('priceAdult'), 'Adult Price') * 100)
      priceChild = Math.round(requireNumber(formData.get('priceChild'), 'Child Price') * 100)
  } catch (e) {
      throw e
  }

  const destinationId = formData.get('destinationId')
  const categoryId = formData.get('categoryId')

  const maxCapRaw = formData.get('maxCapacity')
  const maxCapacity = maxCapRaw ? parseInt(maxCapRaw) : 0

  let defaultLang = await prisma.language.findFirst({ where: { isDefault: true } })
  if (!defaultLang) {
    defaultLang = await prisma.language.upsert({
        where: { code: 'en' },
        update: { isDefault: true, isActive: true },
        create: { code: 'en', name: 'English', isDefault: true, isActive: true }
    })
  }

  const newTour = await prisma.tour.create({
    data: {
      slug,
      durationDays,
      priceAdult,
      priceChild,
      maxCapacity,
      isActive: false, 
      destinationId,
      categoryId,
      translations: {
        create: {
          languageId: defaultLang.id,
          title: title,
          description: '', 
        }
      }
    }
  })

  redirect(`/admin/tours/${newTour.id}`)
}

// 2. TOGGLE STATUS (Uses Validator)
export async function toggleTourStatus(tourId, shouldActivate) {
  if (shouldActivate) {
    const { hard } = await validateTour(tourId);
    if (hard.length > 0) throw new Error(`Cannot Activate: ${hard.join(', ')}`);
  }

  await prisma.tour.update({
    where: { id: tourId },
    data: { isActive: shouldActivate }
  });

  revalidatePath(`/admin/tours/${tourId}`);
  revalidatePath('/admin/tours');
}

// 3. DELETE PERMANENTLY (Used by AdminTourCard)
export async function deleteTourPermanently(tourId) {
  try {
    // A. Fetch all images attached to this tour
    const tourImages = await prisma.tourImage.findMany({
      where: { tourId },
      select: { url: true }
    });
    // B. Loop and delete from Vercel Blob
    // We use Promise.all to delete them in parallel for speed
    if (tourImages.length > 0) {
      const deletePromises = tourImages
        .filter(img => img.url && img.url.includes('public.blob.vercel-storage.com'))
        .map(img => del(img.url).catch(e => console.error("Failed to delete blob:", img.url)));
      
      await Promise.all(deletePromises);
    }
    await prisma.tour.delete({ where: { id: tourId } });
    revalidatePath('/admin/tours');
    revalidatePath('/tours');
  } catch (error) {
    console.error("Failed to delete:", error);
    throw new Error("Failed to delete tour");
  }
}

// 4. UPDATE BASIC SHARED INFO
export async function updateTourShared(formData) {
  const id = formData.get('id')
  const slug = sanitizeSlug(formData.get('slug'))
  const destinationId = formData.get('destinationId')
  const categoryId = formData.get('categoryId')
  
  const durationDays = requireNumber(formData.get('durationDays'), 'Duration')
  const priceAdultRaw = requireNumber(formData.get('priceAdult'), 'Adult Price')
  const priceChildRaw = requireNumber(formData.get('priceChild'), 'Child Price')

  const maxCapRaw = formData.get('maxCapacity')
  const maxCapacity = maxCapRaw ? parseInt(maxCapRaw) : 0

  const isFeatured = formData.get('isFeatured') === 'on'
  const featuredOrder = isFeatured ? parseInt(formData.get('featuredOrder') || '0') : null

  if (!slug || slug.trim() === '') throw new Error("Slug cannot be empty")

  await prisma.tour.update({
    where: { id },
    data: {
      slug, destinationId, categoryId,
      durationDays,priceAdult: Math.round(priceAdultRaw * 100), // Convert to Cents
      priceChild: Math.round(priceChildRaw * 100), maxCapacity,
      isFeatured, featuredOrder
    }
  })

  revalidatePath(`/admin/tours/${id}`)
}

// 5. SAVE TOUR TRANSLATION (Content Tab)
export async function saveTourTranslation(formData) {
  const tourId = formData.get('tourId')
  const languageId = formData.get('languageId')
  
  const data = {
    title: formData.get('title') || null, 
    Overview: formData.get('Overview') || null,
    description: formData.get('description') || null,
    highlights: formData.get('highlights') || null,
    included: formData.get('included') || null,
    excluded: formData.get('excluded') || null
  }

  // Deactivate if Default Language Title or Overview is removed
  if ((!data.title || !data.Overview) && (await isDefaultLang(languageId))) {
     await prisma.tour.update({ where: { id: tourId }, data: { isActive: false } })
  }

  await prisma.tourTranslation.upsert({
    where: { tourId_languageId: { tourId, languageId } },
    update: data,
    create: { tourId, languageId, ...data }
  })

  revalidatePath(`/admin/tours/${tourId}`)
}

// Helper
async function isDefaultLang(langId) {
  const lang = await prisma.language.findUnique({ where: { id: langId } })
  return lang?.isDefault === true
}


// 6. GALLERY: DELETE IMAGE
export async function deleteTourImage(imageId) {
  const image = await prisma.tourImage.findUnique({ where: { id: imageId } })
  if (!image) return
  // B. Delete from Vercel Blob (Clean up storage)
  // We check if it's a Vercel URL to avoid errors with external links
  if (image.url && image.url.includes('public.blob.vercel-storage.com')) {
    try {
      await del(image.url); 
    } catch (error) {
      console.error("Vercel Blob Cleanup Failed:", error);
      // We continue executing. Failing to delete the blob shouldn't stop the DB delete.
    }
  }
  const wasPrimary = image.isPrimary;
  await prisma.tourImage.delete({ where: { id: imageId } })
  if (wasPrimary) {
    await prisma.tour.update({ 
        where: { id: image.tourId }, 
        data: { isActive: false } 
    })
  }
  revalidatePath(`/admin/tours/${image.tourId}`)
}

// 7. GALLERY: MAKE PRIMARY
export async function setPrimaryImage(tourId, imageId) {
  // Transaction: Unset all others, Set this one
  await prisma.$transaction([
    prisma.tourImage.updateMany({
      where: { tourId },
      data: { isPrimary: false }
    }),
    prisma.tourImage.update({
      where: { id: imageId },
      data: { isPrimary: true }
    })
  ])

  revalidatePath(`/admin/tours/${tourId}`)
}

// 8. GALLERY: UPSERT IMAGE (Handle Add/Edit + Alt Text)
// This is the "Smart" function that handles both creating NEW images 
// and updating the Alt Text of existing ones.
export async function upsertTourImage(formData) {
  const tourId = formData.get('tourId')
  const imageId = formData.get('imageId') // 'new' or UUID
  const languageId = formData.get('languageId')
  const url = formData.get('url')
  const altText = formData.get('altText')

  const order = parseInt(formData.get('order') || '0')
  const isPrimary = formData.get('isPrimary') === 'on'

  if (!url) throw new Error("Image URL is required")

  if (isPrimary) {
    await prisma.tourImage.updateMany({
      where: { tourId },
      data: { isPrimary: false }
    })
  }

  // A. UPDATE EXISTING
  if (imageId && imageId !== 'new') {
    // 1. Fetch current data to check old URL
    const currentImage = await prisma.tourImage.findUnique({ where: { id: imageId } })
    
    // 2. If URL changed, delete the old blob
    if (currentImage?.url && currentImage.url !== url && currentImage.url.includes('public.blob.vercel-storage.com')) {
       try { await del(currentImage.url); } catch(e) {}
    }
    await prisma.tourImage.update({
      where: { id: imageId },
      data: { 
        url, // Update URL (Shared across languages)
        order,
        isPrimary,
        translations: {
          upsert: {
            where: { imageId_languageId: { imageId, languageId } },
            update: { altText },
            create: { languageId, altText }
          }
        }
      }
    })
  } 
  // B. CREATE NEW
  else {
    // Check if it's the first image (if so, make it primary automatically)
    const count = await prisma.tourImage.count({ where: { tourId } })
    const isPrimaryInput = formData.get('isPrimary') === 'on'
    const makePrimary = count === 0 || isPrimaryInput

    await prisma.tourImage.create({
      data: {
        tourId,
        url,
        order,
        isPrimary: makePrimary,
        translations: {
          create: { languageId, altText }
        }
      }
    })
  }

  // We re-fetch the tour to ensure a Primary Image still exists
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: { 
        schedules: true, 
        translations: { include: { language: true } }, 
        images: true, 
        location: true 
    }
  })

  // Run Validation
  const { hard } = validateTourData(tour)

  // If we broke a Hard Rule (e.g., "Missing Primary Cover Image"), Force Deactivate
  if (hard.length > 0) {
    await prisma.tour.update({ where: { id: tourId }, data: { isActive: false } })
  }

  revalidatePath(`/admin/tours/${tourId}`)
}

// 9. ITINERARY: ADD ITEM (Insert & Shift)
export async function addItineraryItem(tourId, targetDay) {
  // 1. Shift everything currently at or below this number DOWN by 1
  // We do this in a transaction to be safe
  await prisma.$transaction([
    // Shift existing items down: (Day 2 -> Day 3)
    prisma.tourItinerary.updateMany({
      where: { tourId, day: { gte: targetDay } },
      data: { day: { increment: 1 } }
    }),
    // Create the new item in the gap
    prisma.tourItinerary.create({
      data: { tourId, day: targetDay }
    })
  ])

  revalidatePath(`/admin/tours/${tourId}`)
}

// 10. ITINERARY: DELETE ITEM (Remove & Shift)
export async function deleteItineraryItem(itemId) {
  // 1. Get the item to find its day/tour
  const item = await prisma.tourItinerary.findUnique({ where: { id: itemId } })
  if (!item) return

  await prisma.$transaction([
    // Delete the item
    prisma.tourItinerary.delete({ where: { id: itemId } }),
    
    // Shift everything below it UP by 1 (Day 3 -> Day 2)
    prisma.tourItinerary.updateMany({
      where: { tourId: item.tourId, day: { gt: item.day } },
      data: { day: { decrement: 1 } }
    })
  ])

  revalidatePath(`/admin/tours/${item.tourId}`)
}

// 11. ITINERARY: SAVE CONTENT
export async function saveItineraryTranslation(formData) {
  const itineraryId = formData.get('itineraryId')
  const languageId = formData.get('languageId')
  const tourId = formData.get('tourId')
  const title = formData.get('title')
  const content = formData.get('content')

  await prisma.tourItineraryTranslation.upsert({
    where: { itineraryId_languageId: { itineraryId, languageId } },
    update: { title, content },
    create: { itineraryId, languageId, title, content }
  })

  revalidatePath(`/admin/tours/${tourId}`)
}
// 12. LOCATION: UPDATE MAP
export async function updateTourLocation(formData) {
  const tourId = formData.get('tourId')
  
  const lat = parseFloat(formData.get('lat'))
  const lng = parseFloat(formData.get('lng'))
  const name = formData.get('name')
  const address = formData.get('address')

  if (isNaN(lat) || isNaN(lng)) {
    throw new Error("Invalid Coordinates")
  }

  await prisma.tourLocation.upsert({
    where: { tourId },
    update: { lat, lng, name, address },
    create: { tourId, lat, lng, name, address }
  })
  const tour = await prisma.tour.findUnique({ 
    where: { id: tourId }, 
    include: { location: true } 
  })
  // If lat/lng became 0 or null (invalid), force Draft
  if (!tour.location?.lat || !tour.location?.lng) {
      await prisma.tour.update({ where: { id: tourId }, data: { isActive: false } })
  }
  revalidatePath(`/admin/tours/${tourId}`)
}

// 13. EXTRAS: UPSERT (Add/Edit)
export async function upsertTourExtra(formData) {
  const tourId = formData.get('tourId')
  const extraId = formData.get('extraId') // 'new' or UUID
  const languageId = formData.get('languageId')
  const name = formData.get('name')
  
  // Convert Input (e.g. 25.50) to Cents (2550)
  const priceRaw = parseFloat(formData.get('price') || '0')
  const price = Math.round(priceRaw * 100) 

  if (!name) throw new Error("Name is required")

  // A. UPDATE EXISTING
  if (extraId && extraId !== 'new') {
    await prisma.tourExtra.update({
      where: { id: extraId },
      data: {
        price, // Shared Price
        translations: {
          upsert: {
            where: { extraId_languageId: { extraId, languageId } },
            update: { name },
            create: { languageId, name }
          }
        }
      }
    })
  }
  // B. CREATE NEW
  else {
    await prisma.tourExtra.create({
      data: {
        tourId,
        price,
        translations: {
          create: { languageId, name }
        }
      }
    })
  }

  revalidatePath(`/admin/tours/${tourId}`)
}

// 14. EXTRAS: DELETE
export async function deleteTourExtra(extraId) {
  const extra = await prisma.tourExtra.findUnique({ where: { id: extraId } })
  if (!extra) return
  await prisma.tourExtra.delete({ where: { id: extraId } })
  revalidatePath(`/admin/tours/${extra.tourId}`)
}

// 15. FAQ: UPSERT (Add/Edit)
export async function upsertTourFaq(formData) {
  const tourId = formData.get('tourId')
  const faqId = formData.get('faqId') // 'new' or UUID
  const languageId = formData.get('languageId')
  
  const question = formData.get('question')
  const answer = formData.get('answer')
  const order = parseInt(formData.get('order') || '0')

  if (!question) throw new Error("Question is required")

  // A. UPDATE EXISTING
  if (faqId && faqId !== 'new') {
    await prisma.tourFaq.update({
      where: { id: faqId },
      data: {
        order,
        translations: {
          upsert: {
            where: { faqId_languageId: { faqId, languageId } },
            update: { question, answer },
            create: { languageId, question, answer }
          }
        }
      }
    })
  }
  // B. CREATE NEW
  else {
    // Auto-calculate order (put at end)
    const count = await prisma.tourFaq.count({ where: { tourId } })
    
    await prisma.tourFaq.create({
      data: {
        tourId,
        order: count, // Append to end
        translations: {
          create: { languageId, question, answer }
        }
      }
    })
  }

  revalidatePath(`/admin/tours/${tourId}`)
}

// 16. FAQ: DELETE
export async function deleteTourFaq(faqId) {
  const faq = await prisma.tourFaq.findUnique({ where: { id: faqId } })
  if (!faq) return
  await prisma.tourFaq.delete({ where: { id: faqId } })
  revalidatePath(`/admin/tours/${faq.tourId}`)
}

// 17. SCHEDULES: UPSERT RULE (Regular Availability)
export async function upsertTourSchedule(formData) {
  const tourId = formData.get('tourId')
  const scheduleId = formData.get('scheduleId') // 'new' or UUID
  
  const type = formData.get('type') // 'WEEKLY', 'MONTHLY', 'SPECIFIC_DATES'
  const validFrom = new Date(formData.get('validFrom'))
  
  // Handle optional End Date
  const validToRaw = formData.get('validTo')
  const validTo = validToRaw ? new Date(validToRaw) : null
  
  const isActive = formData.get('isActive') === 'on' // Checkbox logic

  // Parse Conditions
  // For WEEKLY: We expect multiple "daysOfWeek" entries (values 0-6)
  const daysOfWeek = formData.getAll('daysOfWeek').map(d => parseInt(d))
  
  // For MONTHLY: We expect "dayOfMonth" (1-31)
  const domRaw = formData.get('dayOfMonth')
  const dayOfMonth = domRaw ? parseInt(domRaw) : null

  // VALIDATION
  if (!type) throw new Error("Recurrence type is required")
  if (isNaN(validFrom.getTime())) throw new Error("Start date is required")

  const data = {
    tourId,
    type,
    validFrom,
    validTo,
    isActive,
    // Only save daysOfWeek if type is WEEKLY
    daysOfWeek: type === 'WEEKLY' ? daysOfWeek : [],
    // Only save dayOfMonth if type is MONTHLY
    dayOfMonth: type === 'MONTHLY' ? dayOfMonth : null,
  }

  if (scheduleId && scheduleId !== 'new') {
    await prisma.tourSchedule.update({ where: { id: scheduleId }, data })
  } else {
    await prisma.tourSchedule.create({ data })
  }

  // We fetch the full tour to re-run validation
  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: { schedules: true, translations: { include: { language: true } }, images: true, location: true }
  })

  // Check if it still passes the "Future Availability" rule
  const { hard } = validateTourData(tour)

  // If we created a Hard Error (like "No Future Availability"), force Draft
  if (hard.length > 0) {
    await prisma.tour.update({ where: { id: tourId }, data: { isActive: false } })
  }

  revalidatePath(`/admin/tours/${tourId}`)
}

export async function deleteTourSchedule(scheduleId) {
  const s = await prisma.tourSchedule.findUnique({ where: { id: scheduleId } })
  if(s) {
    const tourId = s.tourId
    await prisma.tourSchedule.delete({ where: { id: scheduleId } })
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
      include: { 
          schedules: true, 
          translations: { include: { language: true } }, 
          images: true, 
          location: true 
      }
    })
    const { hard } = validateTourData(tour)
    if (hard.length > 0) {
      await prisma.tour.update({ 
          where: { id: tourId }, 
          data: { isActive: false } 
      })
    }
    revalidatePath(`/admin/tours/${s.tourId}`)
  }
}

// 18. EXCEPTIONS: BLOCK/UNBLOCK DATES
export async function upsertTourException(formData) {
  const tourId = formData.get('tourId')
  const dateStr = formData.get('date')
  const isBlocked = formData.get('isBlocked') === 'on'
  const reason = formData.get('reason')

  if (!dateStr) throw new Error("Date is required")
  const date = new Date(dateStr)

  // Uses composite unique key [tourId, date] defined in schema [cite: 17]
  await prisma.tourException.upsert({
    where: { 
      tourId_date: { tourId, date } 
    },
    update: { isBlocked, reason },
    create: { tourId, date, isBlocked, reason }
  })

  revalidatePath(`/admin/tours/${tourId}`)
}

export async function deleteTourException(tourId, dateStr) {
  const date = new Date(dateStr)
  try {
      await prisma.tourException.delete({
        where: { tourId_date: { tourId, date } }
      })
      revalidatePath(`/admin/tours/${tourId}`)
  } catch (e) {
      // Ignore if record doesn't exist
  }
}

// 19. CAPACITY: OVERRIDE SPECIFIC DATE
export async function upsertTourCapacity(formData) {
  const tourId = formData.get('tourId')
  const dateStr = formData.get('date')
  const capacity = parseInt(formData.get('capacity'))

  if (!dateStr) throw new Error("Date is required")
  if (isNaN(capacity)) throw new Error("Capacity must be a number")
  
  const date = new Date(dateStr)

  // Uses composite unique key [tourId, date] defined in schema 
  await prisma.tourDateCapacity.upsert({
    where: { tourId_date: { tourId, date } },
    update: { capacity },
    create: { tourId, date, capacity }
  })

  revalidatePath(`/admin/tours/${tourId}`)
}

export async function deleteTourCapacity(tourId, dateStr) {
  const date = new Date(dateStr)
  try {
      await prisma.tourDateCapacity.delete({
        where: { tourId_date: { tourId, date } }
      })
      revalidatePath(`/admin/tours/${tourId}`)
  } catch (e) {}
}

// 20. TAGS: UPDATE TOUR TAGS
export async function updateTourTags(formData) {
  const tourId = formData.get('tourId')
  // We expect a comma-separated string of IDs like "id1,id2,id3"
  const tagIdsString = formData.get('tagIds') 
  
  if (!tagIdsString && tagIdsString !== '') return 

  const tagIds = tagIdsString.split(',').filter(Boolean)

  await prisma.tour.update({
    where: { id: tourId },
    data: {
      tags: {
        // 'set' replaces the entire list of connected tags with this new list
        set: tagIds.map(id => ({ id }))
      }
    }
  })

  revalidatePath(`/admin/tours/${tourId}`)
}
// 21. AUDIO GUIDES: UPSERT
export async function upsertTourAudioGuide(formData) {
  const tourId = formData.get('tourId')
  const languageId = formData.get('languageId')
  const isIncluded = formData.get('isIncluded') === 'on'
  
  // Price handling (only if not included)
  const priceRaw = parseFloat(formData.get('extraPrice') || '0')
  const extraPrice = isIncluded ? null : Math.round(priceRaw * 100)

  // Composite key update
  await prisma.tourAudioGuide.upsert({
    where: { 
      tourId_languageId: { tourId, languageId } 
    },
    update: { isIncluded, extraPrice },
    create: { tourId, languageId, isIncluded, extraPrice }
  })

  revalidatePath(`/admin/tours/${tourId}`)
}

// 22. AUDIO GUIDES: DELETE
export async function deleteTourAudioGuide(tourId, languageId) {
  try {
    await prisma.tourAudioGuide.delete({
      where: { 
        tourId_languageId: { tourId, languageId } 
      }
    })
    revalidatePath(`/admin/tours/${tourId}`)
  } catch (e) {
    // Ignore if not found
  }
}