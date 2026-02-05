'use client'
import { useState, useTransition } from 'react'
import { upsertTourAudioGuide, deleteTourAudioGuide } from '../../actions'

export default function AudioGuidesTab({ tour, languages }) {
  // Sort languages: Default first, then alphabetical
  const sortedLangs = [...languages].sort((a, b) => 
     (b.isDefault === a.isDefault) ? 0 : b.isDefault ? 1 : -1
  )

  return (
    <div className="space-y-6 pb-20">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
             <h3 className="font-bold text-gray-800">Audio Guide Availability</h3>
             <p className="text-xs text-gray-500 mt-1">Specify which languages have an audio guide available.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {sortedLangs.map(lang => (
            <AudioGuideRow 
              key={lang.id} 
              lang={lang} 
              tour={tour} 
              savedGuide={tour.audioGuides.find(ag => ag.languageId === lang.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function AudioGuideRow({ lang, tour, savedGuide }) {
  const [isPending, startTransition] = useTransition()
  
  // 1. Local State (Sync with DB prop initially)
  const [isEnabled, setIsEnabled] = useState(!!savedGuide)
  const [isIncluded, setIsIncluded] = useState(savedGuide ? savedGuide.isIncluded : true)
  const [price, setPrice] = useState(savedGuide?.extraPrice ? (savedGuide.extraPrice / 100) : '')

  // 2. Handlers
  const handleToggleEnable = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    
    startTransition(async () => {
       if (newState) {
         // Enable with defaults
         const formData = new FormData()
         formData.append('tourId', tour.id)
         formData.append('languageId', lang.id)
         formData.append('isIncluded', 'on')
         await upsertTourAudioGuide(formData)
       } else {
         // Disable (Delete)
         await deleteTourAudioGuide(tour.id, lang.id)
       }
    })
  }

  const handleUpdateConfig = (newIncluded, newPrice) => {
     setIsIncluded(newIncluded)
     setPrice(newPrice)

     const formData = new FormData()
     formData.append('tourId', tour.id)
     formData.append('languageId', lang.id)
     if(newIncluded) formData.append('isIncluded', 'on')
     formData.append('extraPrice', newPrice)

     startTransition(() => upsertTourAudioGuide(formData))
  }

  return (
    <div className={`p-6 transition-colors ${isEnabled ? 'bg-white' : 'bg-gray-50/50'}`}>
       <div className="flex items-start gap-4">
          
          {/* A. Language Icon/Info */}
          <div className="flex-1">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border transition-colors
                   ${isEnabled ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200'}
                `}>
                   {lang.code.toUpperCase()}
                </div>
                <div>
                   <h4 className={`text-sm font-bold ${isEnabled ? 'text-gray-800' : 'text-gray-400'}`}>
                      {lang.name}
                   </h4>
                   <p className="text-xs text-gray-400">
                      {isEnabled ? 'Audio guide active' : 'Not available'}
                   </p>
                </div>
             </div>
          </div>

          {/* B. Main Toggle */}
          <div>
             <button 
                onClick={handleToggleEnable}
                disabled={isPending}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                   ${isEnabled ? 'bg-emerald-500' : 'bg-gray-300'}
                `}
             >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                   ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                `} />
             </button>
          </div>
       </div>

       {/* C. Configuration (Only if Enabled) */}
       {isEnabled && (
          <div className="mt-4 ml-14 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in slide-in-from-top-2">
             <div className="flex items-center gap-6">
                
                {/* 1. Is Included? */}
                <label className="flex items-center gap-2 cursor-pointer">
                   <input 
                      type="checkbox" 
                      checked={isIncluded}
                      onChange={e => handleUpdateConfig(e.target.checked, price)}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                   />
                   <span className="text-xs font-bold text-gray-700">Included in Ticket Price</span>
                </label>

                {/* 2. Extra Price (If not included) */}
                {!isIncluded && (
                   <div className="flex items-center gap-2 animate-in fade-in">
                      <span className="text-xs font-bold text-gray-500">Extra Cost:</span>
                      <div className="relative w-24">
                         <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                         <input 
                            type="number" 
                            step="0.01"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            onBlur={e => handleUpdateConfig(false, e.target.value)}
                            className="w-full pl-5 pr-2 py-1.5 text-xs font-bold border border-gray-300 rounded-lg outline-none focus:border-primary"
                            placeholder="0.00"
                         />
                      </div>
                   </div>
                )}
             </div>
          </div>
       )}
    </div>
  )
}