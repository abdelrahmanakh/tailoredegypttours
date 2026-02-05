import { prisma } from '@/lib/prisma'
import { saveTranslation, updateCategoryShared } from '../actions'
import Link from 'next/link'
import CategoryEditor from './CategoryEditor'

export default async function EditCategoryPage(props) {
  const params = await props.params;
  const id = params.id;
  
  const [category, languages] = await Promise.all([
    prisma.category.findUnique({ 
      where: { id },
      include: { translations: true }
    }),
    prisma.language.findMany({ 
      orderBy: [{ isDefault: 'desc' }, { code: 'asc' }] 
    })
  ])

  if(!category) return <div>Not Found</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:text-primary"><i className="fa-solid fa-arrow-left"></i></Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Category: <span className="text-primary">{category.slug}</span></h1>
      </div>

      <CategoryEditor 
        category={category} 
        languages={languages} 
        saveAction={saveTranslation}
        updateSharedAction={updateCategoryShared}
      />
    </div>
  )
}