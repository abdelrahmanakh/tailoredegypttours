'use client'
import { useState } from 'react'

export default function NewAdminModal({ onClose, onSave }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(formData) {
    setLoading(true)
    setError('')
    try {
      await onSave(formData)
      onClose() // Close modal on success
    } catch (e) {
      setError(e.message) // Show error from server action
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Add New Admin</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
            <input 
              name="name" 
              required 
              placeholder="e.g. Sarah Smith" 
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black outline-none transition-colors" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="sarah@tailoredegypt.com" 
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black outline-none transition-colors" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              placeholder="••••••••" 
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-black outline-none transition-colors" 
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded border border-red-100">{error}</p>}

          <div className="pt-2 flex justify-end gap-3">
             <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition"
             >
                Cancel
             </button>
             <button 
                disabled={loading} 
                className="px-6 py-2 bg-black text-white text-xs font-bold rounded-lg shadow-lg hover:bg-gray-800 disabled:opacity-50 transition"
             >
               {loading ? 'Creating...' : 'Create Admin'}
             </button>
          </div>
        </form>
      </div>
    </div>
  )
}