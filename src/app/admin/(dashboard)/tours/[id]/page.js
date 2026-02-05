import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import TourEditor from './TourEditor'
import { updateTourShared, saveTourTranslation, validateTour } from '../actions'
import TourStatusButton from '../../../components/TourStatusButton'

export default async function EditTourPage(props) {
  const params = await props.params;
  const id = params.id

  // Fetch Tour + All Relations needed for dropdowns
  const [tour, destinations, categories, languages, tags] = await Promise.all([
    prisma.tour.findUnique({
      where: { id },
      include: { 
        translations: true,
        images: { 
          orderBy: { createdAt: 'desc' },
          include: { translations: true }
        },
        itinerary: { 
          orderBy: { day: 'asc' },
          include: { translations: true }
        },
        location: true,
        extras: { 
          include: { translations: true } 
        },
        FAQs: { 
          orderBy: { order: 'asc' },
          include: { translations: true } 
        },
        schedules: { orderBy: { validFrom: 'asc' } },
        exceptions: true,
        dateCapacities: true,
        tags: { select: { id: true } },
        audioGuides: true
       }
    }),
    prisma.destination.findMany({ include: { translations: { where: { language: { isDefault: true } } } } }),
    prisma.category.findMany({ include: { translations: { where: { language: { isDefault: true } } } } }),
    prisma.language.findMany({ orderBy: [{ isDefault: 'desc' }, { code: 'asc' }] }),
    prisma.tag.findMany({ where: { isActive: true }, include: { translations: true } })
  ])

  if (!tour) return <div>Tour not found</div>

  if (tour && tour.location) {
    tour.location.lat = Number(tour.location.lat);
    tour.location.lng = Number(tour.location.lng);
  }
  const validation = await validateTour(id);
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/tours" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:text-primary">
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Tour</h1>
            <div className="flex items-center gap-2 text-xs mt-1">
               <span className="font-mono text-gray-400">{tour.slug}</span>
               <span className={`px-2 py-0.5 rounded ${tour.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                 {tour.isActive ? 'LIVE' : 'DRAFT'}
               </span>
            </div>
          </div>
        </div>
        <TourStatusButton 
            tourId={tour.id} 
            isActive={tour.isActive} 
            validation={validation} 
        />
      </div>

      {/* Client Editor Shell */}
      <TourEditor 
        tour={tour}
        destinations={destinations}
        categories={categories}
        languages={languages}
        tags={tags}
        updateSharedAction={updateTourShared}
        saveTransAction={saveTourTranslation}
      />
    </div>
  )
}