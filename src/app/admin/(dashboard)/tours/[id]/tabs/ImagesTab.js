'use client'
import { useState, useTransition, useEffect } from 'react'
import { upsertTourImage, deleteTourImage, setPrimaryImage } from '../../actions'

export default function ImagesTab({ tour, languages }) {
  const [isPending, startTransition] = useTransition()
  
  const [activeLangId, setActiveLangId] = useState(languages[0]?.id)
  const [selectedImageId, setSelectedImageId] = useState('new') 

  // Sort images (Primary first)
  const images = [...(tour.images || [])].sort((a, b) => {
    if (a.isPrimary) return -1
    if (b.isPrimary) return 1
    return (a.order || 0) - (b.order || 0)
  })

  const activeImage = images.find(img => img.id === selectedImageId)
  const activeTrans = activeImage?.translations?.find(t => t.languageId === activeLangId)

  // Form Values
  const [formData, setFormData] = useState({ url: '', altText: '', order: 0, isPrimary: false })

  useEffect(() => {
    if (selectedImageId === 'new') {
      setFormData({ 
        url: '', 
        altText: '', 
        order: 0, 
        isPrimary: images.length === 0 
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

  async function handleSave(data) {
    startTransition(async () => {
      await upsertTourImage(data)
      if (selectedImageId === 'new') {
        setFormData({ url: '', altText: '', order: 0, isPrimary: false })
      }
    })
  }

  // Dirty Check: We relax the URL check since a file might be selected
  const isDirty = true; 

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. SLIDER / FILMSTRIP */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-gray-200 overflow-hidden">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">
          Gallery Slider ({images.length})
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
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

      {/* 2. EDITOR FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
             <h3 className="text-sm font-bold text-gray-800">
               {selectedImageId === 'new' ? 'Upload New Image' : 'Edit Image Details'}
             </h3>
             <p className="text-xs text-gray-500">
               {selectedImageId === 'new' ? 'Select a file to upload.' : 'Image file cannot be changed once uploaded.'}
             </p>
          </div>

          {selectedImageId !== 'new' && (
            <div className="flex gap-2">
              <button 
                  onClick={() => {
                    if(confirm("Delete image?")) {
                      startTransition(async () => {
                         await deleteTourImage(activeImage.id)
                         setSelectedImageId('new') 
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

          {/* Row 1: File Upload & URL View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* FILE INPUT (New Images) */}
            <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Upload Image</label>
                {selectedImageId === 'new' ? (
                    <input 
                        type="file" 
                        name="file" 
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer border border-gray-300 rounded-lg"
                    />
                ) : (
                    <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-500 italic">
                        To replace the image, please delete this entry and add a new one.
                    </div>
                )}
            </div>

            {/* URL PREVIEW (Read Only) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">File Link (View Only)</label>
              <div className="relative">
                <input 
                  name="url" 
                  value={formData.url}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-500 outline-none cursor-not-allowed"
                  placeholder="Generated after upload..."
                />
                <i className="fa-solid fa-link absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"></i>
              </div>
            </div>
          </div>

          {/* Row 2: Order, Alt Text, Primary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-2">
             
             {/* Display Order */}
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

             {/* Alt Text */}
             <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-2">
                  Alt Text <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] font-mono">{languages.find(l=>l.id===activeLangId)?.code}</span>
                </label>
                <input 
                  name="altText" 
                  value={formData.altText}
                  onChange={(e) => setFormData(prev => ({ ...prev, altText: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Accessibility description"
                />
             </div>

             {/* Primary Toggle */}
             <div className={`p-4 rounded-lg border transition-all duration-300 flex flex-col justify-center h-[74px] mt-0.5
                ${formData.isPrimary 
                  ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
                  : 'bg-white border-gray-200'}
             `}>
                <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="primary-check"
                      name="isPrimary" 
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
              disabled={isPending}
              className="px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all bg-gray-900 text-white hover:bg-black"
            >
              {isPending ? 'Uploading...' : (selectedImageId === 'new' ? 'Upload & Save' : 'Save Changes')}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}