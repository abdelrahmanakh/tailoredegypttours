'use client'
import { useState } from 'react'

const reviewsData = [
  {
    id: 1,
    name: "John Smith",
    role: "Traveler",
    title: "Excellent Service!",
    quote: "I had an amazing experience with this company. The service was top-notch, and the staff was incredibly friendly. I highly recommend them!",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Adventurer",
    title: "Unforgettable Journey",
    quote: "Egypt was breathtaking, and the tour guides were so knowledgeable. Every detail was perfect from start to finish.",
    img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Michael Brown",
    role: "Photographer",
    title: "Stunning Views",
    quote: "The locations we visited were absolutely cinematic. Best travel agency I've used in years.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Backpacker",
    title: "Great Value",
    quote: "Affordable and luxurious at the same time. I loved the Nile cruise and the desert safari.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "David Wilson",
    role: "Explorer",
    title: "History Comes Alive",
    quote: "Walking through the temples was like stepping back in time. Highly recommended for history buffs.",
    img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Jessica Taylor",
    role: "Foodie",
    title: "Amazing Culture",
    quote: "The food, the people, the sights... everything was perfect. Thank you for a wonderful trip.",
    img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Chris Martin",
    role: "Traveler",
    title: "Top Notch Support",
    quote: "They were always available to answer my questions. Felt very safe and well taken care of.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
  }
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalReviews = reviewsData.length;

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % totalReviews);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const jumpToReview = (index) => {
    setActiveIndex(index);
  };

  const activeReview = reviewsData[activeIndex];

  return (
    <section className="py-20 px-4 md:px-12 bg-gray-50/50 overflow-hidden">
      <h2 className="text-primary text-3xl md:text-4xl font-bold text-center mb-16">Customer Reviews</h2>

      <div className="relative w-full max-w-4xl mx-auto h-[500px]">
        
        {/* Central Testimonial Text */}
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 text-center z-40 max-w-lg px-4 w-full transition-all duration-500">
            <div className="review-text-content">
                <h4 className="text-yellow-500 font-bold text-sm uppercase tracking-wide mb-2">
                    {activeReview.title}
                </h4>
                <p className="text-primary font-medium text-lg italic mb-6">
                    "{activeReview.quote}"
                </p>
                <div>
                    <h5 className="text-primary font-bold">{activeReview.name}</h5>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">{activeReview.role}</span>
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {reviewsData.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => jumpToReview(index)}
                        className={`cursor-pointer transition-all duration-300 rounded-full ${
                            index === activeIndex ? 'w-3 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-gray-300'
                        }`}
                    ></div>
                ))}
            </div>
        </div>

        {/* Rotating Images (Orbit) */}
        <div className="w-full h-full relative">
            {reviewsData.map((review, index) => {
                // Calculate position relative to active index
                const pos = (index - activeIndex + totalReviews) % totalReviews;
                
                return (
                    <div 
                        key={review.id}
                        onClick={() => jumpToReview(index)}
                        className={`review-avatar w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer flex items-center justify-center bg-gray-200 orbit-pos-${pos}`}
                    >
                        <img 
                            src={review.img} 
                            alt={review.name} 
                            className="w-full h-full object-cover"
                        />
                        {/* Quote Icon - only visible for active item via CSS opacity */}
                        <div className="quote-icon absolute -top-2 -right-2 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-serif z-50">
                            "
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Navigation Buttons */}
        <button onClick={prevReview} className="absolute left-0 top-1/2 -translate-y-1/2 z-50 text-gray-300 hover:text-primary text-3xl transition p-4">
            <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button onClick={nextReview} className="absolute right-0 top-1/2 -translate-y-1/2 z-50 text-gray-300 hover:text-primary text-3xl transition p-4">
            <i className="fa-solid fa-chevron-right"></i>
        </button>

      </div>
    </section>
  );
}