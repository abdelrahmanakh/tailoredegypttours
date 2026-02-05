'use client'

import { useState } from 'react'
import { useTourFilters } from '../hooks/useTourFilters'

export default function TourSortButton() {
  const { sort, setFilter } = useTourFilters()
  const [isOpen, setIsOpen] = useState(false)

  const handleSort = (option) => {
    setFilter('sort', option)
    setIsOpen(false)
  }

  const options = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated']

  return (
    <div className="relative text-sm">
      <span className="text-gray-500 mr-1">Sort by:</span>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold text-primary outline-none cursor-pointer inline-flex items-center gap-1"
      >
        <span>{sort}</span>
        <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <ul className="py-1">
            {options.map((opt) => (
              <li key={opt}>
                <button 
                  onClick={() => handleSort(opt)}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 hover:text-primary transition ${sort === opt ? 'bg-gray-50 text-primary font-bold' : 'text-gray-700 font-medium'}`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}