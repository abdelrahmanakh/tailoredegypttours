'use client'
import { useFormState } from 'react-dom' // Use 'react-dom' for Next.js 14, or 'react' for Next.js 15
import { useState } from 'react'
import { submitReview } from '../actions/submitReview'

const initialState = {
  message: '',
  success: null,
}

export default function ReviewForm({ tourId }) {
  const [rating, setRating] = useState(5);
  const [state, formAction] = useFormState(submitReview, initialState);

  return (
    <div className="mb-12 bg-gray-50 p-8 rounded-2xl border border-gray-100">
        <h2 className="text-2xl font-bold text-primary mb-2">Leave a Review</h2>
        <p className="text-xs text-gray-500 mb-8">Your email address will not be published.</p>
        
        {/* Success/Error Message */}
        {state.message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {state.message}
            </div>
        )}

        <form action={formAction} className="space-y-6">
            <input type="hidden" name="tourId" value={tourId} />
            <input type="hidden" name="rating" value={rating} />

            {/* Star Rating Selector */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-primary">Your Rating</label>
                <div className="flex text-gray-300 text-2xl gap-2 cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                            key={star}
                            onClick={() => setRating(star)}
                            className={`fa-solid fa-star transition hover:text-yellow-400 hover:scale-110 ${rating >= star ? 'text-yellow-400' : ''}`}
                        ></i>
                    ))}
                </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                    name="name" 
                    required 
                    type="text" 
                    placeholder="Name *" 
                    className="w-full bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-4 outline-none transition text-sm" 
                />
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    className="w-full bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-4 outline-none transition text-sm" 
                />
            </div>

            <input 
                name="title" 
                required 
                type="text" 
                placeholder="Review Title *" 
                className="w-full bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-4 outline-none transition text-sm" 
            />
            
            <textarea 
                name="comment" 
                required 
                rows="5" 
                placeholder="Write your review here... *" 
                className="w-full bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-4 outline-none transition text-sm resize-none"
            ></textarea>
            
            <button 
                type="submit"
                className="bg-primary text-white font-bold px-10 py-4 rounded-xl hover:bg-primary-dark transition shadow-lg text-sm w-full md:w-auto"
            >
                Post Review
            </button>
        </form>
    </div>
  )
}