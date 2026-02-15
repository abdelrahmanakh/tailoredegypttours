'use client'
import { useState, useTransition } from 'react'
import NewAdminModal from './NewAdminModal'

export default function AdminsClient({ admins, createAction, deleteAction }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id) => {
    if(confirm('Are you sure you want to remove this admin? They will lose access immediately.')) {
        startTransition(() => deleteAction(id))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Team</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-dark transition shadow-md flex items-center gap-2"
        >
          <i className="fa-solid fa-user-plus"></i> Add New Admin
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
             <tr>
               <th className="p-4">Name</th>
               <th className="p-4">Email</th>
               <th className="p-4">Joined Date</th>
               <th className="p-4 text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {admins.map(admin => (
               <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                 <td className="p-4 font-bold text-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <i className="fa-solid fa-user text-xs"></i>
                        </div>
                        {admin.name || '—'}
                    </div>
                 </td>
                 <td className="p-4 text-sm text-gray-600">{admin.email}</td>
                 <td className="p-4 text-xs text-gray-400 font-mono">
                    {new Date(admin.createdAt).toLocaleDateString()}
                 </td>
                 <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(admin.id)}
                      disabled={isPending}
                      className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1 ml-auto"
                    >
                       <i className="fa-solid fa-trash"></i> Delete
                    </button>
                 </td>
               </tr>
             ))}
             {admins.length === 0 && (
                 <tr>
                     <td colSpan="4" className="p-8 text-center text-gray-400">No admins found.</td>
                 </tr>
             )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <NewAdminModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={createAction} 
        />
      )}
    </div>
  )
}