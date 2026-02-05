'use client'
import { useRef } from 'react'
import Link from 'next/link'
import TourCard from '@/features/tours-list/components/TourCard'


// Mock Data
const tours = [
  {
    id: 1,
    title: "Valley of the kings & Hateshpsut temple Half day tour",
    location: "Luxor, Egypt",
    image: "https://plus.unsplash.com/premium_photo-1661963854938-e69a4e65c1e3?q=80&w=1074&auto=format&fit=crop",
    description: "The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip...",
    rating: 4.8,
    reviews: 243,
    duration: "1 day",
    price: 80.78
  },
  {
    id: 2,
    title: "Great Pyramids of Giza & Sphinx Private Tour",
    location: "Giza, Egypt",
    image: "https://images.unsplash.com/photo-1574864745093-5566c5be5855?q=80&w=870&auto=format&fit=crop",
    description: "Explore the ancient wonders of Giza with a private guide and comfortable transport...",
    rating: 5.0,
    reviews: 500,
    duration: "5 hours",
    price: 45.00
  },
  {
    id: 3,
    title: "Luxury Nile Cruise: Aswan to Luxor 4 Days",
    location: "Aswan, Egypt",
    image: "https://images.unsplash.com/photo-1678131188332-693a503680ae?q=80&w=870&auto=format&fit=crop",
    description: "Sail the Nile in luxury and style, visiting the most iconic temples along the river...",
    rating: 4.9,
    reviews: 120,
    duration: "4 days",
    price: 350.00
  },
  {
    id: 4,
    title: "Mount Sinai Sunrise Hike & St. Catherine Monastery",
    location: "Sinai, Egypt",
    image: "https://images.unsplash.com/photo-1744733881352-b6b4789f93c5?q=80&w=1556&auto=format&fit=crop",
    description: "Witness a spiritual sunrise from the top of Mount Sinai followed by a historic tour...",
    rating: 4.7,
    reviews: 85,
    duration: "1 day",
    price: 120.00
  }
];

export default function PopularTours() {
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

  return (
    <section className="py-16 px-4 md:px-12 bg-slate-50 min-h-[80vh]">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-primary text-3xl md:text-4xl font-bold">Find Popular Tours</h2>
            <Link href="/tours?filter=popular" className="text-gray-500 text-sm font-semibold hover:text-primary transition">See all</Link>
        </div>

         {/* Added 'group/slider' here to isolate it from the cards */}
         <div className="relative group/slider">
            
            {/* Updated hover to 'group-hover/slider' */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 text-primary text-3xl opacity-50 hover:opacity-100 bg-white/50 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-md group-hover/slider:opacity-100"
            >
                <i className="fa-solid fa-circle-chevron-left"></i>
            </button>

             <div 
                ref={scrollContainer}
                className="overflow-x-auto hide-scrollbar pb-10 px-2 scroll-smooth snap-x snap-mandatory"
            >
                <div className="flex gap-6 w-max">
                    {tours.map((tour) => (
                        <TourCard 
                            key={tour.id}
                            {...tour} 
                        />
                    ))}
                </div>
            </div>

            {/* Updated hover to 'group-hover/slider' */}
            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 bg-white/90 text-primary w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    </section>
  )
}