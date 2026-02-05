'use client'
import { useState, useTransition, useEffect } from 'react'
import { addItineraryItem, deleteItineraryItem, saveItineraryTranslation } from '../../actions'

export default function ItineraryTab({ tour, languages }) {
  const [isPending, startTransition] = useTransition()
  const [activeLangId, setActiveLangId] = useState(languages[0]?.id)
  const [expandedId, setExpandedId] = useState(null)
  const [draft, setDraft] = useState({ title: '', content: '' })

  useEffect(() => {
    if (expandedId) {
      const item = items.find(i => i.id === expandedId)
      const trans = item?.translations.find(t => t.languageId === activeLangId) || {}
      setDraft({
        title: trans.title || '',
        content: trans.content || ''
      })
    }
  }, [expandedId, activeLangId, tour.itinerary])
  
  // Ensure items are sorted by 'day'
  const items = [...(tour.itinerary || [])].sort((a, b) => a.day - b.day)

  // -- HANDLERS --
  const handleAdd = (targetDay) => {
    startTransition(() => {
        addItineraryItem(tour.id, targetDay)
        // Optionally expand the new item automatically (logic would go here)
    })
  }

  const handleDelete = (itemId) => {
    if(confirm("Delete this step? Subsequent steps will shift up.")) {
      startTransition(() => deleteItineraryItem(itemId))
    }
  }

  const handleSave = async (formData) => {
    await saveItineraryTranslation(formData)
    // alert("Saved!") // Optional feedback
  }

  return (
    <div className="space-y-8 pb-20">
      
      {/* MAIN CARD: Languages + Content in one box */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* 1. TOP: Language Selector */}
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
        
        {/* 2. MIDDLE: The Itinerary List */}
        <div className="p-8 bg-white min-h-[300px]">
            
            {/* EMPTY STATE */}
            {items.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-400 text-sm mb-4">No itinerary steps yet.</p>
                    <button 
                        onClick={() => handleAdd(1)}
                        className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold shadow hover:bg-primary-dark transition"
                    >
                        <i className="fa-solid fa-plus-circle mr-2"></i>
                        Add First Step
                    </button>
                </div>
            )}

            {/* LIST LOOP */}
            <div className="space-y-6">
                {items.map((item, index) => {
                    const currentDay = index + 1; // 1, 2, 3...
                    const trans = item.translations.find(t => t.languageId === activeLangId) || {};
                    const isExpanded = expandedId === item.id;

                    return (
                        <div key={item.id} className="group relative">
                            
                            {/* A. INSERT BUTTON (Hover to see) */}
                            {/* Allows inserting 'between' steps */}
                            <div className="h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity absolute w-full left-0 -top-5 z-10 pointer-events-none group-hover:pointer-events-auto">
                                <button 
                                    onClick={() => handleAdd(currentDay)}
                                    className="bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md hover:scale-110 transition transform"
                                    title={`Insert new step before #${currentDay}`}
                                >
                                    + Insert Here
                                </button>
                                <div className="h-px bg-emerald-500/30 w-full absolute z-[-1]"></div>
                            </div>

                            {/* B. ITEM CARD */}
                            <div className={`border rounded-lg transition-all duration-200 overflow-hidden
                                ${isExpanded ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'}
                            `}>
                                {/* Header */}
                                <div 
                                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                    className={`px-4 py-3 flex items-center justify-between cursor-pointer select-none
                                        ${isExpanded ? 'bg-primary/5' : 'bg-white'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Simple Number Badge (No "Day" text) */}
                                        <span className={`w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold font-mono
                                            ${isExpanded ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
                                        `}>
                                            #{currentDay}
                                        </span>
                                        
                                        <span className={`text-sm font-medium truncate max-w-md ${!trans.title && 'text-gray-400 italic'}`}>
                                            {trans.title || '(Untitled Step)'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                            title="Delete step"
                                        >
                                            <i className="fa-solid fa-trash text-xs"></i>
                                        </button>
                                        <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}></i>
                                    </div>
                                </div>

                                {/* Body (Form) */}
                                {isExpanded && (
                                    <form action={handleSave} className="p-5 border-t border-gray-100 bg-white">
                                        <input type="hidden" name="itineraryId" value={item.id} />
                                        <input type="hidden" name="tourId" value={tour.id} />
                                        <input type="hidden" name="languageId" value={activeLangId} />

                                        <div className="space-y-5">
                                            {/* Title Input */}
                                            <div>
                                                <div className="flex justify-between mb-1.5">
                                                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                                                        Step Title <span className="text-primary">({languages.find(l=>l.id===activeLangId)?.code})</span>
                                                    </label>
                                                </div>
                                                <input 
                                                    name="title" 
                                                    value={draft.title}
                                                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    placeholder="e.g. Arrival & Check-in"
                                                />
                                            </div>

                                            {/* Content Input */}
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">
                                                    Description / Activities
                                                </label>
                                                <textarea 
                                                    name="content" 
                                                    value={draft.content} // Changed from defaultValue
                                                    onChange={(e) => setDraft({ ...draft, content: e.target.value })} // New
                                                    rows="4"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"
                                                    placeholder="Describe what happens..."
                                                ></textarea>
                                            </div>
                                            {/* Calculate isDirty locally for the active item */}
                                            {(() => {
                                                const isDirty = 
                                                    draft.title !== (trans.title || '') || 
                                                    draft.content !== (trans.content || '');

                                                return (
                                                    <div className="flex justify-end pt-2">
                                                        <button 
                                                            disabled={!isDirty} 
                                                            className={`px-5 py-2 rounded-lg text-xs font-bold transition shadow-sm
                                                                ${isDirty 
                                                                    ? 'bg-gray-900 text-white hover:bg-black' 
                                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
                                                            `}
                                                        >
                                                            {isDirty ? 'Save Changes' : 'Saved'}
                                                        </button>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* 3. BOTTOM: Append Button */}
            {items.length > 0 && (
                <button 
                    onClick={() => handleAdd(items.length + 1)}
                    className="w-full mt-6 py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-plus"></i>
                    Add Step #{items.length + 1}
                </button>
            )}

        </div>
      </div>
    </div>
  )
}