'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleReviewVisibility(reviewId, isVisible) {
  await prisma.review.update({
    where: { id: reviewId },
    data: { isVisible: !isVisible }
  })
  revalidatePath('/admin/reviews')
}

export async function deleteReview(reviewId) {
  await prisma.review.delete({ where: { id: reviewId } })
  revalidatePath('/admin/reviews')
}
export async function deactivateTour(tourId, isActive) {
  try {
    await prisma.tour.update({
      where: { id: tourId },
      data: { isActive: isActive } // Toggle true/false
    });
    
    // Refresh the admin list
    revalidatePath('/admin/tours');
    
    // Refresh the public search page so hidden tours disappear immediately
    revalidatePath('/tours'); 
    revalidatePath('/'); // Refresh home in case it's in "Featured"
  } catch (error) {
    console.error("Failed to deactivate tour:", error);
    throw new Error("Failed to update tour status");
  }
}

export async function deleteTourPermanently(tourId) {
  try {
    // Prisma will cascade delete related records (Translations, Images, Schedules)
    // because we added `onDelete: Cascade` in the schema.
    await prisma.tour.delete({
      where: { id: tourId }
    });

    revalidatePath('/admin/tours');
    revalidatePath('/tours');
  } catch (error) {
    console.error("Failed to delete tour:", error);
    throw new Error("Failed to delete tour");
  }
}