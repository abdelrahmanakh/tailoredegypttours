'use client' // Error components must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service (like Sentry)
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center font-sans">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500"></i>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Something went wrong!</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        We encountered an unexpected error while loading your journey. 
        Don't worry, it's not your fault.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition shadow-lg flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-rotate-right"></i> Try again
        </button>
        
        <Link 
          href="/"
          className="bg-white text-gray-700 border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-house"></i> Go Home
        </Link>
      </div>
    </div>
  )
}