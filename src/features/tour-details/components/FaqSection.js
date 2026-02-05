'use client'
import { useState } from 'react'

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);
  
  const faqs = [
    { q: "Can I get the refund?", a: "For a full refund, cancel at least 24 hours in advance." },
    { q: "Can I change the travel date?", a: "Yes, you can change the date up to 24 hours before departure." }
  ];

  return (
    <div className="mb-10">
        <h2 className="text-2xl font-bold text-primary mb-6">FAQ</h2>
        <div className="space-y-4">
            {faqs.map((faq, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-6 transition-all duration-300">
                    <button className="flex justify-between items-center w-full text-left font-bold text-primary" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                        <span>{faq.q}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${activeFaq === idx ? 'bg-primary' : 'bg-gray-300'}`}>
                            {activeFaq === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                    </button>
                    <div className={`text-sm text-primary/80 leading-relaxed overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-40 pt-3' : 'max-h-0 pt-0'}`}>
                        {faq.a}
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}