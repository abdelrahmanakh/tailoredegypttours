'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SearchCard({ id, title, location, price, rating, reviews, duration, image, description }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const exists = favorites.some(item => item.title === title);
    setIsFavorite(exists);
  }, [title]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (isFavorite) {
        favorites = favorites.filter(item => item.title !== title);
    } else {
        const newTour = { id, title, location, price, rating, reviews, duration, image, description };
        favorites.push(newTour);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/tours/${id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition duration-300 block no-underline group">
        {/* Image */}
        <div className="w-full md:w-1/3 h-56 md:h-auto relative">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <button 
                onClick={toggleFavorite}
                className="absolute bottom-3 right-3 bg-white/80 p-2 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white text-primary transition z-10"
            >
                {isFavorite ? <i className="fa-solid fa-heart text-red-600"></i> : <i className="fa-regular fa-heart"></i>}
            </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{location}</span>
                </div>
                <h2 className="text-primary text-xl font-bold mb-2 group-hover:text-teal-600 transition">{title}</h2>
                
                {/* --- ADDED DESCRIPTION HERE --- */}
                {description && (
                    <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fa-solid ${i < Math.floor(rating) ? 'fa-star' : 'fa-star-half-stroke'}`}></i>
                        ))}
                    </div>
                    <span className="text-primary font-bold text-sm">{rating}</span>
                    <span className="text-gray-400 text-xs">({reviews})</span>
                </div>
            </div>
        </div>

        {/* Price & Action */}
        <div className="w-full md:w-48 bg-gray-50/50 p-5 flex flex-col justify-center items-center md:items-end border-l border-gray-100 gap-2">
            <div className="flex items-center gap-1 text-primary font-bold text-sm mb-1">
                <i className="fa-regular fa-clock"></i><span>{duration}</span>
            </div>
            <div className="text-4xl font-bold text-primary mb-3">${price}</div>
            <button className="bg-primary hover:bg-primary-dark text-white w-full py-2 rounded-lg text-sm font-bold transition shadow-lg">View Details</button>
        </div>
    </Link>
  )
}