'use client'
import Link from 'next/link'
import { useState } from 'react'
import { deleteTourPermanently } from '@/app/admin/(dashboard)/tours/actions'
import TourStatusButton from './TourStatusButton'

export default function AdminTourCard({ tour, validation }) {
  const [isPending, setIsPending] = useState(false);

  const defaultTrans = tour.translations.find(t => t.language?.isDefault);
  const title = defaultTrans?.title || tour.slug;
  
  const image = tour.images.find(img => img.isPrimary)?.url || '/placeholder.jpg';

  const handleDelete = async () => {
    if (confirm('WARNING: This will permanently delete the tour and all its bookings. This cannot be undone. Are you sure?')) {
      setIsPending(true);
      await deleteTourPermanently(tour.id);
    }
  };

  const dimClasses = !tour.isActive ? 'opacity-75 grayscale' : '';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group relative`}>
      
      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${tour.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
          {tour.isActive ? 'Active' : 'Hidden'}
        </span>
        {tour.isFeatured && (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Featured</span>
        )}
      </div>

      {/* Image Thumbnail */}
      <div className="h-48 relative">
        <img 
            src={image} 
            alt={title} 
            className={`w-full h-full object-cover transition-all ${dimClasses}`} 
        />
        
        <span className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${tour.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
            {tour.isActive ? 'Live' : 'Draft'}
         </span>

         <div className="absolute top-3 right-3 z-20">
            <TourStatusButton 
                tourId={tour.id} 
                isActive={tour.isActive} 
                validation={validation} 
                isCompact={true} 
            />
         </div>
      </div>
      

      {/* Content */}
      <div className={`p-4 flex flex-col flex-grow ${dimClasses}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 line-clamp-1" title={title}>{title}</h3>
          <span className="text-primary font-bold text-sm">${(tour.priceAdult / 100).toFixed(2)}</span>
        </div>
        
        <div className="text-xs text-gray-500 mb-4 flex gap-2">
           {/* Note: Ideally pass default lang translations for cat/dest too, but generic fallback is okay here */}
           <span className="bg-gray-50 px-2 py-1 rounded border">{tour.category?.translations[0]?.name || 'No Category'}</span>
           <span className="bg-gray-50 px-2 py-1 rounded border">{tour.destination?.translations[0]?.name || 'No Dest.'}</span>
        </div>

        {/* Admin Actions */}
        <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
          <Link 
            href={`/tours/${tour.slug}`} 
            target="_blank"
            className="flex items-center justify-center gap-1 text-xs font-medium text-gray-600 hover:text-primary py-2 rounded hover:bg-gray-50"
          >
            <i className="fa-regular fa-eye"></i> View
          </Link>

          <Link 
            href={`/admin/tours/${tour.id}`} 
            className="flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 py-2 rounded hover:bg-blue-50"
          >
            <i className="fa-regular fa-pen-to-square"></i> Edit
          </Link>
          
          <button 
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center justify-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 py-2 rounded hover:bg-red-50"
          >
            <i className="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  )
}