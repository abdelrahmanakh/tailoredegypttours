'use client'
import { useState, useEffect } from 'react'

export default function TourActions({ tour }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // 1. Check if tour is already in favorites on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorited(favorites.some(f => f.id === tour.id));
    }
  }, [tour.id]);

  // 2. Toggle Favorite Logic
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.findIndex(f => f.id === tour.id);

    if (index > -1) {
      // Remove
      favorites.splice(index, 1);
      setIsFavorited(false);
    } else {
      // Add (Save only necessary fields for the card)
      favorites.push({
        id: tour.id,
        title: tour.title,
        slug: tour.slug,
        location: tour.location,
        duration: tour.duration,
        price: tour.price,
        rating: tour.rating,
        reviews: tour.reviews,
        images: tour.images, // Save images array (or just [0] if you prefer)
        image: tour.images?.[0] // Fallback for TourCard if it expects 'image' string
      });
      setIsFavorited(true);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  // 3. Share Logic
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000); // Hide message after 2s
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="hidden md:flex gap-4 relative">
       {/* Share Button */}
       <button 
         onClick={handleShare} 
         className="flex items-center gap-2 text-primary font-bold hover:bg-gray-100 px-4 py-2 rounded-full transition"
       >
          <i className="fa-solid fa-share-nodes"></i> Share
          {showCopied && (
            <div className="absolute top-10 left-0 bg-primary text-white text-xs px-3 py-1 rounded shadow-lg z-50 whitespace-nowrap fade-in">
              Link Copied! <i className="fa-solid fa-check ml-1"></i>
            </div>
          )}
       </button>

       {/* Wishlist Button */}
       <button 
         onClick={toggleFavorite} 
         className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full transition group ${
             isFavorited ? 'bg-red-50 text-red-600' : 'text-primary hover:bg-gray-100'
         }`}
       >
          {isFavorited ? (
             <i className="fa-solid fa-heart"></i>
          ) : (
             <>
               <i className="fa-regular fa-heart group-hover:hidden"></i>
               <i className="fa-solid fa-heart text-red-600 hidden group-hover:block"></i>
             </>
          )}
          Wishlist
       </button>
    </div>
  )
}