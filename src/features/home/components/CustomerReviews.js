'use client'
import { useState } from 'react'

export default function CustomerReviews({ reviews = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!reviews || reviews.length === 0) return null;

  const totalReviews = reviews.length;

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % totalReviews);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const jumpToReview = (index) => {
    setActiveIndex(index);
  };

  const activeReview = reviews[activeIndex];

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
                {reviews.map((_, index) => (
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
            {reviews.map((review, index) => {
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
        <button onClick={prevReview} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary text-3xl transition p-4">
            <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button onClick={nextReview} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary text-3xl transition p-4">
            <i className="fa-solid fa-chevron-right"></i>
        </button>

      </div>
    </section>
  );
}