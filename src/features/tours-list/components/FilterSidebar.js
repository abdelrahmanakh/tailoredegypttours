'use client'

import { useState } from 'react'
import { useTourFilters } from '../hooks/useTourFilters' // Import the custom hook
import DatePicker from '@/components/ui/DatePicker'

export default function FilterSidebar() {
  // 1. Use the hook instead of props
  const { price, setFilter } = useTourFilters();

  // Track open sections by ID
  const [openSections, setOpenSections] = useState({
    tourType: true,
    price: true,
    duration: false,
    language: false,
    rating: false,
    specials: false
  });

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState("Select Dates");

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleDateApply = (range) => {
    setDateRange(range);
    setDatePickerOpen(false);
    // Optional: You could also push dates to the URL here if you wanted
    // setFilter('dates', range); 
  };

  // Helper to render the arrow rotation class
  const getArrowClass = (isOpen) => 
    `fa-solid fa-chevron-down text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`;

  return (
    <aside className="w-full lg:w-1/4 space-y-6">
        
        {/* Date Picker Box */}
        <div className="bg-primary text-white p-5 rounded-xl shadow-lg relative">
            <h3 className="font-semibold mb-3 text-sm">When are you traveling?</h3>
            <div 
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="relative bg-white rounded-lg overflow-hidden flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 transition"
            >
                <i className="fa-regular fa-calendar text-gray-400 mr-3"></i>
                <input 
                    type="text" 
                    value={dateRange} 
                    readOnly 
                    className="bg-transparent text-primary text-sm font-bold w-full outline-none cursor-pointer pointer-events-none" 
                />
            </div>

            {datePickerOpen && (
                <DatePicker 
                    onClose={() => setDatePickerOpen(false)} 
                    onApply={handleDateApply} 
                />
            )}
        </div>

        {/* Filters Container */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            
            {/* 1. Tour Type */}
            <div className="mb-4">
                <button 
                    className={`flex justify-between items-center w-full text-primary font-bold text-sm filter-toggle ${openSections.tourType ? 'active' : ''}`} 
                    onClick={() => toggleSection('tourType')}
                >
                    Tour Type <i className={getArrowClass(openSections.tourType)}></i>
                </button>
                <div className={`filter-content mt-4 ${openSections.tourType ? 'open' : ''}`}>
                    <div className="space-y-3">
                        {['Nature Tours', 'Adventure Tours', 'Cultural Tours', 'Food Tours', 'City Tours', 'Cruises Tours'].map((type) => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center transition group-hover:border-primary">
                                    <input type="checkbox" className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer" />
                                    <i className="fa-solid fa-check text-primary text-xs opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></i>
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-primary transition">{type}</span>
                            </label>
                        ))}
                    </div>
                    <a href="#" className="text-yellow-600 text-xs font-bold mt-3 block hover:underline">See More</a>
                </div>
            </div>

            {/* 2. Price Filter (UPDATED) */}
            <div className="border-t border-gray-100 py-4">
                <button 
                    className={`flex justify-between items-center w-full text-primary font-bold text-sm filter-toggle ${openSections.price ? 'active' : ''}`} 
                    onClick={() => toggleSection('price')}
                >
                    Filter Price <i className={getArrowClass(openSections.price)}></i>
                </button>
                <div className={`filter-content mt-4 ${openSections.price ? 'open' : ''}`}>
                    <div className="px-2">
                        <div className="text-center mb-2 font-bold text-primary text-sm">Up to ${price}</div>
                        <input 
                            type="range" 
                            min="40" 
                            max="1000" 
                            value={price} 
                            // 2. Update URL on change
                            onChange={(e) => setFilter('price', e.target.value)} 
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium"><span>$40</span><span>$1000</span></div>
                    </div>
                </div>
            </div>

            {/* 3. Duration */}
            <div className="border-t border-gray-100 py-4">
                <button 
                    className={`flex justify-between items-center w-full text-primary font-bold text-sm filter-toggle ${openSections.duration ? 'active' : ''}`} 
                    onClick={() => toggleSection('duration')}
                >
                    Duration <i className={getArrowClass(openSections.duration)}></i>
                </button>
                <div className={`filter-content mt-4 ${openSections.duration ? 'open' : ''}`}>
                    <div className="space-y-3">
                        {['1 Day', '2-4 Days', '5+ Days'].map((d) => (
                            <label key={d} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center transition group-hover:border-primary">
                                    <input type="checkbox" className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer" />
                                    <i className="fa-solid fa-check text-primary text-xs opacity-0 peer-checked:opacity-100"></i>
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-primary transition">{d}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Language */}
            <div className="border-t border-gray-100 py-4">
                <button 
                    className={`flex justify-between items-center w-full text-primary font-bold text-sm filter-toggle ${openSections.language ? 'active' : ''}`} 
                    onClick={() => toggleSection('language')}
                >
                    Language <i className={getArrowClass(openSections.language)}></i>
                </button>
                <div className={`filter-content mt-4 ${openSections.language ? 'open' : ''}`}>
                     <div className="space-y-3">
                        {['English', 'German', 'French', 'Spanish'].map((l) => (
                            <label key={l} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center transition group-hover:border-primary">
                                    <input type="checkbox" className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer" />
                                    <i className="fa-solid fa-check text-primary text-xs opacity-0 peer-checked:opacity-100"></i>
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-primary transition">{l}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. Rating */}
            <div className="border-t border-gray-100 py-4">
                <button 
                    className={`flex justify-between items-center w-full text-primary font-bold text-sm filter-toggle ${openSections.rating ? 'active' : ''}`} 
                    onClick={() => toggleSection('rating')}
                >
                    Rating <i className={getArrowClass(openSections.rating)}></i>
                </button>
                <div className={`filter-content mt-4 ${openSections.rating ? 'open' : ''}`}>
                    <div className="space-y-3">
                         {[5, 4, 3].map((star) => (
                            <label key={star} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center transition group-hover:border-primary">
                                    <input type="checkbox" className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer" />
                                    <i className="fa-solid fa-check text-primary text-xs opacity-0 peer-checked:opacity-100"></i>
                                </div>
                                <div className="flex text-yellow-500 text-xs">
                                     {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fa-solid ${i < star ? 'fa-star' : 'fa-star text-gray-300'}`}></i>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">& Up</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Specials */}
            <div className="border-t border-gray-100 pt-4">
                <button 
                    className={`flex justify-between items-center w-full text-primary font-bold text-sm filter-toggle ${openSections.specials ? 'active' : ''}`} 
                    onClick={() => toggleSection('specials')}
                >
                    Specials <i className={getArrowClass(openSections.specials)}></i>
                </button>
                <div className={`filter-content mt-4 ${openSections.specials ? 'open' : ''}`}>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center transition group-hover:border-primary">
                                <input type="checkbox" className="peer appearance-none absolute inset-0 w-full h-full cursor-pointer" />
                                <i className="fa-solid fa-check text-primary text-xs opacity-0 peer-checked:opacity-100"></i>
                            </div>
                            <span className="text-sm text-gray-600 group-hover:text-primary transition">Free Cancellation</span>
                        </label>
                    </div>
                </div>
            </div>

        </div>
    </aside>
  )
}