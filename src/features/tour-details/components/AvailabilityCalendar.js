'use client'
import { useState, useEffect } from 'react'
import { getTourAvailability } from '../actions/getTourAvailability'

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function AvailabilityCalendar({ tourId }) {
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the month we are viewing
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data whenever tourId or the viewed month changes
  useEffect(() => {
    const fetchAuth = async () => {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-11
      
      const res = await getTourAvailability(tourId, month, year);
      if (res.success) {
        setAvailability(res.days);
      }
      setLoading(false);
    };

    fetchAuth();
  }, [tourId, currentDate]);

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // Helper to fill empty slots at start of month (e.g. if month starts on Wednesday)
  const getEmptySlots = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    return Array(firstDay).fill(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
        {/* Header: Month Navigation */}
        <div className="flex justify-between items-center mb-6">
            <button 
                onClick={() => changeMonth(-1)} 
                className="text-primary hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full transition disabled:opacity-30"
                disabled={new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear()}
            >
                <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            <div className="flex gap-2 text-center items-center">
                <span className="font-bold text-primary text-lg">
                    {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
            </div>
            
            <button 
                onClick={() => changeMonth(1)} 
                className="text-primary hover:bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full transition"
            >
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-4 uppercase tracking-wider">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
            
            {/* Empty slots for alignment */}
            {getEmptySlots().map((_, i) => <div key={`empty-${i}`}></div>)}

            {loading ? (
                 // Simple Loading Skeleton for dates
                 [...Array(30)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-50 rounded animate-pulse"></div>
                 ))
            ) : (
                availability.map((item) => {
                    // Define styles based on status
                    let styles = "bg-gray-50 text-gray-300 cursor-not-allowed"; // Default: Unavailable
                    
                    if (item.status === 'available') {
                        styles = "bg-emerald-50 text-primary font-bold hover:bg-primary hover:text-white cursor-pointer shadow-sm border border-emerald-100";
                    } else if (item.status === 'blocked') {
                        styles = "bg-red-50 text-red-300 cursor-not-allowed border border-red-50";
                    } else if (item.status === 'past') {
                        styles = "text-gray-200 cursor-default";
                    }

                    return (
                        <div 
                            key={item.day} 
                            className={`h-10 md:h-12 flex items-center justify-center rounded-lg text-sm transition-all duration-200 relative group ${styles}`}
                            title={item.status === 'blocked' ? item.reason : item.status}
                        >
                            {item.day}
                            {/* Optional: Indicator dot for available */}
                            {item.status === 'available' && (
                                <span className="absolute bottom-1 w-1 h-1 bg-emerald-400 rounded-full group-hover:bg-white"></span>
                            )}
                        </div>
                    )
                })
            )}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-6 mt-8 text-xs text-gray-500 justify-center">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-50 border border-emerald-200"></div>
                <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-50 border border-gray-200"></div>
                <span>Sold Out / Off</span>
            </div>
        </div>
    </div>
  )
}