'use client'
import { useRef } from 'react'

export default function ImageUploadBox({ 
  previewUrl, 
  onFileSelect, 
  onRemove, // <--- New Prop
  isUploading, 
  uploadProgress, 
  sizeWarning,
  urlValue,       
  onUrlChange     
}) {
  const inputFileRef = useRef(null)

  const handlePick = (e) => {
    const file = e.target.files[0]
    if(file) onFileSelect(file)
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-gray-700 uppercase">Cover Image</label>
      
      {/* Upload Box */}
      <div className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white transition-colors cursor-pointer group
          ${sizeWarning ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-primary'}
      `}>
          <input 
            ref={inputFileRef}
            type="file" 
            accept="image/*"
            onChange={handlePick}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            disabled={isUploading}
          />
          
          {previewUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm flex flex-col">
                  <img src={previewUrl} className="w-full h-full object-contain bg-white" alt="Preview" />
                  
                  {/* Progress Bar */}
                  {isUploading && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/75 p-3 backdrop-blur-sm transition-all z-20">
                        {/* ... (Keep existing progress bar code) ... */}
                        <div className="flex justify-between text-xs font-bold text-white mb-1">
                            <span>{uploadProgress}%</span>
                        </div>
                         <div className="w-full bg-gray-600 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                  )}

                  {/* Hover Overlay (Edit) */}
                  {!isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <p className="text-white font-bold text-sm"><i className="fa-solid fa-pen mr-2"></i>Click to Change</p>
                    </div>
                  )}

                  {/* DELETE BUTTON (New) */}
                  {!isUploading && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop click from triggering "Upload"
                        e.preventDefault();
                        onRemove();
                      }}
                      className="absolute top-2 right-2 z-30 bg-white text-red-500 w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-red-50 transition-colors"
                      title="Remove Image"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  )}
              </div>
          ) : (
              // Empty State (Keep existing)
              <div className="text-center py-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3">
                      <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
                  </div>
                  <p className="text-sm font-bold text-gray-600">Click to upload image</p>
              </div>
          )}
      </div>

      {/* Warnings & URL Input (Keep existing) */}
      {sizeWarning && (
        <div className="text-xs font-bold text-yellow-700 flex items-center gap-2 bg-yellow-100 p-2 rounded">
          <i className="fa-solid fa-triangle-exclamation"></i> {sizeWarning}
        </div>
      )}
      <div className="relative">
          <input 
            value={urlValue || ''}
            onChange={(e) => onUrlChange(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-500 outline-none focus:border-primary transition-all"
            placeholder="Or paste external URL..."
            disabled={isUploading}
          />
          <i className="fa-solid fa-link absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
      </div>
    </div>
  )
}