'use client'
import { useRef } from 'react' 
import Link from 'next/link'

export default function TopDeals({ destinations = [] }) {
  const scrollContainer = useRef(null);

  const scroll = (direction) => {
    if (scrollContainer.current) {
        const scrollAmount = 300; 
        scrollContainer.current.scrollBy({ 
            left: direction === 'left' ? -scrollAmount : scrollAmount, 
            behavior: 'smooth' 
        });
    }
  };

  if (!destinations.length) return null;

  return (
    <section className="py-16 px-4 md:px-12 bg-emerald-50/50">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-primary text-3xl md:text-4xl font-bold">Top Deals Worldwide</h2>
            <Link href="/tours" className="text-gray-500 text-sm font-semibold hover:text-primary transition">See All Travel</Link>
        </div>

        <div className="relative group">
            {/* Left Button */}
            <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 bg-white/90 text-primary w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div ref={scrollContainer} className="overflow-x-auto hide-scrollbar pb-10 scroll-smooth snap-x snap-mandatory">
                <div className="flex gap-6 w-max">
                    {destinations.map((dest) => (
                        <Link 
                            key={dest.id}
                            href={`/tours?destination=${dest.slug}`} 
                            className="card-container snap-center relative group/card cursor-pointer block"
                        >
                            <div className="w-64 h-80 rounded-2xl overflow-hidden shadow-lg relative">
                                <img 
                                    src={dest.image} 
                                    alt={dest.name} 
                                    className="w-full h-full object-cover transition duration-500 group-hover/card:scale-110" 
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/20 transition"></div>
                            </div>
                            
                            {/* Discount Badge - conditionally rendered only if discount exists */}
                            {dest.discount > 0 && (
                                <div className="absolute top-64 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg border-4 border-white z-10 group-hover/card:scale-110 group-hover/card:bg-yellow-500 transition-all duration-300">
                                    <span className="text-[10px] opacity-80 uppercase leading-none mt-1">Upto</span>
                                    <span className="text-xl font-bold leading-none">{dest.discount}%</span>
                                    <span className="text-[10px] leading-none">OFF</span>
                                </div>
                            )}

                            <div className="text-center mt-12 bg-white rounded-xl shadow-sm p-4 w-[90%] mx-auto -mt-10 relative z-0 group-hover/card:shadow-md transition-all">
                                <h3 className="text-primary font-bold text-lg">{dest.name}</h3>
                                <p className="text-xs text-gray-500">{dest.tourCount} Tours</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right Button */}
            <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 bg-white/90 text-primary w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    </section>
  )
}