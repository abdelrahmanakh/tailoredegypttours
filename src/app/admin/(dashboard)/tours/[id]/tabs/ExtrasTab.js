'use client'
import { useState, useTransition, useEffect } from 'react'
import { upsertTourExtra, deleteTourExtra } from '../../actions'

export default function ExtrasTab({ tour, languages }) {
  const [isPending, startTransition] = useTransition()
  const [activeLangId, setActiveLangId] = useState(languages[0]?.id)
  
  const extras = tour.extras || []

  // -- HANDLERS --
  // We use a small sub-component for each row to isolate its state (isDirty logic)
  
  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. Language Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setActiveLangId(lang.id)}
              className={`px-6 py-4 text-xs font-bold border-b-2 transition whitespace-nowrap flex-shrink-0
                ${activeLangId === lang.id 
                  ? 'border-primary text-primary bg-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'}
              `}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* 2. THE TABLE */}
        <div className="p-6">
            <div className="grid gap-4">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-6">Extra Name ({languages.find(l=>l.id===activeLangId)?.code})</div>
                    <div className="col-span-3">Price (USD)</div>
                    <div className="col-span-3 text-right">Actions</div>
                </div>

                {/* Existing Rows */}
                {extras.map(extra => (
                    <ExtraRow 
                        key={extra.id} 
                        extra={extra} 
                        tourId={tour.id} 
                        languageId={activeLangId} 
                    />
                ))}

                {/* Empty State */}
                {extras.length === 0 && (
                   <div className="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-100 rounded-lg">
                      No extras added yet.
                   </div>
                )}

                {/* Add New Row */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                    <p className="text-xs font-bold text-gray-800 mb-3 px-1">Add New Extra:</p>
                    <ExtraRow 
                        isNew={true} 
                        tourId={tour.id} 
                        languageId={activeLangId} 
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

// -- SUB-COMPONENT: Single Row (Handles its own state/save logic) --
function ExtraRow({ extra, tourId, languageId, isNew = false }) {
    const [isPending, startTransition] = useTransition()
    
    // 1. CALCULATE INITIAL VALUES (From DB/Props)
    // We memoize these values so we can reference them easily
    const propName = extra?.translations.find(t => t.languageId === languageId)?.name || ''
    const propPrice = extra ? (extra.price / 100).toFixed(2) : ''

    // 2. FORM STATE (What you type)
    const [name, setName] = useState(propName)
    const [price, setPrice] = useState(propPrice)
    
    // 3. REFERENCE STATE (Last successfully saved version)
    const [saved, setSaved] = useState({ name: propName, price: propPrice })
        
    // 4. EFFECT: Handle Language Switching
    // If the user clicks "French", we must force-update the inputs to show French data
    useEffect(() => {
        setName(propName)
        setPrice(propPrice)
        setSaved({ name: propName, price: propPrice })
    }, [propName, propPrice, languageId])

    // 5. CHECK DIRTY (Compare Input vs Saved)
    const isDirty = isNew 
        ? (name || price) // New row is dirty if you typed anything
        : (name !== saved.name || price !== saved.price) // Existing row dirty if different from saved

    // Reset Form (for New Row)
    const handleReset = () => {
        setName('')
        setPrice('')
    }

    const handleSave = async () => {
        if(!name) return;
        
        const formData = new FormData()
        formData.append('tourId', tourId)
        formData.append('extraId', isNew ? 'new' : extra.id)
        formData.append('languageId', languageId)
        formData.append('name', name)
        formData.append('price', price)

        startTransition(async () => {
            await upsertTourExtra(formData)
            if(isNew) handleReset() 
            // Alert or Toast could go here
            else setSaved({ name, price })
        })
    }

    const handleDelete = () => {
        if(confirm("Remove this extra?")) {
            startTransition(() => deleteTourExtra(extra.id))
        }
    }

    return (
        <div className={`grid grid-cols-12 gap-4 items-center p-3 rounded-xl transition-all
            ${isNew ? 'bg-emerald-50/50 border border-emerald-100' : 'bg-white border border-gray-200 shadow-sm'}
        `}>
            
            {/* Name Input */}
            <div className="col-span-6">
                <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={isNew ? "e.g. Airport Pickup" : "Extra Name..."}
                    className="w-full bg-transparent border-b border-gray-200 focus:border-primary focus:ring-0 px-2 py-2 text-sm font-medium outline-none transition-colors placeholder:text-gray-300"
                />
            </div>

            {/* Price Input */}
            <div className="col-span-3 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input 
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent border-b border-gray-200 focus:border-primary focus:ring-0 pl-6 pr-2 py-2 text-sm font-mono font-bold outline-none transition-colors"
                />
            </div>

            {/* Actions */}
            <div className="col-span-3 flex justify-end gap-2">
                {/* Save Button */}
                <button 
                    onClick={handleSave}
                    disabled={isPending || !isDirty || !name}
                    className={`h-8 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-2
                        ${isDirty 
                            ? 'bg-gray-900 text-white hover:bg-black shadow-md' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                    `}
                >
                    {isNew ? <><i className="fa-solid fa-plus"></i> Add</> : 'Save'}
                </button>

                {/* Delete Button (Existing Only) */}
                {!isNew && (
                    <button 
                        onClick={handleDelete}
                        disabled={isPending}
                        className="h-8 w-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center"
                    >
                        <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                )}
            </div>
        </div>
    )
}