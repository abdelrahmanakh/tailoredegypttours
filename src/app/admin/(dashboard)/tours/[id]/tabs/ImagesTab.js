'use client'
import { useState, useTransition, useEffect } from 'react'
import { upsertTourImage, deleteTourImage, setPrimaryImage } from '../../actions'

export default function ImagesTab({ tour, languages }) {
  const [isPending, startTransition] = useTransition()
  
  // -- STATE --
  const [activeLangId, setActiveLangId] = useState(languages[0]?.id)
  
  // "activeImage" is the one currently in the form. 
  // If null, we are in "Add New" mode.
  const [selectedImageId, setSelectedImageId] = useState('new') 

  // Sort images (Primary first)
  const images = [...(tour.images || [])].sort((a, b) => {
    if (a.isPrimary) return -1
    if (b.isPrimary) return 1
    return (a.order || 0) - (b.order || 0)
  })

  // -- DERIVED STATE (Form Data) --
  // Find the currently selected image object
  const activeImage = images.find(img => img.id === selectedImageId)
  
  // Find the translation for the current language
  const activeTrans = activeImage?.translations?.find(t => t.languageId === activeLangId)

  // Form Values
  const [formData, setFormData] = useState({ url: '', altText: '', order: 0, isPrimary: false })

  // When selection or language changes, update the form fields
  useEffect(() => {
    if (selectedImageId === 'new') {
      setFormData({ 
        url: '', 
        altText: '', 
        order: 0, 
        isPrimary: images.length === 0 // Auto-check if list is empty
      }) 
    } else if (activeImage) {
      setFormData({
        url: activeImage?.url || '',
        altText: activeTrans?.altText || '',
        order: activeImage?.order || 0,
        isPrimary: activeImage?.isPrimary || false
      })
    }
  }, [selectedImageId, activeLangId])


  // -- HANDLERS --
  async function handleSave(data) {
    startTransition(async () => {
      await upsertTourImage(data)
      // If we just added a new one, we might want to clear the form
      if (selectedImageId === 'new') {
        setFormData({ 
          url: '', 
          altText: '', 
          order: 0, 
          isPrimary: false 
        })
      }
    })
  }
  const isDirty = 
  formData.url !== (activeImage?.url || '') ||
  formData.altText !== (activeTrans?.altText || '') ||
  // Include these only if you added the new fields from the previous step:
  Number(formData.order) !== Number(activeImage?.order || 0)||
  formData.isPrimary !== (activeImage?.isPrimary || false);
  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. SLIDER / FILMSTRIP */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-gray-200 overflow-hidden">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">
          Gallery Slider ({images.length})
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
          
          {/* A. "ADD NEW" SLIDE */}
          <button
            onClick={() => setSelectedImageId('new')}
            className={`flex-shrink-0 w-40 h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all snap-start
              ${selectedImageId === 'new' 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500'}
            `}
          >
            <i className="fa-solid fa-plus text-2xl"></i>
            <span className="text-xs font-bold uppercase">Add New</span>
          </button>

          {/* B. IMAGE SLIDES */}
          {images.map(img => (
            <button
              key={img.id}
              onClick={() => setSelectedImageId(img.id)}
              className={`relative flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden border-2 transition-all snap-start group
                ${selectedImageId === img.id 
                  ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-gray-900' 
                  : 'border-transparent opacity-60 hover:opacity-100'}
              `}
            >
              <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
              
              {img.isPrimary && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                  COVER
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. EDITOR FORM (Context Aware) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
             <h3 className="text-sm font-bold text-gray-800">
               {selectedImageId === 'new' ? 'Add New Image' : 'Edit Image Details'}
             </h3>
             <p className="text-xs text-gray-500">
               {selectedImageId === 'new' ? 'Fill details below to add to gallery.' : 'Updating URL affects all languages.'}
             </p>
          </div>

          {/* Action Buttons (Only for existing images) */}
          {selectedImageId !== 'new' && (
            <div className="flex gap-2">
              <button 
                  onClick={() => {
                    if(confirm("Delete image?")) {
                      startTransition(async () => {
                         await deleteTourImage(activeImage.id)
                         setSelectedImageId('new') // Go back to start
                      })
                    }
                  }}
                  className="bg-white border border-gray-300 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-200 transition"
              >
                  <i className="fa-solid fa-trash mr-1"></i> Delete
              </button>
            </div>
          )}
        </div>

        {/* LANGUAGE BAR (Only Affects Alt Text) */}
        <div className="flex border-b border-gray-200 bg-white overflow-x-auto">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setActiveLangId(lang.id)}
              className={`px-6 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap
                ${activeLangId === lang.id 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'}
              `}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* INPUTS */}
        <form action={handleSave} className="p-8 space-y-6">
          <input type="hidden" name="tourId" value={tour.id} />
          <input type="hidden" name="imageId" value={selectedImageId} />
          <input type="hidden" name="languageId" value={activeLangId} />

          {/* Row 1: URL & Order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Image URL <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  name="url" 
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="https://..."
                />
                <i className="fa-solid fa-link absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Display Order</label>
              <input 
                type="number"
                name="order" 
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>

          {/* Row 2: Alt Text & Primary Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-6">
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-2">
                  Alt Text <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-mono">{languages.find(l=>l.id===activeLangId)?.code}</span>
                </label>
                <input 
                  name="altText" 
                  value={formData.altText}
                  onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder={`Accessibility text in ${languages.find(l=>l.id===activeLangId)?.name}`}
                />
             </div>

             {/* Primary Checkbox (Replaces Slider) */}
             <div className={`p-4 rounded-lg border transition-all duration-300 flex flex-col justify-center h-[74px]
                ${formData.isPrimary 
                  ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
                  : 'bg-white border-gray-200'}
             `}>
                <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="primary-check"
                      name="isPrimary" 
                      value="on" 
                      checked={formData.isPrimary} 
                      onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                      className="w-5 h-5 accent-yellow-600 cursor-pointer flex-shrink-0" 
                    />
                    <div>
                      <label htmlFor="primary-check" className="text-sm font-bold text-gray-700 cursor-pointer select-none block">
                        {formData.isPrimary ? 'Set as Cover Image' : 'Standard Image'}
                      </label>
                      <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                        {formData.isPrimary ? 'This will be the main thumbnail.' : 'Visible in gallery only.'}
                      </p>
                    </div>
                </div>
             </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button 
              // Disable if: Saving, No URL, or No Changes
              disabled={isPending || !formData.url || !isDirty}
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all
                ${isDirty 
                  ? 'bg-gray-900 text-white hover:bg-black shadow-md' // Active State
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}   // "Saved" State
              `}
            >
              {selectedImageId === 'new' ? 'Add Image' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}