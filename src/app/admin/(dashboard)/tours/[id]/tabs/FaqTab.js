'use client'
import { useState, useTransition, useEffect } from 'react'
import { upsertTourFaq, deleteTourFaq } from '../../actions'

export default function FaqTab({ tour, languages }) {
  const [activeLangId, setActiveLangId] = useState(languages[0]?.id)
  
  // State to track which item is open. 
  // Values: 'new' | faq.id | null
  const [expandedId, setExpandedId] = useState(null) 

  // Sort FAQs by order (if you add reordering later, this helps)
  const faqs = (tour.FAQs || []).sort((a,b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="space-y-8 pb-20">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* 1. Language Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => setActiveLangId(lang.id)}
              className={`px-6 py-4 text-xs font-bold border-b-2 transition whitespace-nowrap flex-shrink-0
                ${activeLangId === lang.id 
                  ? 'border-primary text-primary bg-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'}
              `}
            >
              {lang.name}
            </button>
          ))}
        </div>

        <div className="p-6 bg-gray-50/50 min-h-[400px]">
            <div className="max-w-4xl mx-auto space-y-4">
                
                {/* 2. List of Existing FAQs */}
                {faqs.map((faq, index) => (
                    <FaqItem 
                        key={faq.id} 
                        faq={faq} 
                        index={index}
                        tourId={tour.id} 
                        languageId={activeLangId}
                        isOpen={expandedId === faq.id}
                        onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    />
                ))}

                {/* 3. "Add New" Section */}
                {expandedId === 'new' ? (
                    // Render the Form for New Item
                    <FaqItem 
                        isNew={true}
                        tourId={tour.id}
                        languageId={activeLangId}
                        index={faqs.length}
                        isOpen={true}
                        onToggle={() => setExpandedId(null)} // Click header to cancel
                        onSuccess={() => setExpandedId(null)} // Close after save
                    />
                ) : (
                    // Render the "Add" Button
                    <button
                        onClick={() => setExpandedId('new')}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-xs uppercase hover:border-primary hover:text-primary hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i> Add New Question
                    </button>
                )}

            </div>
        </div>
      </div>
    </div>
  )
}

// -- SUB-COMPONENT: Single Accordion Item --
function FaqItem({ faq, tourId, languageId, isNew = false, index, isOpen, onToggle, onSuccess }) {
    const [isPending, startTransition] = useTransition()

    // 1. Initial Values
    // We rely on the parent to pass the correct language ID, 
    // but we must be careful to update state when language changes.
    const initialQ = isNew ? '' : (faq?.translations.find(t => t.languageId === languageId)?.question || '')
    const initialA = isNew ? '' : (faq?.translations.find(t => t.languageId === languageId)?.answer || '')

    // 2. Form State
    const [question, setQuestion] = useState(initialQ)
    const [answer, setAnswer] = useState(initialA)
    
    // 3. Saved Reference (For isDirty logic)
    const [saved, setSaved] = useState({ q: initialQ, a: initialA })

    // 4. Effect: Sync with Props (Language Change)
    useEffect(() => {
        setQuestion(initialQ)
        setAnswer(initialA)
        setSaved({ q: initialQ, a: initialA })
    }, [initialQ, initialA, languageId])

    const isDirty = isNew 
        ? (question || answer) 
        : (question !== saved.q || answer !== saved.a)

    const handleSave = () => {
        if(!question) return

        const formData = new FormData()
        formData.append('tourId', tourId)
        formData.append('faqId', isNew ? 'new' : faq.id)
        formData.append('languageId', languageId)
        formData.append('question', question)
        formData.append('answer', answer)
        formData.append('order', index) 

        startTransition(async () => {
            await upsertTourFaq(formData)
            if(isNew) {
                // If it was new, we might want to close the form or reset it
                setQuestion('')
                setAnswer('')
                if(onSuccess) onSuccess()
            } else {
                setSaved({ q: question, a: answer })
            }
        })
    }

    const handleDelete = (e) => {
        e.stopPropagation() // Prevent toggling accordion
        if(confirm("Delete this FAQ?")) {
            startTransition(() => deleteTourFaq(faq.id))
        }
    }

    return (
        <div className={`bg-white border rounded-xl transition-all overflow-hidden
            ${isOpen 
                ? 'border-primary ring-1 ring-primary shadow-lg' 
                : 'border-gray-200 shadow-sm hover:border-gray-300'}
        `}>
            
            {/* HEADER (Always Visible) - Click to Toggle */}
            <div 
                onClick={onToggle}
                className="flex items-center justify-between p-4 cursor-pointer select-none bg-white"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                        ${isOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}
                    `}>
                        {index + 1}
                    </div>
                    <span className={`text-sm font-bold ${!question && 'text-gray-400 italic'}`}>
                        {question || (isNew ? "New Question" : "Untitled Question")}
                    </span>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Delete Button (Visible on hover or when open) */}
                    {!isNew && (
                        <button 
                            onClick={handleDelete}
                            disabled={isPending}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
                            title="Delete Question"
                        >
                            <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                    )}
                    
                    {/* Chevron Icon */}
                    <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-300
                        ${isOpen ? 'rotate-180 text-primary' : ''}
                    `}></i>
                </div>
            </div>

            {/* EXPANDABLE BODY (Form) */}
            {isOpen && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="space-y-4">
                        {/* Question Input */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                Question
                            </label>
                            <input 
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                placeholder="e.g. Do I need a visa?"
                                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                autoFocus={isNew}
                            />
                        </div>

                        {/* Answer Textarea */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                                Answer
                            </label>
                            <textarea 
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                                rows="4"
                                placeholder="Enter the answer here..."
                                className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Save Action */}
                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={handleSave}
                                disabled={!isDirty || isPending || !question}
                                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-sm
                                    ${isDirty 
                                        ? 'bg-gray-900 text-white hover:bg-black shadow-md' 
                                        : 'bg-gray-200 text-gray-400 cursor-default'}
                                `}
                            >
                                {isNew ? 'Add Question' : (isDirty ? 'Save Changes' : 'Saved')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}