'use client'
import Link from 'next/link'

export default function TravelArticles() {
  return (
      <section className="py-16 px-4 md:px-12 bg-white mb-12">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-primary text-3xl md:text-4xl font-bold">Travel Articles</h2>
            <Link href="/search?filter=articles" className="text-gray-500 text-sm font-semibold hover:text-primary transition">See all</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Article 1 */}
            <Link href="#" className="group cursor-pointer block">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                    <img src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Kenya Safari" />
                    <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700">Trips</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span>April 06 2023</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>By Ali Tufan</span>
                </div>
                <h3 className="text-primary font-bold text-lg group-hover:text-teal-600 transition">
                    Kenya vs Tanzania Safari: The Better African Safari Experience
                </h3>
            </Link>

            {/* Article 2 */}
            <Link href="#" className="group cursor-pointer block">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                    <img src="https://images.unsplash.com/photo-1516497084411-042e90c17be1?q=80&w=966&auto=format&fit=crop" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Serengeti" />
                    <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700">Trips</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span>April 07 2023</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>By Emily Johnson</span>
                </div>
                <h3 className="text-primary font-bold text-lg group-hover:text-teal-600 transition">
                    Exploring the Serengeti: A Wildlife Adventure
                </h3>
            </Link>

            {/* Article 3 */}
            <Link href="#" className="group cursor-pointer block">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                    <img src="https://images.unsplash.com/photo-1693804366397-53afbc49734d?q=80&w=871&auto=format&fit=crop" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" alt="Wild Safari" />
                    <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700">Trips</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span>April 08 2023</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>By Maxwell Rhodes</span>
                </div>
                <h3 className="text-primary font-bold text-lg group-hover:text-teal-600 transition">
                    Into the Wild: An Unforgettable Safari Journey
                </h3>
            </Link>
        </div>
      </section>
  )
}