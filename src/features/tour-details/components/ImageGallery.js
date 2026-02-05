'use client'
import { useState } from 'react'

export default function ImageGallery() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <div className="gallery-grid mb-10 rounded-3xl overflow-hidden relative">
            <div className="gallery-main relative cursor-pointer" onClick={() => setIsOpen(true)}>
                <img src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2039&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
            </div>
            <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
                <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
            </div>
            <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
                <img src="https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                <button className="absolute bottom-4 right-4 bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition z-10">See all photos</button>
            </div>
        </div>

        {isOpen && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setIsOpen(false)}>×</button>
                <div className="text-white">Gallery Modal Placeholder</div>
            </div>
        )}
    </>
  )
}