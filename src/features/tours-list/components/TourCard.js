'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function TourCard({ 
  id, slug, image, location, title, description, rating, reviews, duration, price, 
  onRemove 
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(item => item.id === id); // Better to check by ID
    setIsFavorite(exists);
  }, [id]);

  const toggleFavorite = (e) => {
    e.preventDefault(); 
    e.stopPropagation();

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (isFavorite) {
        favorites = favorites.filter(item => item.id !== id);
        if (onRemove) onRemove(id);
    } else {
        // Save the slug in favorites too so we can link back easily later
        const newTour = { id, slug, image, location, title, description, rating, reviews, duration, price };
        favorites.push(newTour);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // FIX: Use slug if available, fallback to id only if necessary (or '#' to prevent 404)
  const linkHref = slug ? `/tours/${slug}` : `/tours/${id}`;

  return (
    <Link href={linkHref} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300 block relative group/card h-full flex flex-col">
        
        <div className="h-48 relative flex-shrink-0">
            <img src={image} alt={title} className="w-full h-full object-cover transition duration-500 group-hover/card:scale-105" />
            
            <button 
                onClick={toggleFavorite}
                className="absolute bottom-3 right-3 bg-white/80 p-2 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white text-primary transition z-10"
            >
                {isFavorite ? (
                    <i className="fa-solid fa-heart text-red-600"></i>
                ) : (
                    <i className="fa-regular fa-heart"></i>
                )}
            </button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                <i className="fa-solid fa-location-dot"></i>
                <span>{location}</span>
            </div>
            
            <h3 className="text-primary font-bold text-lg leading-tight mb-2 line-clamp-2 min-h-[1.5rem]">
                {title}
            </h3>

            {description && (
                <p className="text-[10px] text-gray-500 line-clamp-3 mb-3 flex-grow">
                    {description}
                </p>
            )}

            
            <div className="flex items-center gap-1 text-yellow-500 text-xs mb-4">
                {[...Array(5)].map((_, i) => (
                    <i key={i} className={` ${i < Math.floor(rating) ? 'fa-solid fa-star' : 'fa-regular fa-star'}`}></i>
                ))}
                <span className="text-gray-400 ml-1">{rating} ({reviews})</span>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-auto">
                <div className="text-gray-500 text-xs font-medium">
                    <i className="fa-regular fa-clock mr-1"></i> {duration}
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400 mr-1">From</span>
                    <span className="text-primary font-bold text-lg">${price}</span>
                </div>
            </div>
        </div>
    </Link>
  )
}