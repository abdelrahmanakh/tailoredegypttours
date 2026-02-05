'use client'
import { useState, useEffect } from 'react'

export default function DestinationEditor({ destination, languages, saveAction, updateSharedAction }) {
  // -------------------------------------------------------------------------
  // 1. TRANSLATION STATE 
  // -------------------------------------------------------------------------
  const [activeLangId, setActiveLangId] = useState(languages[0]?.id)
  const activeLang = languages.find(l => l.id === activeLangId)
  const translation = destination.translations.find(t => t.languageId === activeLangId) || {}

  const [drafts, setDrafts] = useState(() => {
    const initial = {}
    languages.forEach(lang => {
      const found = destination.translations.find(t => t.languageId === lang.id)
      initial[lang.id] = {
        name: found?.name || '',
        description: found?.description || ''
      }
    })
    return initial
  })

  // Handle Translation Input
  const handleTransChange = (field, value) => {
    setDrafts(prev => ({
      ...prev,
      [activeLangId]: { ...prev[activeLangId], [field]: value }
    }))
  }

  // Save Translation
  async function handleTransSave(formData) {
    await saveAction(formData)
  }

  const isTransDirty = 
    (drafts[activeLangId]?.name ?? '') !== (translation.name ?? '') || 
    (drafts[activeLangId]?.description ?? '') !== (translation.description ?? '');


  // -------------------------------------------------------------------------
  // 2. SHARED INFO STATE (NEW LOGIC)
  // -------------------------------------------------------------------------
  
  // A. Initialize Shared Draft
  const [sharedDraft, setSharedDraft] = useState({
    slug: destination.slug,
    imageUrl: destination.imageUrl || '',
    isFeatured: destination.isFeatured,
    featuredOrder: destination.featuredOrder ?? 0
  })

  // C. Handle Shared Input Changes
  const handleSharedChange = (field, value) => {
    setSharedDraft(prev => ({ ...prev, [field]: value }))
  }

  // D. Safe Save Handler (Shared)
  async function handleSharedSave(formData) {
    try {
      await updateSharedAction(formData)
    } catch (error) {
      alert(error.message)
    }
  }

  // E. Dirty Check (Shared)
  // We compare the Draft vs. the Original Props from DB
  const isSharedDirty = 
    sharedDraft.slug !== destination.slug ||
    sharedDraft.imageUrl !== (destination.imageUrl || '') ||
    sharedDraft.isFeatured !== destination.isFeatured ||
    // Use loose equality (==) for numbers because inputs return strings ('5' vs 5)
    sharedDraft.featuredOrder != (destination.featuredOrder ?? 0);

  // -------------------------------------------------------------------------
  // 3. RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* === SHARED SETTINGS FORM === */}
      <form action={handleSharedSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">        
        <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase">Shared Settings</h3>
            {/* Status Indicator (Read Only) */}
            <span className={`text-xs font-bold px-2 py-1 rounded ${destination.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {destination.isActive ? 'Active' : 'Draft'}
            </span>
        </div>

        <input type="hidden" name="id" value={destination.id} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* ... Slug and Image inputs ... */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Slug (URL ID)</label>
            <input 
              name="slug" 
              value={sharedDraft.slug}
              onChange={(e) => handleSharedChange('slug', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:border-primary" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
            <input 
              name="imageUrl" 
              value={sharedDraft.imageUrl}
              onChange={(e) => handleSharedChange('imageUrl', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-primary" 
            />
          </div>
        </div>

        {/* ... Featured Section (Unchanged) ... */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg border transition-all duration-300 mb-4 items-start
          ${sharedDraft.isFeatured 
            ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
            : 'bg-gray-50 border-gray-200'}
        `}>
          <div>
            <div className="block text-xs font-bold mb-1 opacity-0 select-none">Spacer</div>
            <div className="flex items-center gap-3 h-[42px]">
              <input 
                type="checkbox" 
                name="isFeatured" 
                id="feat-check"
                checked={sharedDraft.isFeatured} 
                onChange={(e) => handleSharedChange('isFeatured', e.target.checked)}
                className="w-5 h-5 accent-yellow-600 cursor-pointer flex-shrink-0" 
              />
              <label htmlFor="feat-check" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                {sharedDraft.isFeatured ? 'Marked as Featured' : 'Not Featured'}
              </label>
            </div>
          </div>
          <div className="w-full min-w-0">
            <label className={`block text-xs font-bold mb-1 transition-colors whitespace-nowrap text-left
              ${sharedDraft.isFeatured ? 'text-gray-700' : 'text-gray-400'}
            `}>
              Priority Order {sharedDraft.isFeatured && <span className="text-red-500">*</span>}
            </label>
            <input 
              type="number" 
              name="featuredOrder" 
              value={sharedDraft.featuredOrder}
              onChange={(e) => handleSharedChange('featuredOrder', e.target.value)}
              disabled={!sharedDraft.isFeatured}
              className={`w-full border rounded-lg p-2.5 text-sm outline-none transition-all h-[42px]
                ${sharedDraft.isFeatured ? 'bg-white border-gray-300 focus:ring-2 focus:ring-yellow-500' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}
              `}
              placeholder="0"
            />
            <p className={`text-[10px] mt-1 text-gray-500 font-mono transition-opacity leading-tight text-left pl-1
               ${sharedDraft.isFeatured ? 'opacity-99' : 'opacity-0'} 
            `}>
              Higher numbers show first.
            </p>
          </div>
        </div>
        <div className="mt-4 text-right">
          <button 
            disabled={!isSharedDirty}
            className={`text-xs px-4 py-2 rounded font-bold transition shadow-sm
              ${isSharedDirty 
                ? 'bg-gray-800 text-white hover:bg-black' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
            `}
          >
            Update Shared Info
          </button>
        </div>
      </form>

      {/* === TRANSLATIONS MANAGER (UI Unchanged, logic allows empty saves) === */}
      {/* ... (Keep the rest of the file exactly as it was) ... */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* ... Tabs ... */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {languages.map(lang => {
            const hasContent = drafts[lang.id]?.name || drafts[lang.id]?.description;
            return (
              <button
                key={lang.id}
                onClick={() => setActiveLangId(lang.id)}
                className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-r border-gray-200 transition whitespace-nowrap
                  ${activeLangId === lang.id ? 'bg-white text-primary border-b-2 border-b-white' : 'text-gray-500 hover:bg-gray-100'}
                `}
              >
                <span className="uppercase">{lang.code}</span>
                {/* Visual indicator for content */}
                {hasContent && <i className="fa-solid fa-circle-check text-emerald-500 text-[10px]"></i>}
              </button>
            )
          })}
        </div>
        <form action={handleTransSave} className="p-8">
          <input type="hidden" name="destinationId" value={destination.id} />
          <input type="hidden" name="languageId" value={activeLangId} />
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name ({activeLang?.name})</label>
              <input 
                name="name" 
                value={drafts[activeLangId]?.name || ''} 
                onChange={(e) => handleTransChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description ({activeLang?.name})</label>
              <textarea 
                name="description" 
                rows="5" 
                value={drafts[activeLangId]?.description || ''} 
                onChange={(e) => handleTransChange('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary outline-none"
              ></textarea>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                disabled={!isTransDirty}
                className={`px-8 py-3 rounded-xl font-bold shadow-md transition
                  ${isTransDirty 
                    ? 'bg-primary text-white hover:bg-primary-dark' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
              >
                Save {activeLang?.code.toUpperCase()}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}