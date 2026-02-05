import { prisma } from '@/lib/prisma'
import { saveTranslation, updateDestinationShared } from '../actions'
import Link from 'next/link'
import DestinationEditor from './DestinationEditor' // We'll make this client component below

export default async function EditDestinationPage(props) {
  const params = await props.params;
  const id = params.id
  
  // Fetch data
  const [destination, languages] = await Promise.all([
    prisma.destination.findUnique({ 
      where: { id },
      include: { translations: true }
    }),
    prisma.language.findMany({ 
      orderBy: [
        { isDefault: 'desc' }, // English first
        { code: 'asc' }
      ] 
    })
  ])
  if (!destination) {
    return <div>Destination not found</div>
  }
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/destinations" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:text-primary"><i className="fa-solid fa-arrow-left"></i></Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Destination: <span className="text-primary">{destination.slug}</span></h1>
      </div>

      <DestinationEditor 
        destination={destination} 
        languages={languages} 
        saveAction={saveTranslation}
        updateSharedAction={updateDestinationShared}
      />
    </div>
  )
}