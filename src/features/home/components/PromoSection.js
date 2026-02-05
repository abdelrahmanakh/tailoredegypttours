export default function PromoSection() {
  return (
    <div className="relative">
        
        {/* Top Brush Divider (Rotated) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 -translate-y-[80%] md:-translate-y-[60%]" style={{ transform: 'rotate(180deg)' }}>
            <svg className="w-full h-24 md:h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,602.45,3.86h0S632,116.24,923,120h277Z" fill="#003940"></path>
            </svg>
        </div>

        <section className="relative bg-primary py-12 md:py-24 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 topo-pattern opacity-10 pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Text Content */}
                    <div className="text-white space-y-6 text-center lg:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Grab up to <span className="text-yellow-400">35% off</span><br className="hidden md:block"/>
                            on your favorite<br className="hidden md:block"/>
                            Destination
                        </h2>
                        <p className="text-emerald-100/80 font-light text-sm max-w-md mx-auto lg:mx-0">
                            Limited time offer, don't miss the opportunity to explore Egypt's wonders at an unbeatable price.
                        </p>
                        <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg mt-4 inline-block">
                            Book Now
                        </button>
                    </div>

                    {/* Right: Image Collage */}
                    <div className="grid grid-cols-2 gap-4 h-[400px]">
                        <div className="col-span-2 h-[220px] rounded-2xl overflow-hidden shadow-2xl relative group">
                            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" alt="Beach" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        </div>
                        <div className="h-[160px] rounded-2xl overflow-hidden shadow-2xl relative group">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1974&auto=format&fit=crop" alt="Hotel Interior" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        </div>
                        <div className="h-[160px] rounded-2xl overflow-hidden shadow-2xl relative group">
                            <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2067&auto=format&fit=crop" alt="Hiking" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                        </div>
                    </div>

                </div>
            </div>
        </section>

        {/* Bottom Brush Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[80%] md:translate-y-[60%]">
            <svg className="w-full h-24 md:h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,602.45,3.86h0S632,116.24,923,120h277Z" fill="#003940"></path>
            </svg>
        </div>
    </div>
  )
}