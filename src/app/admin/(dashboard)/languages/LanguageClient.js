'use client'
import { useState, useTransition } from 'react'
import { upsertLanguage, setLanguageDefault, toggleLanguageStatus, deleteLanguage } from './actions'

export default function LanguageClient({ languages }) {
  const [isPending, startTransition] = useTransition()
  
  // State for adding new language
  const [isAdding, setIsAdding] = useState(false)
  
  // Handlers
  const handleMakeDefault = (id) => {
    startTransition(async () => await setLanguageDefault(id))
  }

  const handleToggleActive = (id, currentStatus) => {
    startTransition(async () => {
        try {
            await toggleLanguageStatus(id, !currentStatus)
        } catch(e) { alert(e.message) }
    })
  }

  return (
    <div className="space-y-6">
      
      {/* 1. ADD NEW LANGUAGE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-xl font-bold text-gray-800">System Languages</h1>
                <p className="text-sm text-gray-500">Manage supported languages and translations.</p>
            </div>
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors
                    ${isAdding ? 'bg-gray-100 text-gray-600' : 'bg-black text-white hover:bg-gray-800'}
                `}
            >
                {isAdding ? 'Cancel' : '+ Add Language'}
            </button>
        </div>

        {/* EXPANDABLE FORM */}
        {isAdding && (
            <form action={async (formData) => {
                    await upsertLanguage(formData)
                    setIsAdding(false) // Close form on success
                }} 
                className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in slide-in-from-top-2"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Name</label>
                        <input 
                            name="name" 
                            required
                            placeholder="e.g. French" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Code (ISO)</label>
                        <input 
                            name="code" 
                            required
                            maxLength={2}
                            placeholder="e.g. fr" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black font-mono"
                        />
                    </div>
                    <button 
                        disabled={isPending}
                        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isPending ? 'Saving...' : 'Save Language'}
                    </button>
                </div>
            </form>
        )}
      </div>

      {/* 2. LANGUAGES TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs">
            <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4 text-center">Default</th>
                <th className="px-6 py-4 text-right">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {languages.map((lang) => (
                <tr key={lang.id} className={`hover:bg-gray-50/50 ${!lang.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
                
                {/* Active Toggle */}
                <td className="px-6 py-4">
                    <button
                    onClick={() => handleToggleActive(lang.id, lang.isActive)}
                    disabled={isPending}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none
                        ${lang.isActive ? 'bg-emerald-500' : 'bg-gray-300'}
                    `}
                    >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${lang.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                </td>

                <td className="px-6 py-4 font-bold text-gray-800">{lang.name}</td>
                <td className="px-6 py-4 font-mono text-gray-500">{lang.code}</td>

                {/* Default Selector */}
                <td className="px-6 py-4 text-center">
                    {lang.isDefault ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        <i className="fa-solid fa-star text-[10px]"></i> Default
                        </span>
                    ) : (
                        <button 
                        onClick={() => handleMakeDefault(lang.id)}
                        disabled={!lang.isActive || isPending}
                        className="text-gray-400 hover:text-blue-600 font-medium text-xs underline decoration-dotted underline-offset-4 disabled:opacity-50"
                        >
                        Make Default
                        </button>
                    )}
                </td>

                <td className="px-6 py-4 text-right">
                    {!lang.isDefault && (
                        <button 
                        onClick={() => { if(confirm('Delete?')) startTransition(() => deleteLanguage(lang.id)) }}
                        className="text-gray-400 hover:text-red-500 transition"
                        >
                        <i className="fa-solid fa-trash"></i>
                        </button>
                    )}
                </td>
                </tr>
            ))}
            {languages.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 italic">
                        No languages found. Add one above.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
    </div>
  )
}