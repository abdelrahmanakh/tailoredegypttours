'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // For navigating to search page

export default function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [tourType, setTourType] = useState('All Tours');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = () => {
    // Redirect to search page with query parameters
    if (destination.trim()) {
      router.push(`/tours?location=${encodeURIComponent(destination)}&type=${encodeURIComponent(tourType)}`);
    } else {
      alert('Please enter a destination to search.');
    }
  };

  const tourTypes = ['All Tours', 'Adventure', 'Historical', 'Relaxation', 'Cultural', 'Cruises'];

  return (
    <header className="hero-section flex flex-col justify-center items-center relative">
        <div className="text-center z-10 select-none pointer-events-none transform -translate-y-12">
            <div className="text-white font-script text-6xl md:text-8xl lg:text-9xl relative w-full max-w-4xl mx-auto h-64">
                <span className="absolute top-0 left-4 md:left-20 transform -rotate-6">Welcome</span>
                <span className="absolute top-24 left-1/2 transform -translate-x-1/2 text-5xl md:text-7xl">To</span>
                <span className="absolute bottom-0 right-4 md:right-20 transform rotate-3">Egypt</span>
            </div>
        </div>

        {/* Search Box */}
        <div className="absolute bottom-24 md:bottom-28 w-[90%] md:w-[700px] z-20">
            <div className="bg-white rounded-3xl shadow-2xl p-2 md:p-3 flex flex-col md:flex-row items-center gap-2">
                
                {/* Destination Input */}
                <div className="flex-1 flex items-center gap-4 px-4 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="text-yellow-600 text-2xl"><i className="fa-solid fa-house-chimney"></i></div>
                    <div>
                        <label className="block text-primary font-bold text-lg leading-none">Where</label>
                        <input 
                            type="text" 
                            placeholder="Search destinations ?" 
                            className="text-xs text-gray-500 w-full outline-none placeholder-gray-400 font-medium bg-transparent"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tour Type Dropdown */}
                <div className="flex-1 flex items-center gap-4 px-4 py-3 w-full relative">
                    <div className="text-yellow-600 text-2xl"><i className="fa-solid fa-suitcase-rolling"></i></div>
                    <div className="relative w-full">
                        <label className="block text-primary font-bold text-lg leading-none mb-1">Tour Type</label>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex justify-between items-center w-full text-xs text-gray-500 font-medium bg-transparent focus:outline-none"
                        >
                            <span>{tourType}</span>
                            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-4 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                <div className="max-h-60 overflow-y-auto">
                                    {tourTypes.map((type) => (
                                        <div 
                                            key={type}
                                            onClick={() => { setTourType(type); setIsDropdownOpen(false); }}
                                            className="px-4 py-3 hover:bg-emerald-50 hover:text-primary cursor-pointer text-sm text-gray-600 transition flex items-center gap-2 border-b border-gray-50 last:border-0"
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Button */}
                <button 
                    onClick={handleSearch}
                    className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-2xl font-bold text-lg transition w-full md:w-auto shadow-lg"
                >
                    Search
                </button>
            </div>
        </div>

        {/* Wave Divider */}
        <div className="custom-shape-divider-bottom">
            <svg width="1440" height="107" viewBox="0 0 1440 107" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-36 68.6241C-36 68.6241 3.11349 52.1348 39.0124 50.9845C75.4465 49.8341 106.524 50.9845 150.995 56.7366C211.54 64.4059 328.346 95.4672 390.499 78.5944C452.652 61.7215 455.331 60.9548 486.944 50.2175C522.306 37.9464 594.104 13.4041 683.047 14.5546C777.884 15.705 949.873 78.211 1020.6 75.1432C1028.1 74.7596 1055.97 72.0755 1076.86 67.4737C1097.22 62.8722 1127.22 52.9019 1167.95 49.4505C1185.09 47.9167 1212.42 45.2323 1244.04 45.9993C1252.07 46.3827 1277.79 47.5331 1308.33 52.1349C1338.87 56.7366 1367.27 64.0226 1392.98 66.3233C1448.17 70.5415 1483 64.4059 1483 64.4059V105.821H-36V68.6241Z" fill="#f0fef8"/>
            </svg>
        </div>
    </header>
  )
}