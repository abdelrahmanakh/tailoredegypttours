'use client'
import { useState } from 'react'

export default function ImageGallery({ images = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Ensure we have at least placeholders if images are missing
  const displayImages = images.length > 0 ? images : [
      "/assets/placeholder-dest.jpg", "/assets/placeholder-dest.jpg", "/assets/placeholder-dest.jpg"
  ];

  return (
    <>
        {/* Exact HTML Structure from details.html */}
        <div className="gallery-grid mb-10 rounded-3xl overflow-hidden relative">
            <div className="gallery-main relative cursor-pointer" onClick={() => setIsOpen(true)}>
                <img src={displayImages[0]} alt="Main" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
            </div>
            <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
                <img src={displayImages[1] || displayImages[0]} alt="Detail 1" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
            </div>
            <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
                <img src={displayImages[2] || displayImages[0]} alt="Detail 2" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                <button className="absolute bottom-4 right-4 bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition z-10">
                    See all photos
                </button>
            </div>
        </div>

        {/* Modal */}
        {isOpen && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
                <button className="absolute top-4 right-4 text-white text-3xl">×</button>
                <div className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg" onClick={e => e.stopPropagation()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayImages.map((img, idx) => (
                             <img key={idx} src={img} className="w-full h-auto rounded-lg object-cover" />
                        ))}
                    </div>
                </div>
            </div>
        )}
    </>
  )
}