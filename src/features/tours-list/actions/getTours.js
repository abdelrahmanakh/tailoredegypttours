'use server'

import { prisma } from "@/lib/prisma";

export async function getTours(searchParams = {}) {
  try {
    // 1. Extract & Normalize Params
    const normalizeArray = (param) => {
      if (!param) return [];
      return Array.isArray(param) ? param : [param];
    };

    const maxPrice = searchParams.price ? parseInt(searchParams.price)*100 : 10000;
    const sortOption = searchParams.sort || 'Featured';
    
    // Filters
    const selectedCategories = normalizeArray(searchParams.type); 
    const selectedDuration = normalizeArray(searchParams.duration); 
    const selectedLangs = normalizeArray(searchParams.lang); 
    const minRating = searchParams.rating ? parseFloat(searchParams.rating) : 0;

    // {Free Canceling}
    // const onlyFreeCancel = normalizeArray(searchParams.special).includes('free-cancel');
    
    // Search by text (if passed from Hero search)
    const textSearch = searchParams.location || "";
    const specificTag = searchParams.tag || "";
    const specificDest = searchParams.destination || ""; // e.g. 'luxor'

    // 2. Build Prisma 'Where' Clause
    const where = {
      isActive: true, 
      priceAdult: { lte: maxPrice },
      rating: { gte: minRating },
    };

    // Filter by Category (using slug or name match)
    if (selectedCategories.length > 0) {
      where.category = {
        OR: [
             { slug: { in: selectedCategories.map(c => c.toLowerCase()) } },
             { translations: { some: { name: { in: selectedCategories } } } } // Fallback to name match if slug fails
        ]
      };
    }

    // Filter by Tag (e.g. clicked from "Popular things to do")
    if (specificTag && specificTag !== 'all') {
      where.tags = {
        some: { slug: specificTag }
      };
    }

    // Filter by Destination Slug (e.g. clicked from "Top Deals")
    if (specificDest) {
      where.destination = { slug: specificDest };
    }

    // Filter by Text Search (Location or Title)
    if (textSearch) {
      where.OR = [
        { 
          location: { 
            name: { contains: textSearch, mode: 'insensitive' } 
          } 
        },
        { 
          translations: { 
            some: { 
              title: { contains: textSearch, mode: 'insensitive' } 
            } 
          } 
        }
      ];
    }


    //{Language Filter}
    
    // Filter by Language (Must have a translation or guide in this language)
    // if (selectedLangs.length > 0) {
    //   // This is tricky depending on schema. 
    //   // Assuming we filter by "Available Languages" (TourTranslation existence)
    //   where.translations = {
    //     some: {
    //       language: { name: { in: selectedLangs } }
    //     }
    //   };
    // }




    // Filter by Duration
    if (selectedDuration.length > 0) {
       const durationConditions = [];
       
       if (selectedDuration.includes('1')) {
         durationConditions.push({ durationDays: 1 });
       }
       if (selectedDuration.includes('2-4')) {
         durationConditions.push({ durationDays: { gte: 2, lte: 4 } });
       }
       if (selectedDuration.includes('5+')) {
         durationConditions.push({ durationDays: { gte: 5 } });
       }

       if (durationConditions.length > 0) {
         where.AND = [
           ...(where.AND || []),
           { OR: durationConditions }
         ];
       }
    }
    

    //{ Free Cancelation Filter}

    // // Filter by "Free Cancellation" (Assuming checks tags or a specific boolean field if you added one)
    // // For now, let's assume it checks a Tag named 'free-cancellation'
    // if (onlyFreeCancel) {
    //    where.tags = {
    //      some: { slug: 'free-cancellation' }
    //    };
    // }

    // 3. Determine Sorting
    let orderBy = {};
    if (sortOption === 'Price: Low to High') {
      orderBy = { priceAdult: 'asc' };
    } else if (sortOption === 'Price: High to Low') {
      orderBy = { priceAdult: 'desc' };
    } else if (sortOption === 'Top Rated') {
      orderBy = { rating: 'desc' };
    } else {
      // Default / Featured
      orderBy = { featuredOrder: 'asc' }; 
    }

    // 4. Execute Query
    const tours = await prisma.tour.findMany({
      where,
      orderBy: { featuredOrder: 'asc' }, 
      include: {
        location: true,
        images: true,
        category: { include: { translations: { include: { language: true } } } },
        translations: { include: { language: true } },
        destination: { include: { translations: { include: { language: true } } } },
      },
    });

    // 5. Transform Data for UI
    return tours.map((tour) => {
      const trans = tour.translations.find((t) => t.language.code === "en") || tour.translations[0] || {};
      const catTrans = tour.category?.translations.find(t => t.language.code === 'en') || tour.category?.translations[0];
      const destTrans = tour.destination?.translations.find(t => t.language.code === 'en') || tour.destination?.translations[0];

      const primaryImage = tour.images.find((img) => img.isPrimary)?.url || tour.images[0]?.url || "/assets/placeholder-dest.jpg";
      const displayLocation = tour.location?.name || destTrans?.name || "Egypt";

      return {
        id: tour.id,
        slug: tour.slug, // <--- CRITICAL FIX: Include Slug
        title: trans.title || "Untitled Tour",
        location: displayLocation,
        price: tour.priceAdult/100,
        rating: tour.rating || 0,
        reviews: tour.reviewCount || 0,
        duration: `${tour.durationDays} ${tour.durationDays === 1 ? 'Day' : 'Days'}`,
        category: catTrans?.name || "General",
        image: primaryImage,
        description: trans.description || "",
      };
    });

  } catch (error) {
    console.error("Error fetching filtered tours:", error);
    return [];
  }
}