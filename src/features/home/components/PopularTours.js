'use client'
import { useRef } from 'react'
import Link from 'next/link'
import TourCard from '@/features/tours-list/components/TourCard'

// Remove the "mock Data" array entirely from here

export default function PopularTours({ tours = [] }) { // <--- Accept 'tours' as a prop
  const scrollContainer = useRef(null);

  const scroll = (direction) => {
    if (scrollContainer.current) {
        const scrollAmount = 340; 
        scrollContainer.current.scrollBy({ 
            left: direction === 'left' ? -scrollAmount : scrollAmount, 
            behavior: 'smooth' 
        });
    }
  };

  // If no tours are found, you might want to hide the section or show a message
  if (!tours || tours.length === 0) {
    return null; // Or return a <p>No tours available</p>
  }

  return (
    <section className="py-16 px-4 md:px-12 bg-slate-50">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-primary text-3xl md:text-4xl font-bold">Find Popular Tours</h2>
            <Link href="/tours?filter=popular" className="text-gray-500 text-sm font-semibold hover:text-primary transition">See all</Link>
        </div>

         <div className="relative group/slider">
            
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 bg-white/90 text-primary w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>

             <div 
                ref={scrollContainer}
                className="overflow-x-auto hide-scrollbar pb-10 px-2 scroll-smooth snap-x snap-mandatory"
            >
                <div className="flex gap-6 w-max">
                    {tours.map((tour) => (
                        <div key={tour.id} className="w-[22rem] md:w-90 flex-shrink-0 snap-start">
                        <TourCard 
                            key={tour.id}
                            {...tour} 
                        />
                        </div>
                    ))}
                </div>
            </div>

            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-100 bg-white/90 text-primary w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    </section>
  )
}