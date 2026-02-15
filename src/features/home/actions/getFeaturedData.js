import { prisma } from "@/lib/prisma";

// Helper to simulate network delay (optional, can be removed)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. Featured Tours (Already implemented, keeping it here for context)
export async function getFeaturedTours() {
  try {
    const tours = await prisma.tour.findMany({
      where: { isFeatured: true, isActive: true },
      take: 8,
      orderBy: { featuredOrder: 'asc' },
      include: {
        location: true,
        images: true,
        destination: { include: { translations: { include: { language: true } } } },
        translations: { include: { language: true } },
      },
    });

    return tours.map((tour) => {
      const translation = tour.translations.find((t) => t.language.code === "en") || tour.translations[0] || {};
      const destTranslation = tour.destination?.translations?.find((t) => t.language.code === "en") || tour.destination?.translations?.[0] || {};
      
      const primaryImage = tour.images.find((img) => img.isPrimary)?.url || tour.images[0]?.url || "/assets/placeholder-dest.jpg";

      // Improved Location Logic: TourLocation Name -> Destination Name -> "Egypt"
      const locationName = tour.location?.name || destTranslation.name || "Egypt";


      return {
        id: tour.id,
        slug: tour.slug,
        title: translation.title || "Untitled Tour",
        description: translation.description || "",
        image: primaryImage,
        price: tour.priceAdult/100 ,
        duration: `${tour.durationDays} ${tour.durationDays === 1 ? 'Day' : 'Days'}`,
        rating: tour.rating || 0,
        reviews: tour.reviewCount || 0,
        location: locationName,
      };
    });
  } catch (error) {
    console.error("Error fetching featured tours:", error);
    return [];
  }
}

// 2. Tour Categories (For Hero Dropdown)
export async function getTourCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { translations: { include: { language: true } } },
    });

    return categories.map(cat => {
        const trans = cat.translations.find(t => t.language.code === 'en') || cat.translations[0];
        return {
            id: cat.id,
            slug: cat.slug,
            name: trans?.name || cat.slug
        };
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// 3. Featured Destinations (For Top Deals)
export async function getFeaturedDestinations() {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { featuredOrder: 'asc' },
      take: 6,
      include: {
        translations: { include: { language: true } },
        _count: { select: { tours: true } } // Count active tours in this destination
      }
    });

    return destinations.map(dest => {
      const trans = dest.translations.find(t => t.language.code === 'en') || dest.translations[0];
      return {
        id: dest.id,
        slug: dest.slug,
        name: trans?.name || "Unknown",
        image: dest.imageUrl || "/assets/placeholder-dest.jpg",
        tourCount: dest._count.tours,
        discount: Math.floor(Math.random() * (30 - 10 + 1) + 10) // Mock discount for UI purposes (10-30%)
      };
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
}

// 4. Customer Reviews
export async function getCustomerReviews() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isVisible: true },
      take: 7,
      orderBy: { date: 'desc' },
      include: {
        tour: { 
            include: { translations: true } // To know which tour they reviewed
        }
      }
    });

    return reviews.map(review => ({
      id: review.id,
      name: review.name,
      role: "Traveler", // Default role
      title: "Amazing Experience", // Default title if not in schema
      quote: review.comment,
      img: review.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop", // Fallback avatar
      rating: review.rating
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}