'use server'

import { prisma } from "@/lib/prisma";

export async function getTourBySlug(slugOrId) {
  try {
    const tour = await prisma.tour.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
        isActive: true
      },
      include: {
        location: true,
        images: { orderBy: { order: 'asc' } },
        category: { include: { translations: { include: { language: true } } } },
        destination: { include: { translations: { include: { language: true } } } },
        translations: { include: { language: true } },
        itinerary: {
          orderBy: { day: 'asc' },
          include: { translations: { include: { language: true } } }
        },
        extras: { include: { translations: { include: { language: true } } } },
        FAQs: {
          orderBy: { order: 'asc' },
          include: { translations: { include: { language: true } } }
        },
        reviews: {
            take: 20,
            orderBy: { date: 'desc' },
            where: { isVisible: true }
        },
        tags: {
            include: {
                translations: { include: { language: true } }
            }
          },
        audioGuides: {
            include: { language: true }
        }
      },
    });

    if (!tour) return null;

    // Calculate Rating Stats
    const starDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { tourId: tour.id, isVisible: true },
      _count: { rating: true },
    });
    
    const ratingStats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    starDistribution.forEach(item => {
        ratingStats[item.rating] = item._count.rating;
    });

    const getTrans = (items) => items?.find(t => t.language.code === 'en') || items?.[0] || {};
    const mainTrans = getTrans(tour.translations);
    const destTrans = getTrans(tour.destination?.translations);

    const availableLanguages = tour.audioGuides.length > 0
        ? tour.audioGuides.map(ag => ag.language.name).join(", ")
        : "English";

    return {
      id: tour.id,
      slug: tour.slug,
      title: mainTrans.title || "Untitled Tour",
      overview: mainTrans.Overview || "",
      description: mainTrans.description || "",
      highlights: mainTrans.highlights ? mainTrans.highlights.split('\n') : [],
      included: mainTrans.included ? mainTrans.included.split('\n') : [],
      excluded: mainTrans.excluded ? mainTrans.excluded.split('\n') : [],
      
      location: tour.location?.name || destTrans.name || "Egypt",
      duration: `${tour.durationDays} Days`,
      maxPeople: tour.maxPeople || 30, // Default if missing
      minAge: tour.minAge || 6,        // Default if missing
      languages: availableLanguages,    
      
      price: tour.priceAdult, 
      priceChild: tour.priceChild,
      
      rating: tour.rating || 0,
      reviews: tour.reviewCount || 0,
      
      images: tour.images.map(img => img.url),
      categoryId: tour.categoryId,
      
      itinerary: tour.itinerary.map(item => ({
        day: item.day,
        title: getTrans(item.translations).title || `Day ${item.day}`,
        description: getTrans(item.translations).content || ""
      })),
      
      faqs: tour.FAQs.map(item => ({
        question: getTrans(item.translations).question || "",
        answer: getTrans(item.translations).answer || ""
      })),
      
      extras: tour.extras.map(item => ({
        id: item.id,
        name: getTrans(item.translations).name || "Extra Service",
        price: item.price
      })),
      
      reviewsList: tour.reviews.map(r => ({
        id: r.id,
        name: r.name,
        date: r.date ? r.date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "Recent",        
        rating: r.rating,
        title: r.title || "Review",
        comment: r.comment,
        avatar: r.avatar
      })),
      ratingStats,

      isFeatured: tour.isFeatured, // Use this for "Bestseller"
      tags: tour.tags.map(t => getTrans(t.translations).name || "Tag") // Use this for "Free Cancellation", "New", etc.
    };

  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}


// Helper to get related tours
export async function getRelatedTours(currentTourId) {
  try {
    // 1. Fetch criteria from the current tour
    const currentTour = await prisma.tour.findUnique({
      where: { id: currentTourId },
      select: { 
        destinationId: true,
        categoryId: true,
        tags: { select: { id: true } }
      }
    });

    if (!currentTour) return [];

    const tagIds = currentTour.tags.map(t => t.id);

    // 2. Find similar tours
    // Priority: Same Destination OR Same Tags
    const related = await prisma.tour.findMany({
      where: {
        id: { not: currentTourId }, // Exclude current
        isActive: true,
        OR: [
          { destinationId: currentTour.destinationId }, // Match Destination
          { tags: { some: { id: { in: tagIds } } } },   // Match ANY Tag
          { categoryId: currentTour.categoryId }        // Fallback: Match Category
        ]
      },
      take: 4, // Show 4 related tours
      orderBy: {
        // Optional: Prioritize those that are featured or have high ratings
        rating: 'desc'
      },
      include: {
        location: true,
        images: true,
        translations: { include: { language: true } },
        destination: { include: { translations: true } }
      }
    });

    // 3. Transform for UI
    return related.map(tour => {
      const trans = tour.translations.find(t => t.language.code === 'en') || tour.translations[0] || {};
      const img = tour.images.find(i => i.isPrimary)?.url || tour.images[0]?.url;
      const destTrans = tour.destination?.translations.find(t => t.language.code === 'en') || {};

      return {
        id: tour.id,
        slug: tour.slug,
        title: trans.title || "Untitled Tour",
        image: img,
        price: tour.priceAdult,
        duration: `${tour.durationDays} Days`,
        location: tour.location?.name || destTrans.name || "Egypt",
        rating: tour.rating || 0,
        reviews: tour.reviewCount || 0
      };
    });

  } catch (e) {
    console.error("Related Tours Error:", e);
    return [];
  }
}