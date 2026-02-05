'use client'

export default function TourReviews() {
  const reviews = [
    {
      id: 1,
      name: "Ali Tufan",
      date: "April 2023",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop",
      rating: 5,
      title: "Excellent Service",
      comment: "This was an amazing experience! The guide was very knowledgeable and the transport was comfortable. Highly recommended for anyone visiting Phuket.",
      images: []
    },
    {
      id: 2,
      name: "Sarah Johnson",
      date: "May 2023",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
      rating: 4,
      title: "Beautiful Scenery",
      comment: "The islands are breathtaking. The lunch spot was a bit crowded, but the food was delicious. Make sure to bring sunscreen!",
      images: ["https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=200&auto=format&fit=crop", "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=200&auto=format&fit=crop"]
    },
    {
      id: 3,
      name: "Michael Smith",
      date: "June 2023",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000&auto=format&fit=crop",
      rating: 5,
      title: "Unforgettable",
      comment: "Everything was perfect from start to finish. The snorkeling spots were teeming with fish.",
      images: []
    }
  ];

  return (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-primary mb-6">Customer Reviews</h2>
        
        {/* Rating Summary Box */}
        <div className="bg-[#FDFBF6] rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start">
                <h3 className="font-bold text-primary text-xl">Overall Rating</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-sm">Excellent</span>
                    <div className="flex text-yellow-400 text-xs">
                        <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
                 <div className="bg-primary text-white font-bold text-3xl w-16 h-16 rounded-xl flex items-center justify-center shadow-lg mb-2">4.8</div>
                 <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Based on 269 reviews</span>
            </div>

            <div className="w-full md:w-1/2 space-y-2">
                {/* 5 Stars */}
                <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-gray-600 w-3">5</span>
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="bg-primary h-full w-[80%]"></div></div>
                </div>
                {/* 4 Stars */}
                <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-gray-600 w-3">4</span>
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="bg-primary h-full w-[15%]"></div></div>
                </div>
                {/* 3 Stars */}
                <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-gray-600 w-3">3</span>
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="bg-primary h-full w-[5%]"></div></div>
                </div>
            </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex items-start gap-4">
                        <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-sm font-bold text-primary">{review.name}</h4>
                                    <span className="text-xs text-gray-400">{review.date}</span>
                                </div>
                                <div className="flex text-yellow-400 text-xs">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fa-solid ${i < review.rating ? 'fa-star' : 'fa-star text-gray-200'}`}></i>
                                    ))}
                                </div>
                            </div>
                            
                            <h5 className="font-bold text-gray-800 text-sm mb-2">{review.title}</h5>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                            
                            {review.images.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                    {review.images.map((img, idx) => (
                                        <img key={idx} src={img} className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition" />
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <button className="text-xs font-bold text-primary hover:text-teal-600 flex items-center gap-1 transition">
                                    <i className="fa-regular fa-thumbs-up"></i> Helpful
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        <div className="text-center mt-8">
             <button className="border border-primary text-primary px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition">View all reviews</button>
        </div>
    </div>
  )
}