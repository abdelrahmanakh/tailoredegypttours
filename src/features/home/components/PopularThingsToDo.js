'use client'
import Link from 'next/link'

export default function PopularThingsToDo() {
  return (
      <section className="py-20 px-4 md:px-12 bg-white">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-primary text-3xl md:text-4xl font-bold">Popular things to do</h2>
            <Link href="/tours" className="text-gray-500 text-sm font-semibold hover:text-primary transition">See all</Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-[500px]">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-4 h-full">
                <Link href="/tours?filter=cruises" className="relative h-[240px] md:h-1/2 rounded-2xl overflow-hidden group cursor-pointer block">
                    <img src="https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2000&auto=format&fit=crop" alt="Cruises" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <span className="absolute bottom-4 left-4 text-white font-medium">Cruises</span>
                </Link>
                <Link href="/tours?filter=museum" className="relative h-[240px] md:h-1/2 rounded-2xl overflow-hidden group cursor-pointer block">
                    <img src="https://images.unsplash.com/photo-1736283296672-2e52db3a3a54?q=80&w=872&auto=format&fit=crop" alt="Museum Tour" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <span className="absolute bottom-4 left-4 text-white font-medium">Museum Tour</span>
                </Link>
            </div>

            {/* Column 2 (Tall Item) */}
            <Link href="/tours?filter=beach" className="relative h-[400px] md:h-full rounded-2xl overflow-hidden group cursor-pointer block">
                <img src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1974&auto=format&fit=crop" alt="Beach Tours" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <span className="absolute bottom-6 left-6 text-white text-xl font-medium">Beach Tours</span>
            </Link>

            {/* Column 3 */}
            <div className="flex flex-col gap-4 h-full">
                <Link href="/tours?filter=city" className="relative h-[240px] md:h-1/2 rounded-2xl overflow-hidden group cursor-pointer block">
                    <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop" alt="City Tours" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <span className="absolute bottom-4 left-4 text-white font-medium">City Tours</span>
                </Link>
                
                <div className="flex gap-4 h-[240px] md:h-1/2">
                    <Link href="/tours" className="relative w-1/2 rounded-2xl overflow-hidden group cursor-pointer block">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1974&auto=format&fit=crop" alt="Tours" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <span className="absolute bottom-4 left-4 text-white font-medium">Tours</span>
                    </Link>
                    <Link href="/tours?filter=hiking" className="relative w-1/2 rounded-2xl overflow-hidden group cursor-pointer block">
                        <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2067&auto=format&fit=crop" alt="Hiking" className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <span className="absolute bottom-4 left-4 text-white font-medium">Hiking</span>
                    </Link>
                </div>
            </div>
        </div>
      </section>
  )
}