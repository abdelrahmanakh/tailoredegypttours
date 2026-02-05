'use client'
import { useState } from 'react'

export default function DatePicker({ onClose, onApply }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // Track the currently viewed month (defaults to Today)
  const [viewDate, setViewDate] = useState(new Date()); 

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Helper functions
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // Navigation Logic
  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Handle clicking a day
  const handleDateClick = (day, monthIndex, year) => {
    const clickedDate = new Date(year, monthIndex, day);

    // Reset if user clicks again after selecting a range, or start new selection
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else {
      // Complete the range
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
        setEndDate(null);
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  // Styling for selected/range days
  const getDayClass = (day, monthIndex, year) => {
    const date = new Date(year, monthIndex, day);
    const dateTs = date.getTime();
    const startTs = startDate ? startDate.getTime() : null;
    const endTs = endDate ? endDate.getTime() : null;
    
    if (startTs === dateTs) return 'bg-primary text-white rounded-l-lg';
    if (endTs === dateTs) return 'bg-primary text-white rounded-r-lg';
    if (startDate && endDate && date > startDate && date < endDate) return 'bg-emerald-50 text-primary';
    
    return 'hover:bg-gray-100 text-gray-700 rounded-lg';
  };

  const handleApply = () => {
    if (startDate && endDate) {
      const startStr = `${monthNames[startDate.getMonth()].substr(0, 3)} ${startDate.getDate()}`;
      const endStr = `${monthNames[endDate.getMonth()].substr(0, 3)} ${endDate.getDate()}`;
      onApply(`${startStr} - ${endStr}`);
    } else if (startDate) {
      const startStr = `${monthNames[startDate.getMonth()].substr(0, 3)} ${startDate.getDate()}`;
      onApply(`${startStr}`);
    }
    onClose();
  };

  // Render the grid for the current viewDate
  const renderCalendarGrid = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Empty slots for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(d, month, year)}
          className={`w-8 h-8 text-xs font-medium transition-all ${getDayClass(d, month, year)}`}
        >
          {d}
        </button>
      );
    }

    return (
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <span key={day} className="text-[10px] text-gray-400 font-bold uppercase">{day}</span>
          ))}
          {days}
        </div>
    );
  };

  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 w-[320px] p-4 animate-in fade-in zoom-in duration-200">
      
      {/* Header with Navigation Arrows */}
      <div className="flex justify-between items-center mb-4">
        <button 
            onClick={handlePrevMonth} 
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-primary transition"
        >
            <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>
        
        <span className="font-bold text-primary text-sm">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        
        <button 
            onClick={handleNextMonth} 
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-primary transition"
        >
            <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-2">
        {renderCalendarGrid()}
      </div>
      
      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
        <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-primary">
            Cancel
        </button>
        <button 
          onClick={handleApply}
          disabled={!startDate}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Date
        </button>
      </div>
    </div>
  );
}