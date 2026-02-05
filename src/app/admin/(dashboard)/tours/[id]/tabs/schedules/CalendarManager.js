'use client'
import { useState, useTransition } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, isSameDay, isWithinInterval } from 'date-fns'
import 'react-day-picker/dist/style.css' // Import default styles
import { upsertTourException, deleteTourException, upsertTourCapacity, deleteTourCapacity } from '../../../actions'

export default function CalendarManager({ tour }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [isPending, startTransition] = useTransition()

  // -- 1. HELPERS: CALCULATE STATUS FOR EACH DATE --
  
  // A. Check if a date matches any Active Rule
  const getMatchingRule = (date) => {
    return tour.schedules.find(rule => {
      if (!rule.isActive) return false
      
      // Check Date Range
      const start = new Date(rule.validFrom)
      const end = rule.validTo ? new Date(rule.validTo) : new Date('2099-12-31')
      if (!isWithinInterval(date, { start, end })) return false

      // Check Pattern
      if (rule.type === 'WEEKLY') {
         return rule.daysOfWeek.includes(date.getDay())
      }
      if (rule.type === 'SPECIFIC_DATES') {
        return true
      }
      return false
    })
  }

  // B. Check for Specific Overrides
  const getException = (date) => tour.exceptions.find(e => isSameDay(new Date(e.date), date))
  const getCapacity = (date) => tour.dateCapacities.find(c => isSameDay(new Date(c.date), date))

  // -- 2. MODIFIERS (CSS CLASSES) --
  const modifiers = {
    available: (date) => getMatchingRule(date) && !getException(date),
    blocked: (date) => !!getException(date),
    capacityOverride: (date) => !!getCapacity(date),
    blockedOverride: (date) => !!getException(date) && !!getCapacity(date)
  }

  const modifiersStyles = {
    available: { 
        color: '#059669', 
        fontWeight: 'bold', 
        backgroundColor: '#e7fef7' // Light Emerald
    }, 
    capacityOverride: { 
        color: '#d97706', 
        fontWeight: 'bold', 
        backgroundColor: '#fef3e6' // Light Amber
    }, 
    blocked: { 
      color: '#9ca3af',
      backgroundColor: '#f1f2f4', // Light Gray
      fontWeight: 'bold',
      textDecoration: 'line-through', // Optional: Keeps it distinct even for colorblind users
      textDecorationThickness: '2px'
    },
    blockedOverride: {
      color: '#d97706', // Orange Text (Shows data)
      backgroundColor: '#f1f2f4', // Gray BG (Shows disabled)
      fontWeight: 'bold',
      textDecoration: 'line-through',
      textDecorationThickness: '2px'
    }
  }

  // -- 3. HANDLERS --
  async function handleBlockToggle(isBlocked) {
    if (!selectedDate) return
    const formData = new FormData()
    formData.append('tourId', tour.id)
    formData.append('date', format(selectedDate, 'yyyy-MM-dd'))
    
    startTransition(async () => {
        if (isBlocked) {
            formData.append('isBlocked', 'on')
            await upsertTourException(formData)
        } else {
            // If we are unblocking, we actually DELETE the exception record
            await deleteTourException(tour.id, format(selectedDate, 'yyyy-MM-dd'))
        }
    })
  }

  async function handleCapacitySave(cap) {
    if (!selectedDate) return
    const formData = new FormData()
    formData.append('tourId', tour.id)
    formData.append('date', format(selectedDate, 'yyyy-MM-dd'))
    
    startTransition(async () => {
        if (cap === '') {
             await deleteTourCapacity(tour.id, format(selectedDate, 'yyyy-MM-dd'))
        } else {
             formData.append('capacity', cap)
             await upsertTourCapacity(formData)
        }
    })
  }

  // -- DATA FOR SELECTED DATE POPUP --
  const selectedException = selectedDate ? getException(selectedDate) : null
  const selectedCapOverride = selectedDate ? getCapacity(selectedDate) : null
  const selectedRule = selectedDate ? getMatchingRule(selectedDate) : null
  
  // Calculate final status for the popup
  const isDateNaturallyAvailable = !!selectedRule
  const isDateBlocked = !!selectedException

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT: CALENDAR */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-center">
         <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            showOutsideDays
            fixedWeeks
            styles={{
                head_cell: { width: '60px', color: '#9ca3af' },
                cell: { width: '60px', height: '50px' },
                day: { width: '100%', height: '100%' }
            }}
         />
      </div>

      {/* RIGHT: INSPECTOR PANEL */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
         {!selectedDate ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <i className="fa-regular fa-hand-pointer text-4xl mb-3"></i>
                <p className="font-bold text-sm">Select a date to manage availability</p>
            </div>
         ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Header */}
                <div className="pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">{format(selectedDate, 'MMMM d, yyyy')}</h3>
                    <p className="text-xs font-bold uppercase mt-1">
                        Status: {' '}
                        {isDateBlocked ? <span className="text-red-500">BLOCKED (Exception)</span> :
                         isDateNaturallyAvailable ? <span className="text-emerald-500">AVAILABLE</span> :
                         <span className="text-gray-400">CLOSED (No Rule)</span>}
                    </p>
                </div>

                {/* 1. EXCEPTION CONTROL (Block/Unblock) */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Availability Exception</label>
                        {isPending && <i className="fa-solid fa-spinner fa-spin text-gray-400"></i>}
                    </div>
                    
                    <div className="flex items-center gap-3">
                         <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isDateBlocked ? 'bg-red-500' : 'bg-gray-300'}`}
                              onClick={() => handleBlockToggle(!isDateBlocked)}>
                              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${isDateBlocked ? 'translate-x-4' : ''}`}></div>
                         </div>
                         <span className="text-sm font-bold text-gray-700">
                            {isDateBlocked ? 'Date is Blocked' : 'Date follows Standard Rules'}
                         </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                        {isDateBlocked 
                           ? "Customers cannot book this date, even if a weekly rule exists." 
                           : "Availability is determined by your weekly rules."}
                    </p>
                </div>

                {/* 2. CAPACITY OVERRIDE */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Capacity Override</label>
                        {selectedCapOverride && (
                             <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Active</span>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        <input 
                            key={selectedDate ? selectedDate.toString() : 'empty'}
                            type="number" 
                            placeholder={tour.maxCapacity || "Default"}
                            defaultValue={selectedCapOverride?.capacity || ''}
                            // Using onBlur to save when user leaves field (avoids too many saves)
                            onBlur={(e) => handleCapacitySave(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                        Leave empty to use the default tour capacity ({tour.maxCapacity || 0}).
                    </p>
                </div>

                {/* Debug Info (Optional) */}
                {selectedRule && !isDateBlocked && (
                    <div className="text-[10px] text-gray-400 text-center border-t pt-4">
                        ✅ Matched Rule: "{selectedRule.type} starting {format(new Date(selectedRule.validFrom), 'MMM d')}"
                    </div>
                )}
            </div>
         )}
      </div>

    </div>
  )
}