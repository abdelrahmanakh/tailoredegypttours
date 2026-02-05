import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import AdminTourCard from '../../components/AdminTourCard'
import { validateTourData } from './validation'

export default async function ToursPage( props ) {
  const searchParams = await props.searchParams;
  // Simple Filter Logic (Reuse similar logic to public if needed later)
  const query = searchParams?.q || '';
  
  const whereClause = query ? {
    translations: {
      some: {
        title: { contains: query, mode: 'insensitive' }
      }
    }
  } : {};

  const rawTours = await prisma.tour.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      images: true, // Need images for thumbnail
      translations: { include: { language: true } },
      destination: { include: { translations: { where: { language: { isDefault: true } } } } },
      category: { include: { translations: { where: { language: { isDefault: true } } } } },schedules: true,
      location: true,
      itinerary: true,
      audioGuides: true,
      FAQs: true
    }
  });

  const tours = JSON.parse(JSON.stringify(rawTours));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">All Tours ({tours.length})</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <form className="relative flex-1 md:w-64">
            <input 
              name="q" 
              placeholder="Search tours..." 
              defaultValue={query}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          </form>

          <Link 
            href="/admin/tours/new" 
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition flex items-center gap-2 whitespace-nowrap"
          >
            <i className="fa-solid fa-plus"></i> Create Tour
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tours.map(tour => {
            const validation = validateTourData(tour) 
            return (
              <AdminTourCard 
                  key={tour.id} 
                  tour={tour} 
                  validation={validation}
              />
            )
          })}
      </div>
    </div>
  )
}