'use client'

export default function TourReviews({ 
    reviews = [], 
    rating = 0, 
    reviewCount = 0, 
    ratingStats = { 5:0, 4:0, 3:0, 2:0, 1:0 } 
}) {
  
  // Helper to calculate bar width
  const getPercent = (star) => {
    if (reviewCount === 0) return 0;
    return ((ratingStats[star] || 0) / reviewCount) * 100;
  };

  return (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-6">Customer Reviews</h2>
        
        {/* Rating Summary Box */}
        <div className="bg-[#FDFBF6] rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
            <div className="flex flex-col items-center md:items-start">
                <h3 className="font-bold text-primary text-xl">Overall Rating</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-sm font-medium">
                        {rating >= 4.5 ? "Excellent" : rating >= 3 ? "Good" : "Average"}
                    </span>
                    <div className="flex text-yellow-400 text-xs">
                         {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fa-solid ${i < Math.round(rating) ? 'fa-star' : 'fa-star text-gray-200'}`}></i>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
                 <div className="bg-primary text-white font-bold text-3xl w-16 h-16 rounded-xl flex items-center justify-center shadow-lg mb-2">
                    {rating ? rating.toFixed(1) : '0.0'}
                 </div>
                 <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Based on {reviewCount} reviews</span>
            </div>

            {/* Progress Bars */}
            <div className="w-full md:w-1/2 space-y-2">
                {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-gray-600 w-3">{star}</span>
                        <i className="fa-solid fa-star text-yellow-400"></i>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="bg-primary h-full transition-all duration-500 rounded-full" 
                                style={{ width: `${getPercent(star)}%` }}
                            ></div>
                        </div>
                        <span className="text-gray-400 w-6 text-right">{Math.round(getPercent(star))}%</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-8">
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                        <div className="flex items-start gap-4">
                            {/* Avatar (Random placeholder based on name if no real avatar) */}
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl overflow-hidden shrink-0">
                                {review.avatar ? (
                                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-primary font-bold">{review.name.charAt(0)}</span>
                                )}
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="text-sm font-bold text-primary">{review.name}</h4>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                        <h4 className="text-primary font-bold text-lg mt-1">{review.title}</h4>
                                    </div>
                                    <div className="flex text-yellow-400 text-xs">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa-solid ${i < review.rating ? 'fa-star' : 'fa-star text-gray-200'}`}></i>
                                        ))}
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
                </div>
            )}
        </div>
    </div>
  )
}