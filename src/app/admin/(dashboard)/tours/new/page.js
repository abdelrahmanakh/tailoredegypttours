import { prisma } from '@/lib/prisma'
import { createBaseTour } from '../actions'

export default async function NewTourPage() {
  const destinations = await prisma.destination.findMany({ 
    include: { translations: { where: { language: { isDefault: true } } } } 
  })
  const categories = await prisma.category.findMany({ 
    include: { translations: { where: { language: { isDefault: true } } } } 
  })
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Tour</h1>
      
      <form action={createBaseTour} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="label">Tour Name (Default Language)</label>
            <input name="title" type="text" required className="input-field" placeholder="e.g. Classic Egypt" />
          </div>
          <div className="col-span-2">
            <label className="label">URL Slug</label>
            <input name="slug" type="text" className="input-field bg-gray-50 font-mono text-sm" placeholder="classic-egypt (auto-generated if empty)" />
          </div>
        </div>

        {/* Categorization */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="label">Destination</label>
            <select name="destinationId" required className="input-field">
               {destinations.map(d => (
                 <option key={d.id} value={d.id}>{d.translations[0]?.name || d.slug}</option>
               ))}
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <select name="categoryId" required className="input-field">
               {categories.map(c => (
                 <option key={c.id} value={c.id}>{c.translations[0]?.name || c.slug}</option>
               ))}
            </select>
          </div>
        </div>

        {/* Logistics */}
        <div className="grid grid-cols-3 gap-6">
           <div>
            <label className="label">Duration (Days)</label>
            <input name="durationDays" type="number" min="1" defaultValue="1" required className="input-field" />
          </div>
          <div>
            <label className="label">Max Capacity</label>
            <input name="maxCapacity" type="number" min="1" defaultValue="15" className="input-field" />
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
           <div>
            <label className="label">Adult Price ($)</label>
            <input name="priceAdult" type="number" step="0.01" required className="input-field bg-white" />
          </div>
          <div>
            <label className="label">Child Price ($)</label>
            <input name="priceChild" type="number" step="0.01" required className="input-field bg-white" />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end gap-3">
           <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition">
             Create & Continue Editing →
           </button>
        </div>
      </form>
      
      {/* Quick CSS for this form only */}
      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem; }
        .input-field { width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.75rem; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #003940; ring: 2px solid #003940; }
      `}</style>
    </div>
  )
}