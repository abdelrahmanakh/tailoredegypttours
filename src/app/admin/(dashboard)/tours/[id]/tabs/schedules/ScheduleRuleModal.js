'use client'
import { useState } from 'react'

export default function ScheduleRuleModal({ onClose, onSave, initialData }) {
  const [type, setType] = useState(initialData?.type || 'WEEKLY')
  const [validFrom, setValidFrom] = useState(initialData?.validFrom ? new Date(initialData.validFrom).toISOString().split('T')[0] : '')
  const [validTo, setValidTo] = useState(initialData?.validTo ? new Date(initialData.validTo).toISOString().split('T')[0] : '')
  const [days, setDays] = useState(initialData?.daysOfWeek || [])
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)

  const weekDays = [
    { id: 0, label: 'Sun', full: 'Sunday' },
    { id: 1, label: 'Mon', full: 'Monday' },
    { id: 2, label: 'Tue', full: 'Tuesday' },
    { id: 3, label: 'Wed', full: 'Wednesday' },
    { id: 4, label: 'Thu', full: 'Thursday' },
    { id: 5, label: 'Fri', full: 'Friday' },
    { id: 6, label: 'Sat', full: 'Saturday' },
  ]

  const handleDayToggle = (dayId) => {
    if (days.includes(dayId)) {
      setDays(days.filter(d => d !== dayId))
    } else {
      setDays([...days, dayId])
    }
  }

  const handleSubmit = () => {
    if (!validFrom) return alert("Start date is required")
    if (type === 'WEEKLY' && days.length === 0) return alert("Select at least one day")

    const formData = new FormData()
    if (initialData?.id) formData.append('scheduleId', initialData.id)
    else formData.append('scheduleId', 'new')

    formData.append('type', type)
    formData.append('validFrom', validFrom)
    if (validTo) formData.append('validTo', validTo)
    if (isActive) formData.append('isActive', 'on')

    if (type === 'WEEKLY') {
      days.forEach(d => formData.append('daysOfWeek', d))
    }

    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">
            {initialData ? 'Edit Availability Rule' : 'New Availability Rule'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* 1. Recurrence Type */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Recurrence Pattern</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['WEEKLY', 'SPECIFIC_DATES'].map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-xs font-bold rounded-md transition-all
                    ${type === t ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  {t === 'WEEKLY' ? 'Weekly Repeating' : 'Specific Dates'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Date Range */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Valid From</label>
                <input 
                  type="date" 
                  value={validFrom}
                  onChange={e => setValidFrom(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Valid To (Optional)</label>
                <input 
                  type="date" 
                  value={validTo}
                  onChange={e => setValidTo(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                />
             </div>
          </div>

          {/* 3. Conditional Inputs (Weekly) */}
          {type === 'WEEKLY' && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
               <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Active Days</label>
               <div className="flex justify-between gap-1">
                  {weekDays.map(day => {
                    const isSelected = days.includes(day.id)
                    return (
                      <button
                        key={day.id}
                        onClick={() => handleDayToggle(day.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all
                          ${isSelected 
                            ? 'bg-primary text-white shadow-lg scale-110' 
                            : 'bg-white border border-gray-200 text-gray-400 hover:border-primary hover:text-primary'}
                        `}
                        title={day.full}
                      >
                        {day.label.charAt(0)}
                      </button>
                    )
                  })}
               </div>
               <p className="text-[10px] text-gray-400 mt-3 text-center">
                 Tour runs every {days.map(d => weekDays[d].full).join(', ')}.
               </p>
            </div>
          )}
          {/* B. SPECIFIC DATES VIEW (Add this block) */}
          {type === 'SPECIFIC_DATES' && (
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex gap-3 items-start">
               <div className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fa-solid fa-check text-sm"></i>
               </div>
               <div>
                  <h4 className="text-sm font-bold text-emerald-800">Continuous Availability</h4>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                     The tour will be listed as <strong>available every single day</strong> between the Start and End dates you selected above.
                  </p>
                  <p className="text-[10px] text-emerald-600/70 mt-2 font-medium">
                     Use this for festivals, peak seasons, or limited-time events.
                  </p>
               </div>
            </div>
          )}

          {/* 4. Active Status */}
          <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
             <input 
                type="checkbox" 
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
             />
             <div className="text-sm">
                <span className="font-bold text-gray-700 block">Rule Active</span>
                <span className="text-xs text-gray-400">Uncheck to temporarily disable this schedule logic.</span>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-200 rounded-lg transition">
             Cancel
           </button>
           <button onClick={handleSubmit} className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-lg hover:bg-primary-dark transition">
             Save Rule
           </button>
        </div>

      </div>
    </div>
  )
}