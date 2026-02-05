'use client'
import { useState } from 'react'

export default function ReviewForm() {
  // Simple state to track ratings for visual feedback
  const [ratings, setRatings] = useState({ location: 0, amenities: 0, food: 0, room: 0, price: 0, operator: 0 });

  const handleRating = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const renderStars = (category) => (
    <div className="flex text-gray-300 text-sm gap-1 cursor-pointer star-container">
        {[1, 2, 3, 4, 5].map((star) => (
            <i 
                key={star}
                onClick={() => handleRating(category, star)}
                className={`fa-solid fa-star transition hover:text-yellow-400 ${ratings[category] >= star ? 'text-yellow-400' : ''}`}
            ></i>
        ))}
    </div>
  );

  return (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-2">Leave a Reply</h2>
        <p className="text-xs text-gray-500 mb-8">Your email address will not be published. Required fields are marked *</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12 mb-8">
            <div className="flex flex-col gap-2"><label className="text-xs font-bold text-primary">Location</label>{renderStars('location')}</div>
            <div className="flex flex-col gap-2"><label className="text-xs font-bold text-primary">Amenities</label>{renderStars('amenities')}</div>
            <div className="flex flex-col gap-2"><label className="text-xs font-bold text-primary">Food</label>{renderStars('food')}</div>
            <div className="flex flex-col gap-2"><label className="text-xs font-bold text-primary">Room</label>{renderStars('room')}</div>
            <div className="flex flex-col gap-2"><label className="text-xs font-bold text-primary">Price</label>{renderStars('price')}</div>
            <div className="flex flex-col gap-2"><label className="text-xs font-bold text-primary">Tour Operator</label>{renderStars('operator')}</div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Name" className="w-full bg-[#FDFBF6] border border-transparent focus:border-primary focus:bg-white rounded-xl px-4 py-4 outline-none transition text-sm placeholder-gray-500" />
                <input type="email" placeholder="Email" className="w-full bg-[#FDFBF6] border border-transparent focus:border-primary focus:bg-white rounded-xl px-4 py-4 outline-none transition text-sm placeholder-gray-500" />
            </div>
            <input type="text" placeholder="Title" className="w-full bg-[#FDFBF6] border border-transparent focus:border-primary focus:bg-white rounded-xl px-4 py-4 outline-none transition text-sm placeholder-gray-500" />
            <textarea rows="6" placeholder="Comment" className="w-full bg-[#FDFBF6] border border-transparent focus:border-primary focus:bg-white rounded-xl px-4 py-4 outline-none transition text-sm placeholder-gray-500 resize-none"></textarea>
            <button className="bg-primary text-white font-bold px-10 py-4 rounded-xl hover:bg-primary-dark transition shadow-lg text-sm">Post Comment</button>
        </form>
    </div>
  )
}