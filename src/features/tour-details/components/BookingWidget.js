'use client'
import { useState } from 'react'
import DatePicker from '@/components/ui/DatePicker' // Reuse your existing one or simple logic

export default function BookingWidget({ price, priceChild, extras = [] }) {
  const [ticketCounts, setTicketCounts] = useState({ adult: 2, youth: 0, child: 0 });
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [dateWidgetOpen, setDateWidgetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Select Dates");

  const basePriceAdult = price ? price / 100 : 0; 
  const basePriceChild = priceChild ? priceChild / 100 : 0;
  const basePriceYouth = basePriceAdult * 0.8; // Example logic: Youth is 80% of adult? Or just same as adult

  const updateTicket = (type, change) => {
    const newCount = ticketCounts[type] + change;
    if (newCount >= 0) setTicketCounts({ ...ticketCounts, [type]: newCount });
  };

  const toggleExtra = (id, price) => {
      if (selectedExtras.some(e => e.id === id)) {
          setSelectedExtras(selectedExtras.filter(e => e.id !== id));
      } else {
          setSelectedExtras([...selectedExtras, { id, price }]);
      }
  };

  const calculateTotal = () => {
    // Assuming Youth price logic (adjust if your DB has specific youth price)
    let total = (ticketCounts.adult * basePriceAdult) + 
                (ticketCounts.youth * basePriceChild) + // Using child price for youth for now as fallback
                (ticketCounts.child * basePriceChild);
    
    // Add extras cost
    const extrasCost = selectedExtras.reduce((sum, ex) => sum + (ex.price / 100), 0);
    return total + extrasCost;
  };

  return (
    <div className="relatevey top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-20">
        <div className="flex items-end gap-1 mb-6">
            <span className="text-sm text-gray-500">From</span>
            <span className="text-3xl font-bold text-primary">${basePriceAdult}</span>
        </div>
        
        {/* Date Selector */}
        <div className="relative">
            <div 
                onClick={() => setDateWidgetOpen(!dateWidgetOpen)} 
                className="border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-3 cursor-pointer hover:border-primary transition group"
            >
                <div className="bg-gray-100 p-2 rounded-lg text-gray-500 group-hover:bg-emerald-50 group-hover:text-primary transition">
                    <i className="fa-regular fa-calendar"></i>
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-bold">From</div>
                    <div className="text-sm font-bold text-primary">{selectedDate}</div>
                </div>
            </div>
            
            {/* Simple Dropdown Logic for Date (Reuse DatePicker if available, or simple placeholder) */}
            {dateWidgetOpen && (
                 <div className="absolute top-full right-0 mt-2 z-50 bg-white shadow-2xl border border-gray-100 w-[300px] p-4 rounded-xl">
                     <DatePicker 
                        onClose={() => setDateWidgetOpen(false)} 
                        onApply={(d) => { setSelectedDate(d); setDateWidgetOpen(false); }} 
                     />
                 </div>
            )}
        </div>

        {/* Tickets Section */}
        <div className="mb-6 border-b border-gray-100 pb-6">
             <h4 className="font-bold text-primary mb-3">Tickets</h4>
             
             {/* Adult */}
             <div className="flex justify-between items-center mb-3">
                 <div className="text-sm text-gray-600">Adult (18+ years)</div>
                 <div className="flex items-center gap-3">
                     <button onClick={() => updateTicket('adult', -1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition">-</button>
                     <span className="font-bold text-primary">{ticketCounts.adult}</span>
                     <button onClick={() => updateTicket('adult', 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition">+</button>
                 </div>
             </div>
             
             {/* Youth (Optional) */}
             <div className="flex justify-between items-center">
                 <div className="text-sm text-gray-600">Child (6-17 years)</div>
                 <div className="flex items-center gap-3">
                     <button onClick={() => updateTicket('child', -1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition">-</button>
                     <span className="font-bold text-primary">{ticketCounts.child}</span>
                     <button onClick={() => updateTicket('child', 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition">+</button>
                 </div>
             </div>
        </div>

        {/* Extras Section */}
        {extras.length > 0 && (
            <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="font-bold text-primary mb-3">Add Extra</h4>
                {extras.map(extra => (
                    <label key={extra.id} className="flex items-center justify-between cursor-pointer mb-3 group">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center relative">
                                <input 
                                    type="checkbox" 
                                    className="w-full h-full opacity-0 absolute cursor-pointer z-10" 
                                    onChange={() => toggleExtra(extra.id, extra.price)} 
                                />
                                {selectedExtras.some(e => e.id === extra.id) && (
                                    <div className="w-3 h-3 bg-primary rounded-sm"></div>
                                )}
                            </div>
                            <span className="text-sm text-gray-600">{extra.name}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">${extra.price / 100}</span>
                    </label>
                ))}
            </div>
        )}

        <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-bold">Total:</span>
            <span className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</span>
        </div>
        
        <button className="bg-primary hover:bg-primary-dark text-white w-full py-4 rounded-xl font-bold text-lg transition shadow-lg mb-3">
            Book Now
        </button>
    </div>
  )
}