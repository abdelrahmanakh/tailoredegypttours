'use client'

import { useState } from 'react'

export default function Itinerary({ days = [] }) {
  return (
    <div className="relative border-l-2 border-dashed border-primary/30 ml-3 space-y-10 pb-4">
        {days.map((item, index) => (
            <div key={index} className="ml-8 relative">
                {/* Dot Indicator */}
                <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-2 z-10 ${index === 0 || index === days.length - 1 ? 'bg-primary border-white shadow-sm ring-4 ring-white' : 'bg-white border-primary'}`}></div>
                
                <h3 className="font-bold text-primary text-base mb-2">{item.title}</h3>
                {item.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                )}
            </div>
        ))}
    </div>
  )
}