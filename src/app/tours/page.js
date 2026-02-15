// src/app/tours/page.js (No changes needed, but double check)
import Link from 'next/link'
import FilterSidebar from '@/features/tours-list/components/FilterSidebar'
import SearchCard from '@/features/tours-list/components/SearchCard'
import TourSortButton from '@/features/tours-list/components/TourSortButton'
import { getTours } from '@/features/tours-list/actions/getTours'

export default async function ToursPage(props) {
  const searchParams = await props.searchParams;
  const filteredTours = await getTours(searchParams); // This now calls the DB version
  
  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen pt-14">
      <div className="container mx-auto px-auto md: px-auto py-8">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
            <div className="text-xs text-gray-500 mb-2">
                <Link href="/" className="hover:text-primary">Home</Link> &gt; <span className="text-primary font-medium ml-1">Search</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Explore all things to do</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar (Client Component) */}
            <FilterSidebar />
            
            <main className="w-full lg:w-3/4">
                 <div className="flex justify-between items-center mb-6 relative z-30">
                    <span className="text-xs text-gray-500 font-bold hidden md:block">
                        Showing {filteredTours.length} results
                    </span>
                    
                    {/* Sort Button (Client Component) */}
                    <TourSortButton />
                </div>

                {/* Results List */}
                <div className="space-y-6">
                    {filteredTours.length > 0 ? (
                        filteredTours.map((tour) => (
                            <div key={tour.id} className="flex-shrink-0 snap-start">
                            <SearchCard key={tour.id} {...tour} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-gray-400">No tours found</h3>
                            <p className="text-sm text-gray-300">Try adjusting your filters or search criteria.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
      </div>
    </div>
  )
}