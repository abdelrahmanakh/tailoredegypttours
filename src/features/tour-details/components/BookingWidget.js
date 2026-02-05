'use client'
import { useState } from 'react'
import DatePicker from '@/components/ui/DatePicker'

export default function BookingWidget() {
  const [ticketCounts, setTicketCounts] = useState({ adult: 2, youth: 0, child: 0 });
  const [addExtra, setAddExtra] = useState(false);
  
  // Date Picker State
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Select Dates");

  const basePrices = { adult: 282, youth: 168, child: 80 };
  const extraPrice = 40;

  const updateTicket = (type, change) => {
    const newCount = ticketCounts[type] + change;
    if (newCount >= 0) setTicketCounts({ ...ticketCounts, [type]: newCount });
  };

  const calculateTotal = () => {
    let total = (ticketCounts.adult * basePrices.adult) + 
                (ticketCounts.youth * basePrices.youth) + 
                (ticketCounts.child * basePrices.child);
    if (addExtra) total += extraPrice;
    return total;
  };

  const handleDateApply = (range) => {
    setSelectedDate(range);
    setDatePickerOpen(false);
  };

  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-20">
        <div className="flex items-end gap-1 mb-6">
            <span className="text-sm text-gray-500">From</span>
            <span className="text-3xl font-bold text-primary">$1,200</span>
        </div>
        
        {/* Date Input with Picker */}
        <div className="relative mb-4">
            <div 
                onClick={() => setDatePickerOpen(!datePickerOpen)}
                className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-primary transition bg-white"
            >
                <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                    <i className="fa-regular fa-calendar"></i>
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold">From</div>
                    <div className="text-sm font-bold text-primary">{selectedDate}</div>
                </div>
            </div>

            {/* Render DatePicker if open */}
            {datePickerOpen && (
                <DatePicker 
                    onClose={() => setDatePickerOpen(false)} 
                    onApply={handleDateApply} 
                />
            )}
        </div>

        <div className="mb-6 border-b border-gray-100 pb-6">
             <h4 className="font-bold text-primary mb-3">Tickets</h4>
             {['adult', 'youth', 'child'].map(type => (
                 <div key={type} className="flex justify-between items-center mb-3">
                     <div className="text-sm text-gray-600 capitalize">{type}</div>
                     <div className="flex items-center gap-3">
                         <button 
                            onClick={() => updateTicket(type, -1)} 
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition"
                         >
                            -
                         </button>
                         <span className="font-bold text-primary">{ticketCounts[type]}</span>
                         <button 
                            onClick={() => updateTicket(type, 1)} 
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition"
                         >
                            +
                         </button>
                     </div>
                 </div>
             ))}
        </div>

        <div className="mb-6 pb-6 border-b border-gray-100">
            <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        checked={addExtra} 
                        onChange={() => setAddExtra(!addExtra)} 
                        className="w-4 h-4 accent-primary cursor-pointer" 
                    />
                    <span className="text-sm text-gray-600 group-hover:text-primary transition">Add Service</span>
                </div>
                <span className="text-sm font-bold text-primary">${extraPrice}</span>
            </label>
        </div>

        <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-bold">Total:</span>
            <span className="text-2xl font-bold text-primary">${calculateTotal()}</span>
        </div>
        
        <button className="bg-primary hover:bg-primary-dark text-white w-full py-4 rounded-xl font-bold text-lg transition shadow-lg">
            Book Now
        </button>
    </div>
  )
}