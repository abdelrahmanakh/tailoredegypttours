'use client'
import { useState, useTransition } from 'react'
import { updateTourTags } from '../../actions'

export default function BasicInfoTab({ tour, destinations, categories, languages, tags, updateSharedAction, saveTransAction }) {
  
  // -------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // -------------------------------------------------------------------------
  
  // A. Logistics (Shared across languages)
  const [shared, setShared] = useState({
    slug: tour.slug,
    destinationId: tour.destinationId,
    categoryId: tour.categoryId,
    durationDays: tour.durationDays,
    priceAdult: tour.priceAdult / 100, // DB stores cents, UI shows dollars
    priceChild: tour.priceChild / 100,
    maxCapacity: tour.maxCapacity || 0,
    isFeatured: tour.isFeatured,
    featuredOrder: tour.featuredOrder || 0
  })
  // Tags State
  const [selectedTags, setSelectedTags] = useState(tour.tags?.map(t => t.id) || [])
  const [isTagsPending, startTagsTransition] = useTransition()
    
  // B. Content (Translations)
  const [activeLangId, setActiveLangId] = useState(languages[0]?.id)
  const activeLang = languages.find(l => l.id === activeLangId)

  const [drafts, setDrafts] = useState(() => {
    const initial = {}
    languages.forEach(lang => {
      const found = tour.translations.find(t => t.languageId === lang.id)
      initial[lang.id] = {
        title: found?.title || '',
        Overview: found?.Overview || '',
        description: found?.description || '',
        highlights: found?.highlights || '',
        included: found?.included || '',
        excluded: found?.excluded || ''
      }
    })
    return initial
  })

  // -------------------------------------------------------------------------
  // 2. HANDLERS
  // -------------------------------------------------------------------------

  const handleSharedChange = (field, value) => {
    setShared(prev => ({ ...prev, [field]: value }))
  }

  const handleTransChange = (field, value) => {
    setDrafts(prev => ({
      ...prev,
      [activeLangId]: { ...prev[activeLangId], [field]: value }
    }))
  }

  // Tags Toggle Handler with Auto-Save
  const handleTagToggle = (tagId) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId) // Remove
      : [...selectedTags, tagId] // Add
    
    setSelectedTags(newTags)

    // Auto-save
    const formData = new FormData()
    formData.append('tourId', tour.id)
    formData.append('tagIds', newTags.join(','))
    
    startTagsTransition(() => updateTourTags(formData))
  }

  const getTagName = (tag) => {
    // Attempt to find translation for active language, fallback to first, then slug
    if (!tag.translations) return tag.slug
    const trans = tag.translations.find(t => t.languageId === activeLangId)
    return trans?.name || tag.translations[0]?.name || tag.slug
  }

  // Save Actions
  async function onSaveShared(formData) {
    try {
      await updateSharedAction(formData)
    } catch(e) { alert(e.message) }
  }

  async function onSaveTrans(formData) {
    try {
      await saveTransAction(formData)
    } catch(e) { alert(e.message) }
  }

  // Dirty Checks (Optional visual feedback)
  const activeDraft = drafts[activeLangId] || {};
  const activeOriginal = tour.translations.find(t => t.languageId === activeLangId) || {};
  const safeStr = (str) => str || '';

  const isTransDirty = 
    safeStr(activeDraft.title) !== safeStr(activeOriginal.title) ||
    safeStr(activeDraft.Overview) !== safeStr(activeOriginal.Overview) ||
    safeStr(activeDraft.description) !== safeStr(activeOriginal.description) ||
    safeStr(activeDraft.highlights) !== safeStr(activeOriginal.highlights) ||
    safeStr(activeDraft.included) !== safeStr(activeOriginal.included) ||
    safeStr(activeDraft.excluded) !== safeStr(activeOriginal.excluded);

  const isSharedDirty = 
    shared.slug !== tour.slug ||
    shared.destinationId !== tour.destinationId ||
    shared.categoryId !== tour.categoryId ||
    shared.durationDays !== tour.durationDays ||
    shared.priceAdult !== (tour.priceAdult / 100) ||
    shared.priceChild !== (tour.priceChild / 100) ||
    shared.maxCapacity !== (tour.maxCapacity || 0) ||
    shared.isFeatured !== tour.isFeatured ||
    shared.featuredOrder != (tour.featuredOrder || 0);

  // -------------------------------------------------------------------------
  // 3. RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-10 pb-20">
      
      {/* =========================================================
          SECTION 1: CONFIGURATION & LOGISTICS
          Matches Destination/Category Editor Design
          ========================================================= */}
      <form action={onSaveShared} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        
        {/* Card Header */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
            <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Configuration & Logistics</h3>
                <p className="text-xs text-gray-400 mt-1">Technical details shared across all languages.</p>
            </div>
            {/* Status Badge (Read Only) */}
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border ${tour.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                {tour.isActive ? '● Live' : '○ Draft'}
            </span>
        </div>

        <input type="hidden" name="id" value={tour.id} />

        {/* --- ROW 1: IDENTITY (Slug & Category) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Slug (URL) <span className="text-red-500">*</span></label>
                <div className="relative">
                    <input 
                        name="slug" 
                        value={shared.slug} 
                        onChange={e => handleSharedChange('slug', e.target.value)} 
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                        placeholder="classic-egypt-tour"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Category</label>
                <div className="relative">
                    <select 
                        name="categoryId" 
                        value={shared.categoryId} 
                        onChange={e => handleSharedChange('categoryId', e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all cursor-pointer"
                    >
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.translations[0]?.name || c.slug}</option>
                        ))}
                    </select>
                    <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
            </div>
        </div>

        {/* --- ROW 2: LOCATION & TIME --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Destination</label>
                <div className="relative">
                    <select 
                        name="destinationId" 
                        value={shared.destinationId} 
                        onChange={e => handleSharedChange('destinationId', e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm appearance-none outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all cursor-pointer"
                    >
                        {destinations.map(d => (
                            <option key={d.id} value={d.id}>{d.translations[0]?.name || d.slug}</option>
                        ))}
                    </select>
                    <i className="fa-solid fa-location-dot absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Duration (Days) <span className="text-red-500">*</span></label>
                <div className="relative">
                    <input 
                        type="number" 
                        name="durationDays" 
                        value={shared.durationDays} 
                        onChange={e => handleSharedChange('durationDays', e.target.value)} 
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                    />
                    <i className="fa-regular fa-clock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>
        </div>

        {/* --- ROW 3: PRICING & CAPACITY --- */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">Pricing & Availability</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Adult Price <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input 
                            type="number" 
                            step="0.01" 
                            name="priceAdult" 
                            value={shared.priceAdult} 
                            onChange={e => handleSharedChange('priceAdult', e.target.value)} 
                            className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Child Price <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input 
                            type="number" 
                            step="0.01" 
                            name="priceChild" 
                            value={shared.priceChild} 
                            onChange={e => handleSharedChange('priceChild', e.target.value)} 
                            className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                        Max Capacity <span className="text-gray-400 font-normal normal-case ml-1">(Optional)</span>
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            name="maxCapacity" 
                            value={shared.maxCapacity} 
                            onChange={e => handleSharedChange('maxCapacity', e.target.value)} 
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                            placeholder="Unlimited"
                        />
                        <i className="fa-solid fa-users absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>
            </div>
        </div>

        {/* --- ROW 4: FEATURED TOGGLE (Matching Destination Design) --- */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg border transition-all duration-300 items-start
          ${shared.isFeatured 
            ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
            : 'bg-white border-gray-200'}
        `}>
          
          {/* Column 1: Checkbox */}
          <div className="flex items-center gap-3 h-[42px]">
            <input 
                type="checkbox" 
                id="feat-toggle"
                name="isFeatured" 
                checked={shared.isFeatured} 
                onChange={e => handleSharedChange('isFeatured', e.target.checked)} 
                className="w-5 h-5 accent-yellow-600 cursor-pointer flex-shrink-0" 
            />
            <div>
                <label htmlFor="feat-toggle" className="text-sm font-bold text-gray-700 cursor-pointer select-none block">
                    {shared.isFeatured ? 'Marked as Featured' : 'Not Featured'}
                </label>
            </div>
          </div>

          {/* Column 2: Priority Input */}
          <div className="w-full min-w-0">
            <label className={`block text-xs font-bold mb-1 transition-colors
              ${shared.isFeatured ? 'text-gray-700' : 'text-gray-400'}
            `}>
              Priority Order {shared.isFeatured &&  <span className="text-red-500">*</span>}
            </label>
            
            <input 
              type="number" 
              name="featuredOrder" 
              value={shared.featuredOrder}
              onChange={(e) => handleSharedChange('featuredOrder', e.target.value)}
              disabled={!shared.isFeatured}
              className={`w-full border rounded-lg p-2.5 text-sm outline-none transition-all h-[42px]
                ${shared.isFeatured 
                  ? 'bg-white border-gray-300 focus:ring-2 focus:ring-yellow-500' 
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}
              `}
              placeholder="0"
            />
            
            <p className={`text-[10px] mt-1 text-gray-500 font-mono transition-opacity leading-tight text-left
               ${shared.isFeatured ? 'opacity-99' : 'opacity-0'} 
            `}>
              Higher numbers show first on homepage.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end">
          <button 
            disabled={!isSharedDirty}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition shadow-sm
              ${isSharedDirty 
                ? 'bg-gray-900 text-white hover:bg-black' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
            `}
          >
            Update Configuration
          </button>
        </div>
      </form>
      
      {/* =========================================================
          SECTION 1.5: TAGS SELECTION
          ========================================================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
         <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
             <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Key-words Tags</h3>
                <p className="text-xs text-gray-400 mt-1">Select tags for SEO and filtering. Changes save automatically.</p>
             </div>
             {isTagsPending && <span className="text-xs text-emerald-600 font-bold animate-pulse">Saving...</span>}
         </div>
         
         <div className="flex flex-wrap gap-2">
            {tags && tags.map(tag => {
               const isSelected = selectedTags.includes(tag.id)
               return (
                  <button
                     key={tag.id}
                     onClick={() => handleTagToggle(tag.id)}
                     className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 flex items-center
                        ${isSelected 
                           ? 'bg-black text-white border-black shadow-md transform scale-105' 
                           : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'}
                     `}
                  >
                     {isSelected && <i className="fa-solid fa-check mr-1.5 text-[10px]"></i>}
                     {getTagName(tag)}
                  </button>
               )
            })}
            
            {(!tags || tags.length === 0) && (
               <div className="text-center w-full py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                   <p className="text-xs text-gray-400 italic">
                      No tags found. Go to Settings {'>'} Tags to create them first.
                   </p>
               </div>
            )}
         </div>
      </div>

      {/* =========================================================
          SECTION 2: CONTENT & TRANSLATIONS
          ========================================================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Language Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setActiveLangId(lang.id)}
              className={`px-6 py-4 text-sm font-bold flex items-center gap-2 border-r border-gray-200 transition whitespace-nowrap
                ${activeLangId === lang.id ? 'bg-white text-primary border-b-2 border-b-white' : 'text-gray-500 hover:bg-gray-100'}
              `}
            >
              <span className="uppercase">{lang.code}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>

        <form action={onSaveTrans} className="p-8 space-y-6">
          <input type="hidden" name="tourId" value={tour.id} />
          <input type="hidden" name="languageId" value={activeLangId} />

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Tour Title</label>
            <input 
                name="title" 
                value={drafts[activeLangId]?.title} 
                onChange={e => handleTransChange('title', e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={`e.g. ${activeLang?.code === 'en' ? 'Classic Egypt Tour' : 'Voyage en Égypte'}`} 
            />
          </div>

          {/* Overview */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Overview <span className="text-gray-400 normal-case ml-1">(Short Description)</span></label>
            <textarea 
                name="Overview" 
                rows="4" 
                value={drafts[activeLangId]?.Overview} 
                onChange={e => handleTransChange('Overview', e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="A brief summary of the experience..."
            ></textarea>
          </div>
          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
              Description <span className="text-gray-400 normal-case ml-1">(Long Text)</span>
            </label>
            <textarea 
                name="description" 
                rows="6" 
                value={drafts[activeLangId]?.description} 
                onChange={e => handleTransChange('description', e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Detailed information about the tour experience..."
            ></textarea>
          </div>
          {/* Highlights */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Highlights</label>
            <textarea 
                name="highlights" 
                rows="4" 
                value={drafts[activeLangId]?.highlights} 
                onChange={e => handleTransChange('highlights', e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={'Visit the Pyramids\nCruise the Nile\nSee the Sphinx'}
            ></textarea>
            <p className="text-[10px] text-gray-400 mt-1">Use new lines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-emerald-700 mb-2 uppercase">Included</label>
              <textarea 
                name="included" 
                rows="6" 
                value={drafts[activeLangId]?.included} 
                onChange={e => handleTransChange('included', e.target.value)} 
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-emerald-50/10"
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-700 mb-2 uppercase">Excluded</label>
              <textarea 
                name="excluded" 
                rows="6" 
                value={drafts[activeLangId]?.excluded} 
                onChange={e => handleTransChange('excluded', e.target.value)} 
                className="w-full px-4 py-3 border border-rose-200 rounded-lg text-sm outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all bg-rose-50/10"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end">
              <button 
                disabled={!isTransDirty}
                className={`px-8 py-3 rounded-xl font-bold shadow-sm transition-all
                  ${isTransDirty 
                    ? 'bg-primary text-white hover:bg-primary-dark shadow-md transform hover:scale-[1.02]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
              >
                {isTransDirty ? `Save ${languages.find(l => l.id === activeLangId)?.name} Content` : 'Saved'}
              </button>
          </div>
        </form>
      </div>
    </div>
  )
}