'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitReview(prevState, formData) {
  const tourId = formData.get('tourId');
  const name = formData.get('name');
  const email = formData.get('email');
  const title = formData.get('title'); 
  const comment = formData.get('comment');
  const rating = parseInt(formData.get('rating'));

  // 1. Basic Validation
  if (!tourId || !name || !title || !comment || !rating) {
    return { message: "Please fill in all required fields.", success: false };
  }

  try {
    // 2. Create the Review in the Database
    await prisma.review.create({
      data: {
        tourId,
        name,
        rating,
        title,
        comment,
        date: new Date(), // Using 'date' based on your previous code
        isVisible: true,  // Set to false if you want admin approval first
      }
    });

    // 3. Recalculate Average Rating for the Tour
    const aggregates = await prisma.review.aggregate({
        where: { tourId, isVisible: true },
        _avg: { rating: true },
        _count: { id: true }
    });

    // 4. Update the Tour with new stats
    await prisma.tour.update({
        where: { id: tourId },
        data: {
            rating: aggregates._avg.rating || 0,
            reviewCount: aggregates._count.id || 0
        }
    });

    // 5. Refresh the page to show the new review
    revalidatePath(`/tours/${tourId}`); 
    return { message: "Review submitted successfully!", success: true };

  } catch (error) {
    console.error("Submit Review Error:", error);
    return { message: "Failed to submit review. Please try again.", success: false };
  }
}