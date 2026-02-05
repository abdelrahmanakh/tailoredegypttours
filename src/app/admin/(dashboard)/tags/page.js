import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { deleteTag, toggleTagStatus } from './actions'
import StatusToggle from '../../components/StatusToggle'

export default async function TagsList() {
  const tags = await prisma.tag.findMany({
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
        <h1 className="text-2xl font-bold text-gray-800">Tags</h1>
        <Link 
          href="/admin/tags/new" 
          className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-dark transition shadow-md"
        >
          + Add New Tag
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
            {tags.map(tag => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">
                  {tag.translations[0]?.name || '-'}
                </td>
                <td className="p-4 text-sm text-gray-500 font-mono">
                  {tag.slug}
                </td>
                <td className="p-4">
                  <StatusToggle 
                    id={tag.id} 
                    isActive={tag.isActive} 
                    onToggle={toggleTagStatus} 
                  />
                </td>
                <td className="p-4">
                  {tag.isFeatured ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm">
                      <i className="fa-solid fa-star text-[10px]"></i>
                      Priority: {tag.featuredOrder ?? 0}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs pl-2">-</span>
                  )}
                </td>
                <td className="p-4 text-sm">
                  {tag._count.tours} <span className="text-gray-400">linked</span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link href={`/admin/tags/${tag.id}`} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs font-bold">
                    Edit
                  </Link>
                  {tag._count.tours === 0 ? (
                    <form action={deleteTag.bind(null, tag.id)}>
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