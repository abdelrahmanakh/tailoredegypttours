'use client'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Modal({ isOpen, onClose, title, children, className }) {
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden' 
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div 
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200", 
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-lg text-primary">{title}</h3>
            <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
                <i className="fa-solid fa-xmark text-lg"></i>
            </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  )
}