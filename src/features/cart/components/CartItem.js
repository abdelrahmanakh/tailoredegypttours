'use client'
import Link from 'next/link'

export default function CartItem({ item, onRemove }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row gap-6 group hover:shadow-md transition-shadow duration-300 relative">
        {/* Image */}
        <div className="w-full md:w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden relative">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-primary leading-tight">
                        <Link href={`/tours/${id}`} className="hover:text-teal-600 transition">{item.title}</Link>
                    </h3>
                    <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition p-1">
                        <i className="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                
                <div className="space-y-1 mb-4">
                    <div className="text-xs text-gray-500 flex items-center gap-2"><i className="fa-regular fa-calendar text-primary"></i> {item.date}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2"><i className="fa-regular fa-clock text-primary"></i> {item.time}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2"><i className="fa-solid fa-user-group text-primary"></i> {item.guests}</div>
                </div>
            </div>

            <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-2">
                <button className="text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition flex items-center gap-2">
                    <i className="fa-regular fa-pen-to-square"></i> Edit
                </button>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</div>
                </div>
            </div>
        </div>
    </div>
  )
}