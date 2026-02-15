'use client'
import { useState, useTransition, useEffect, useRef } from 'react'
import { upsertTourImage, deleteTourImage } from '../../actions'
import { upload } from '@vercel/blob/client';

export default function ImagesTab({ tour, languages }) {
  const [isPending, startTransition] = useTransition()
  const inputFileRef = useRef(null);
  
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
  const [previewUrl, setPreviewUrl] = useState('') // For showing the file before upload
  const [isUploading, setIsUploading] = useState(false)
  const [sizeWarning, setSizeWarning] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  // When selection or language changes, update the form fields
  useEffect(() => {
    if (selectedImageId === 'new') {
      setFormData({ 
        url: '', 
        altText: '', 
        order: 0, 
        isPrimary: images.length === 0 // Auto-check if list is empty
      }) 
      setPreviewUrl('')
      setSizeWarning('') // Clear warning
      if (inputFileRef.current) inputFileRef.current.value = '';
    } else if (activeImage) {
      setFormData({
        url: activeImage?.url || '',
        altText: activeTrans?.altText || '',
        order: activeImage?.order || 0,
        isPrimary: activeImage?.isPrimary || false
      })
      setPreviewUrl(activeImage?.url || '')
      setSizeWarning('') // Clear warning
    }
  }, [selectedImageId, activeLangId])


  // -- HANDLERS --
  // 1. File Selection Handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    setSizeWarning('') // Reset
    if (file) {
      if (file.size > 4.5 * 1024 * 1024) {
        alert("File is too large! Max size is 4.5MB.");
        e.target.value = ""; // Clear input
        return;
      }
      // LIMIT 2: Soft Warning > 2MB (Performance Concern)
      if (file.size > 2 * 1024 * 1024) {
        setSizeWarning('Warning: This image is over 2MB. It may slow down your website.')
      }
      // Create a local preview URL immediately
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      // We don't upload yet. We wait for the Save button.
    }
  }

  // 2. Main Save Handler
  async function handleSubmit(e) {
    e.preventDefault(); // Stop standard form submission
    
    setIsUploading(true);
    setUploadProgress(0); // Reset progress

    let finalUrl = formData.url;

    // A. Check if there is a file to upload
    if (inputFileRef.current?.files?.length > 0) {
        const file = inputFileRef.current.files[0];
        try {
            // Upload to Vercel Blob
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload', // Points to route created in Step 2
                onUploadProgress: (progressEvent) => {
                  setUploadProgress(progressEvent.percentage);
               }
            });
            finalUrl = newBlob.url;
        } catch (err) {
            alert('Upload failed: ' + err.message);
            setIsUploading(false);
            setUploadProgress(0);
            return;
        }
    }

    // B. Call Server Action
    const payload = new FormData();
    payload.append('tourId', tour.id);
    payload.append('imageId', selectedImageId);
    payload.append('languageId', activeLangId);
    payload.append('url', finalUrl); // Send the Blob URL
    payload.append('altText', formData.altText);
    payload.append('order', formData.order);
    if(formData.isPrimary) payload.append('isPrimary', 'on');

    startTransition(async () => {
      await upsertTourImage(payload);
      setIsUploading(false);
      setUploadProgress(0);
      
      // If new, reset
      if (selectedImageId === 'new') {
        setFormData({ url: '', altText: '', order: 0, isPrimary: false });
        setPreviewUrl('');
        setSizeWarning('');
        if (inputFileRef.current) inputFileRef.current.value = '';
      }
    });
  }  

  const isDirty = 
    (inputFileRef.current?.files?.length > 0) || // Dirty if file selected
    formData.url !== (activeImage?.url || '') ||
    formData.altText !== (activeTrans?.altText || '') ||
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
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Row 1: URL & Order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase">Image File <span className="text-red-500">*</span></label>
              {/* Custom File Upload UI */}
              <div className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white transition-colors cursor-pointer group
                  ${sizeWarning ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-primary'}
              `}>
                  <input 
                    ref={inputFileRef}
                    type="file" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />
                  {previewUrl ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm flex flex-col">
                        <img src={previewUrl} className="w-full h-full object-contain bg-white" alt="Preview" />
                        {/* 👇 PROGRESS BAR OVERLAY 👇 */}
                        {isUploading && (
                             <div className="absolute inset-x-0 bottom-0 bg-black/75 p-3 backdrop-blur-sm transition-all">
                                <div className="flex justify-between text-xs font-bold text-white mb-1">
                                   <span>{uploadProgress < 100 ? 'Uploading...' : 'Finalizing...'}</span>
                                   <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-1.5 overflow-hidden">
                                   <div 
                                      className="bg-emerald-500 h-full transition-all duration-300 ease-out" 
                                      style={{ width: `${uploadProgress}%` }}
                                   ></div>
                                </div>
                             </div>
                          )}

                          {!isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white font-bold text-sm"><i className="fa-solid fa-pen mr-2"></i>Click to Change</p>
                            </div>
                          )}
                      </div>
                  ) : (
                      <div className="text-center py-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3">
                             <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
                          </div>
                          <p className="text-sm font-bold text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or WebP</p>
                      </div>
                  )}
              </div>
              {/* 4. SHOW WARNING MESSAGE IF EXISTS */}
              {sizeWarning && (
                <div className="text-xs font-bold text-yellow-700 flex items-center gap-2 bg-yellow-100 p-2 rounded">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  {sizeWarning}
                </div>
              )}
              {/* Fallback URL Input (Hidden logic optional, or allow manual override) */}
              <div className="relative">
                <input 
                  name="url" 
                  value={formData.url}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, url: e.target.value }));
                    setPreviewUrl(e.target.value); // Update preview if pasting URL manually
                  }}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-500 outline-none focus:border-primary transition-all"
                  placeholder="Or paste external URL..."
                />
                <i className="fa-solid fa-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              </div>
            </div>
            {/* Side Controls */}
            <div className="space-y-6">
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
              {/* Primary Checkbox */}
              <div className={`p-4 rounded-lg border transition-all duration-300 flex flex-col justify-center
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
                            Set as Cover
                        </label>
                        <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                            Main thumbnail for cards.
                        </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Row 2: Alt Text */}
            <div className="pt-2">
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

            <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={isPending || isUploading || (!formData.url && !inputFileRef.current?.files?.length)}
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2
                ${(isDirty || isUploading)
                  ? 'bg-gray-900 text-white hover:bg-black shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
              `}
            >
              {isUploading ? (
                  <span>
                    {uploadProgress < 100 ? `Uploading ${uploadProgress}%` : 'Saving to Database...'}
                  </span>
              ) : ( selectedImageId === 'new' ? 'Upload & Save' : 'Save Changes' )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}