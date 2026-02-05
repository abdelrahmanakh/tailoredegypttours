import { createDestination } from '../actions'
import Link from 'next/link'

export default function NewDestinationPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/destinations" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:text-primary"><i className="fa-solid fa-arrow-left"></i></Link>
        <h1 className="text-2xl font-bold text-gray-800">Add Destination</h1>
      </div>

      <form action={createDestination} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name (Default Language) <span className="text-red-500">*</span></label>
          <input name="name" required placeholder="e.g. Cairo" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-primary" />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (Optional)</label>
          <input name="slug" placeholder="cairo (auto-generated if empty)" className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 font-mono text-sm" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
          <input name="imageUrl" placeholder="https://..." className="w-full border border-gray-300 rounded-lg p-3" />
        </div>

        <button className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:bg-primary-dark transition">
          Create & Translate →
        </button>
      </form>
    </div>
  )
}