import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { deleteCategory, toggleCategoryStatus } from './actions'
import StatusToggle from '../../components/StatusToggle'

export default async function CategoriesList() {
  const categories = await prisma.category.findMany({
    include: { 
      _count: { select: { tours: true } },
      translations: { where: { language: { isDefault: true } } } 
    },
    orderBy: [
      { isFeatured: 'desc' }, 
      { featuredOrder: 'desc' },
      { slug: 'asc' }
    ]
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <Link 
          href="/admin/categories/new" 
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-dark transition shadow-md"
        >
          + Add New Category
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Tours</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">
                  {/* Now uses the default language fetched above */}
                  {cat.translations[0]?.name || <span className="text-red-400 italic">No Name</span>}
                </td>
                <td className="p-4 text-sm text-gray-500 font-mono">
                  {cat.slug}
                </td>
                <td className="p-4">
                  <StatusToggle 
                    id={cat.id} 
                    isActive={cat.isActive} 
                    onToggle={toggleCategoryStatus} 
                  />
                </td>
                <td className="p-4">
                  {cat.isFeatured ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm">
                      <i className="fa-solid fa-star text-[10px]"></i>
                      Priority: {cat.featuredOrder ?? 0}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs pl-2">-</span>
                  )}
                </td>
                <td className="p-4 text-sm">
                  {cat._count.tours} <span className="text-gray-400">linked</span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link href={`/admin/categories/${cat.id}`} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs font-bold">
                    Edit
                  </Link>
                  {cat._count.tours === 0 ? (
                    <form action={deleteCategory.bind(null, cat.id)}>
                      <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-xs font-bold">Delete</button>
                    </form>
                  ) : (
                    <span className="text-gray-300 px-3 py-1 text-xs font-bold cursor-not-allowed">In Use</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}