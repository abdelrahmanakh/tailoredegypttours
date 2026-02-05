'use client'
import { useRef } from 'react'
import TourCard from '@/features/tours-list/components/TourCard'

const relatedTours = [
  { 
    id: 101, 
    title: "Valley of the Kings & Hatshepsut", 
    location: "Luxor, Egypt", 
    price: 80.78, 
    rating: 4.8, 
    reviews: 243, 
    duration: "1 day", 
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop" 
  },
  { 
    id: 102, 
    title: "Luxury Nile Cruise", 
    location: "Aswan, Egypt", 
    price: 350.00, 
    rating: 4.2, 
    reviews: 120, 
    duration: "4 days", 
    image: "https://images.unsplash.com/photo-1744733881352-b6b4789f93c5?q=80&w=1556&auto=format&fit=crop" 
  },
  { 
    id: 103, 
    title: "Great Pyramids & Sphinx", 
    location: "Giza, Egypt", 
    price: 45.00, 
    rating: 5.0, 
    reviews: 500, 
    duration: "5 hours", 
    image: "https://plus.unsplash.com/premium_photo-1678131188332-693a503680ae?q=80&w=870&auto=format&fit=crop" 
  },
  { 
    id: 104, 
    title: "Mount Sinai Sunrise Hike", 
    location: "Sinai, Egypt", 
    price: 120.00, 
    rating: 4.7, 
    reviews: 89, 
    duration: "1 day", 
    image: "https://images.unsplash.com/photo-1574864745093-5566c5be5855?q=80&w=870&auto=format&fit=crop" 
  }
];

export default function RelatedTours() {
  const scrollContainer = useRef(null);

  return (
    <section className="mt-20 border-t border-gray-100 pt-10">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-primary text-3xl font-bold">You might also like...</h2>
            <a href="/tours" className="text-gray-500 text-sm font-semibold hover:text-primary transition">See all</a>
        </div>
        
        <div 
            ref={scrollContainer}
            className="overflow-x-auto hide-scrollbar pb-8"
        >
            <div className="flex gap-6 min-w-full">
                {relatedTours.map(tour => (
                    <TourCard key={tour.id} {...tour} />
                ))}
            </div>
        </div>
    </section>
  )
}