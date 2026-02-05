'use client'
import { useState, useTransition } from 'react'
import { toggleTourStatus } from '../(dashboard)/tours/actions'
import { Modal } from '@/components/ui/Modal' 

export default function TourStatusButton({ tourId, isActive, validation, isCompact = false }) {
  const [isPending, startTransition] = useTransition()
  const [showSoftWarning, setShowSoftWarning] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false) 
  const { hard, soft } = validation

  const handleClick = () => {
    if (isActive) {
      executeToggle(false) // Deactivate immediately
      return
    }
    // If activating...
    if (hard.length > 0) {
        setShowErrorModal(true) 
        return; 
    }

    if (soft.length > 0) {
      setShowSoftWarning(true) // Show Modal
      return
    }
    executeToggle(true) // Go Live
  }

  const executeToggle = (newState) => {
    startTransition(async () => {
        try {
            await toggleTourStatus(tourId, newState)
            setShowSoftWarning(false)
        } catch(e) { alert(e.message) }
    })
  }

  // 2. Adjust styling based on isCompact
  const btnClasses = isCompact 
     ? "px-2 py-1 text-[10px]" // Smaller for Card
     : "px-4 py-2 text-xs";    // Standard for Edit Page

  if (isActive) return (
     <button onClick={handleClick} disabled={isPending} className={`${btnClasses} rounded-lg font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200`}>
        {isPending ? 'Saving...' : 'Live'}
     </button>
  )

  const hasHard = hard.length > 0;
  return (
    <>
        <div className="relative group">
            <button onClick={handleClick} className={`${btnClasses} rounded-lg font-bold uppercase flex items-center gap-2 border ${hasHard ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-black text-white hover:bg-gray-800'}`}>
                {isPending ? '...' : (hasHard ? <><i className="fa-solid fa-lock"></i>{isCompact ? '' : 'Not Ready'}</> : 'Publish')}
            </button>
        </div>
        
        <Modal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} title="Cannot Publish Tour">
            <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-sm text-red-800 flex items-center gap-3">
                    <i className="fa-solid fa-circle-xmark text-lg"></i>
                    <div>
                        <strong>Missing Requirements</strong>
                        <p className="text-xs mt-1">You must fix the following issues before this tour can go live.</p>
                    </div>
                </div>
                <ul className="space-y-3 pl-2">
                    {hard.map((err, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-3 items-start">
                            <i className="fa-solid fa-angle-right text-gray-400 mt-1"></i>
                            {err}
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end pt-2">
                    <button onClick={() => setShowErrorModal(false)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-sm transition">
                        Understood
                    </button>
                </div>
            </div>
        </Modal>

        {/* Existing Soft Warning Modal */}
        <Modal isOpen={showSoftWarning} onClose={() => setShowSoftWarning(false)} title="Optimization Warning">
            <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                    <strong>Wait!</strong> We noticed some missing details.
                </div>
                <ul className="space-y-2">{soft.map((w, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><i className="fa-solid fa-triangle-exclamation text-yellow-500"></i> {w}</li>)}</ul>
                <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowSoftWarning(false)} className="flex-1 py-2 border rounded-lg font-bold text-sm hover:bg-gray-50">Cancel</button>
                    <button onClick={() => executeToggle(true)} className="flex-1 py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800">Publish Anyway</button>
                </div>
            </div>
        </Modal>
    </>
  )
}