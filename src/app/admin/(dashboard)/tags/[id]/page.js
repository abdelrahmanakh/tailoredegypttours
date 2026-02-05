import { prisma } from '@/lib/prisma'
import { saveTranslation, updateTagShared } from '../actions'
import Link from 'next/link'
import TagEditor from './TagEditor'

export default async function EditTagPage(props) {
  const params = await props.params;
  const id = params.id;
  
  const [tag, languages] = await Promise.all([
    prisma.tag.findUnique({ 
      where: { id },
      include: { translations: true }
    }),
    prisma.language.findMany({ 
      orderBy: [{ isDefault: 'desc' }, { code: 'asc' }] 
    })
  ])

  if(!tag) return <div>Not Found</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/tags" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:text-primary"><i className="fa-solid fa-arrow-left"></i></Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Tag: <span className="text-primary">{tag.slug}</span></h1>
      </div>

      <TagEditor 
        tag={tag} 
        languages={languages} 
        saveAction={saveTranslation}
        updateSharedAction={updateTagShared}
      />
    </div>
  )
}