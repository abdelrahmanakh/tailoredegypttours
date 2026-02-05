'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// UPDATED IMPORTS:
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TourCard from '@/features/tours-list/components/TourCard'         // From Phase 3
import RelatedTours from '@/features/tour-details/components/RelatedTours' // From Phase 4

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ... (keep useEffect and handlers) ...
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
        setLoading(false);
    }
  }, []);

  const handleRemove = (titleToRemove) => {
    const updated = favorites.filter(item => item.title !== titleToRemove);
    setFavorites(updated);
  };

  const clearAll = () => {
    if(confirm("Are you sure you want to clear your wishlist?")) {
        setFavorites([]);
        localStorage.removeItem('favorites');
    }
  }

  return (
    // ADDED pt-28 HERE 👇
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen flex flex-col pt-28">

      {/* Page Header */}
      <div className="bg-primary py-12 text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pattern-bg"></div>
         <div className="container mx-auto px-4 md:px-12 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wishlist</h1>
            <div className="text-xs text-emerald-100/80">
                <Link href="/" className="hover:text-white">Home</Link> &gt; <span>Wishlist</span>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 py-12 flex-grow">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-primary">Saved Tours <span className="text-gray-400 font-normal ml-1">({favorites.length})</span></h2>
                
                {favorites.length > 0 && (
                    <button 
                        onClick={clearAll}
                        className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-2 transition bg-red-50 px-3 py-2 rounded-lg"
                    >
                        <i className="fa-regular fa-trash-can"></i> Clear All
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((trip, index) => (
                        <div key={index} className="h-full">
                            <TourCard 
                                {...trip} 
                                onRemove={handleRemove} 
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-3xl">
                        <i className="fa-regular fa-heart"></i>
                    </div>
                    <h3 className="text-lg font-bold text-primary mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Browse our tours and save your favorites to view them later.</p>
                    <Link href="/tours" className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition shadow-lg">
                        Find Tours
                    </Link>
                </div>
            )}
        </div>

        {/* Upsell Section */}
        <div className="mt-12">
             <RelatedTours />
        </div>

      </div>

    </div>
  )
}