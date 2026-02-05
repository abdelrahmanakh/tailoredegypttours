export default function WhyChooseUs() {
  return (
    <section className="relative bg-primary text-white py-24">
        {/* Top Brush Divider */}
        <div className="brush-divider brush-top">
             <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,602.45,3.86h0S632,116.24,923,120h277Z" fill="#ecfdf5"></path>
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#ffffff"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#ecfdf5"></path>
            </svg>
        </div>

        <div className="container mx-auto px-4 md:px-12 relative z-10">
            <div className="flex items-center gap-3 mb-10 border-b border-teal-800 pb-4">
                <i className="fa-solid fa-star text-xl"></i>
                <h2 className="text-2xl md:text-3xl font-bold">Why Choose Egypt Joy Travel</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-y-16 text-center">
                {/* Item 1 */}
                <div className="flex flex-col items-center">
                    <div className="text-4xl mb-4 border-2 border-white/20 rounded-full p-4 w-20 h-20 flex items-center justify-center"><i className="fa-solid fa-medal"></i></div>
                    <h3 className="text-lg font-bold mb-2">Premium Service</h3>
                    <p className="text-sm text-teal-100 font-light px-4">Exceptional experiences with unmatched attention to detail</p>
                </div>
                {/* Item 2 */}
                <div className="flex flex-col items-center">
                    <div className="text-4xl mb-4 border-2 border-white/20 rounded-full p-4 w-20 h-20 flex items-center justify-center"><i className="fa-solid fa-headset"></i></div>
                    <h3 className="text-lg font-bold mb-2">Always by Your Side</h3>
                    <p className="text-sm text-teal-100 font-light px-4">Expert travel team available 24/7 to assist you</p>
                </div>
                {/* ... Add the other 4 items here ... */}
            </div>
        </div>

        {/* Bottom Brush Divider */}
        <div className="brush-divider brush-bottom">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,602.45,3.86h0S632,116.24,923,120h277Z" fill="#f8fafc"></path>
                <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#f8fafc"></path>
            </svg>
        </div>
    </section>
  )
}