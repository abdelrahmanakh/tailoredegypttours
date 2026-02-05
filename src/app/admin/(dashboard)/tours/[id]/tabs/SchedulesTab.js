'use client'
import { useState, useTransition } from 'react'
import { upsertTourSchedule, deleteTourSchedule } from '../../actions'
import ScheduleRuleModal from './schedules/ScheduleRuleModal'
import CalendarManager from './schedules/CalendarManager'

export default function SchedulesTab({ tour }) {
  const [isPending, startTransition] = useTransition()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState(null)

  const schedules = tour.schedules || []

  async function handleSaveRule(formData) {
    formData.append('tourId', tour.id)
    startTransition(async () => {
       await upsertTourSchedule(formData)
       setIsModalOpen(false)
       setEditingRule(null)
    })
  }

  async function handleDelete(id) {
    if(confirm("Delete this rule? Dates may become unavailable.")) {
        startTransition(() => deleteTourSchedule(id))
    }
  }

  return (
    <div className="space-y-8 pb-20">
      
      {/* SECTION 1: RULES MANAGER */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
               <h3 className="font-bold text-gray-800">Availability Rules</h3>
               <p className="text-xs text-gray-500">Define the general patterns for when this tour runs.</p>
            </div>
            <button 
              onClick={() => { setEditingRule(null); setIsModalOpen(true) }}
              className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
            >
               <i className="fa-solid fa-plus"></i> Add Rule
            </button>
         </div>

         <div className="p-6 bg-gray-100/50 min-h-[150px]">
            {schedules.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                   <i className="fa-regular fa-calendar-xmark text-4xl mb-3 text-gray-300"></i>
                   <p className="text-sm font-bold text-gray-400">No availability rules yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {schedules.map(rule => (
                      <RuleCard 
                         key={rule.id} 
                         rule={rule} 
                         onEdit={() => { setEditingRule(rule); setIsModalOpen(true) }}
                         onDelete={() => handleDelete(rule.id)}
                      />
                   ))}
                </div>
            )}
         </div>
      </div>

    {/* SECTION 2: INTERACTIVE CALENDAR */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="font-bold text-gray-800">Availability Calendar</h3>
            <p className="text-xs text-gray-500 mt-1">
                Click any date to Block/Unblock it or change its Capacity.
                <span className="ml-3 inline-flex items-center gap-3">
                {/* Available: Emerald */}
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#059669]"></span> Available
                </span>
                {/* Override: Amber */}
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#d97706]"></span> Override
                </span>
                {/* Blocked: Gray */}
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#9ca3af]"></span> Blocked
                </span>
                </span>
            </p>
        </div>

        <div className="p-8 bg-gray-50/30">
            <CalendarManager tour={tour} />
        </div>
    </div>

      {/* MODAL */}
      {isModalOpen && (
        <ScheduleRuleModal 
           initialData={editingRule}
           onClose={() => { setIsModalOpen(false); setEditingRule(null) }}
           onSave={handleSaveRule}
        />
      )}

    </div>
  )
}

function RuleCard({ rule, onEdit, onDelete }) {
    const isWeekly = rule.type === 'WEEKLY'
    
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start group hover:border-primary/30 transition-all">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                        ${rule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}
                    `}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {isWeekly ? 'Weekly Pattern' : 'Specific Dates'}
                    </span>
                </div>
                
                <h4 className="text-sm font-bold text-gray-800 mb-1">
                    {new Date(rule.validFrom).toLocaleDateString()} 
                    <span className="text-gray-400 mx-1">→</span> 
                    {rule.validTo ? new Date(rule.validTo).toLocaleDateString() : 'No End Date'}
                </h4>

                {isWeekly && (
                    <div className="flex gap-1 mt-3">
                        {['S','M','T','W','T','F','S'].map((d, i) => (
                            <div key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold
                                ${rule.daysOfWeek.includes(i) 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-gray-100 text-gray-300'}
                            `}>
                                {d}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-500 transition">
                    <i className="fa-solid fa-pen text-xs"></i>
                </button>
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 transition">
                    <i className="fa-solid fa-trash text-xs"></i>
                </button>
            </div>
        </div>
    )
}