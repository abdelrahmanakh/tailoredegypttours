'use client'
import { useState } from 'react'
import { upload } from '@vercel/blob/client'
import ImageUploadBox from '../../../components/ImageUploadBox'

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
  // -- UPLOAD STATE --
  const [file, setFile] = useState(null) // The file object
  const [previewUrl, setPreviewUrl] = useState(destination.imageUrl || '')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [sizeWarning, setSizeWarning] = useState('')
  const [uploaderKey, setUploaderKey] = useState(0)

  // C. Handle Shared Input Changes
  const handleSharedChange = (field, value) => {
    setSharedDraft(prev => ({ ...prev, [field]: value }))
  }

  const handleRemoveImage = () => {
    setFile(null)
    setPreviewUrl('')
    setSharedDraft(prev => ({ ...prev, imageUrl: '' })) // Clear the URL
    setUploaderKey(prev => prev + 1) // <--- Force Reset
  }

  // Handle File Selection (Validation + Preview)
  const onFileSelect = (selectedFile) => {
    setSizeWarning('')
    if (selectedFile.size > 4.5 * 1024 * 1024) {
       alert("Max size 4.5MB"); return;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
       setSizeWarning('Warning: Image > 2MB')
    }
    
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  // Handle URL Text Input (Manual Paste)
  const onUrlChange = (val) => {
    setSharedDraft(prev => ({ ...prev, imageUrl: val }))
    setPreviewUrl(val)
    setFile(null) // Clear file if they manually paste
 }

  // D. Safe Save Handler (Shared)
  async function handleSharedSave(e) {
    e.preventDefault()
    setIsUploading(true)
    setUploadProgress(0)
    try {
      let finalUrl = sharedDraft.imageUrl

      // 1. Upload if file exists
      if (file) {
          const newBlob = await upload(file.name, file, {
              access: 'public',
              handleUploadUrl: '/api/upload',
              onUploadProgress: (p) => setUploadProgress(p.percentage)
          })
          finalUrl = newBlob.url
      }

      // 2. Prepare FormData manually since we prevented default
      const formData = new FormData()
      formData.append('id', destination.id)
      formData.append('slug', sharedDraft.slug)
      formData.append('imageUrl', finalUrl)
      if(sharedDraft.isFeatured) {
          formData.append('isFeatured', 'on')
          formData.append('featuredOrder', sharedDraft.featuredOrder)
      }

      // 3. Call Server Action
      await updateSharedAction(formData)
      
      // 4. Update local state
      setSharedDraft(prev => ({ ...prev, imageUrl: finalUrl }))
      setFile(null) // Reset file
      setUploadProgress(0)
      setUploaderKey(prev => prev + 1)

    } catch (error) {
        alert(error.message)
    } finally {
        setIsUploading(false)
    }
  }

  // E. Dirty Check (Shared)
  // We compare the Draft vs. the Original Props from DB
  const isSharedDirty = 
    sharedDraft.slug !== destination.slug ||
    (file !== null) || // Dirty if new file selected
    sharedDraft.imageUrl !== (destination.imageUrl || '') ||
    sharedDraft.isFeatured !== destination.isFeatured ||
    sharedDraft.featuredOrder != (destination.featuredOrder ?? 0);

  // -------------------------------------------------------------------------
  // 3. RENDER
  // -------------------------------------------------------------------------
  return (
    <div className="space-y-8">
      
      {/* SHARED SETTINGS FORM */}
      <form onSubmit={handleSharedSave} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">        
        <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase">Shared Settings</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded ${destination.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {destination.isActive ? 'Active' : 'Draft'}
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT: SLUG & FEATURED */}
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Slug (URL ID)</label>
                    <input 
                    name="slug" 
                    value={sharedDraft.slug}
                    onChange={(e) => handleSharedChange('slug', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm bg-gray-50 focus:bg-white transition-colors outline-none focus:border-primary" 
                    />
                </div>

                <div className={`p-4 rounded-lg border transition-all duration-300
                    ${sharedDraft.isFeatured ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}
                `}>
                    <div className="flex items-center gap-3 mb-3">
                        <input 
                            type="checkbox" 
                            id="feat-check"
                            checked={sharedDraft.isFeatured} 
                            onChange={(e) => handleSharedChange('isFeatured', e.target.checked)}
                            className="w-5 h-5 accent-yellow-600 cursor-pointer" 
                        />
                        <label htmlFor="feat-check" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
                            Mark as Featured
                        </label>
                    </div>
                    
                    {sharedDraft.isFeatured && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                             <label className="block text-xs font-bold text-gray-500 mb-1">Priority Order</label>
                             <input 
                                type="number" 
                                value={sharedDraft.featuredOrder}
                                onChange={(e) => handleSharedChange('featuredOrder', e.target.value)}
                                className="w-full border border-yellow-200 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-yellow-500"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: IMAGE UPLOADER */}
            <div>
                 <ImageUploadBox 
                    key={uploaderKey} // <--- Pass Key
                    previewUrl={previewUrl}
                    onFileSelect={onFileSelect}
                    onRemove={handleRemoveImage}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    sizeWarning={sizeWarning}
                    urlValue={sharedDraft.imageUrl}
                    onUrlChange={onUrlChange}
                 />
            </div>

        </div>

        <div className="mt-8 pt-4 border-t flex justify-end">
          <button 
            type="submit"
            disabled={!isSharedDirty || isUploading}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition shadow-sm
              ${(isSharedDirty || isUploading) 
                ? 'bg-gray-900 text-white hover:bg-black' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}
            `}
          >
            {isUploading ? `Uploading ${uploadProgress}%...` : 'Update Shared Info'}
          </button>
        </div>
      </form>

      {/* TRANSLATIONS MANAGER (Kept as is) */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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