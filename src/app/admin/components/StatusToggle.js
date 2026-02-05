'use client'
import { useState } from 'react'

export default function StatusToggle({ id, isActive, onToggle }) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      // Call the Server Action passed as a prop
      await onToggle(id, !isActive) 
    } catch (error) {
      alert(error.message) // Show the validation error (e.g., "Missing English Name")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleToggle} 
      disabled={loading}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
    >
      <span className="sr-only">Toggle Active</span>
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'} ${loading ? 'opacity-50' : ''}`}
      />
    </button>
  )
}