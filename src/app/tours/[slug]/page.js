'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// UPDATED IMPORTS:
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ImageGallery from '@/features/tour-details/components/ImageGallery'
import BookingWidget from '@/features/tour-details/components/BookingWidget'
import FaqSection from '@/features/tour-details/components/FaqSection'
import ReviewForm from '@/features/tour-details/components/ReviewForm'
import RelatedTours from '@/features/tour-details/components/RelatedTours'
import TourReviews from '@/features/tour-details/components/TourReviews'


export default function TourDetailsPage() {
  // 2. Get the slug from the URL
  const params = useParams();
  const slug = params.slug;

  // (In the future, you will use this 'slug' to fetch data from a database)
  // console.log("Current Tour ID:", slug);

  
  return (
    <div className="bg-gray-50 text-gray-800 font-sans">

      <div className="container mx-auto px-4 md:px-12 py-8">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link> &gt; 
            <Link href="/tours" className="hover:text-primary mx-1">Tours</Link> &gt; 
            <span className="text-primary font-medium ml-1">Phuket</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
                <div className="flex gap-3 mb-3">
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">Bestseller</span>
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">Free cancellation</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 leading-tight max-w-4xl">
                    Phi Phi Islands Adventure Day Trip with Seaview Lunch by V. Marine Tour
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400 text-xs">
                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                        </div>
                        <span className="font-bold text-primary">4.8</span>
                        <span>(269)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>Phuket, Thailand</span>
                    </div>
                    <div>30K+ booked</div>
                </div>
            </div>
            
            <div className="flex gap-4">
                <button className="flex items-center gap-2 text-primary font-bold hover:bg-gray-100 px-4 py-2 rounded-full transition">
                    <i className="fa-solid fa-share-nodes"></i> Share
                </button>
                <button className="flex items-center gap-2 text-primary font-bold hover:bg-gray-100 px-4 py-2 rounded-full transition group">
                    <i className="fa-regular fa-heart group-hover:hidden"></i>
                    <i className="fa-solid fa-heart text-red-600 hidden group-hover:block"></i>
                    Wishlist
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Content */}
            <div className="w-full lg:w-2/3">

                <ImageGallery />
                
                {/* Quick Info Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-gray-200 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary text-xl"><i className="fa-regular fa-clock"></i></div>
                        <div><div className="text-xs text-gray-500 font-bold mb-1">Duration</div><div className="text-sm font-bold text-primary">3 days</div></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary text-xl"><i className="fa-regular fa-user"></i></div>
                        <div><div className="text-xs text-gray-500 font-bold mb-1">Group Size</div><div className="text-sm font-bold text-primary">10 people</div></div>
                    </div>
                     <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary text-xl"><i className="fa-solid fa-user-group"></i></div>
                        <div><div className="text-xs text-gray-500 font-bold mb-1">Ages</div><div className="text-sm font-bold text-primary">18-99 yrs</div></div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary text-xl"><i className="fa-regular fa-comment-dots"></i></div>
                        <div><div className="text-xs text-gray-500 font-bold mb-1">Languages</div><div className="text-sm font-bold text-primary">English, Japanese</div></div>
                    </div>
                </div>

                {/* Overview */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">Tour Overview</h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        The Phi Phi archipelago is a must-visit while in Phuket, and this speedboat trip whisks you around the islands in one day. Swim over the coral reefs of Pileh Lagoon, have lunch at Phi Phi Leh, snorkel at Bamboo Island, and visit Monkey Beach and Maya Bay, immortalized in "The Beach." Boat transfers, snacks, buffet lunch, snorkeling equipment, and Phuket hotel pickup and drop-off all included.
                    </p>
                </div>

                {/* Tour Highlights */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">Tour Highlights</h2>
                    <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside marker:text-primary">
                        <li>Experience the thrill of a speedboat to the stunning Phi Phi Islands</li>
                        <li>Be amazed by the variety of marine life in the archepelago</li>
                        <li>Enjoy relaxing in paradise with white sand beaches and azure turquoise water</li>
                        <li>Feel the comfort of a tour limited to 35 passengers</li>
                        <li>Catch a glimpse of the wild monkeys around Monkey Beach</li>
                    </ul>
                </div>

                {/* What's Included */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-6">What's included</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3"><div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div><span class="text-sm text-gray-600">Beverages, drinking water, morning tea and buffet lunch</span></div>
                            <div className="flex items-start gap-3"><div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div><span class="text-sm text-gray-600">Local taxes</span></div>
                            <div className="flex items-start gap-3"><div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div><span class="text-sm text-gray-600">Hotel pickup and drop-off</span></div>
                            <div className="flex items-start gap-3"><div class="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div><span class="text-sm text-gray-600">Insurance</span></div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3"><div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div><span class="text-sm text-gray-600">Towel</span></div>
                            <div className="flex items-start gap-3"><div class="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div><span class="text-sm text-gray-600">Tips</span></div>
                             <div className="flex items-start gap-3"><div class="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div><span class="text-sm text-gray-600">Alcoholic Beverages</span></div>
                        </div>
                    </div>
                </div>

                {/* Itinerary Section */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-8">Itinerary</h2>
                    <div className="relative border-l-2 border-dashed border-primary/30 ml-3 space-y-10 pb-4">
                        <div className="ml-8 relative">
                            <div className="absolute -left-[41px] top-0 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-sm z-10"></div>
                            <h3 className="font-bold text-primary text-base mb-2">Day 1: Airport Pick Up</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">Like on all of our trips, we can collect you from the airport when you land and take you directly to your hotel. The first Day is just a check-in Day.</p>
                        </div>
                        <div className="ml-8 relative">
                            <div className="absolute -left-[41px] top-0 w-6 h-6 bg-white border-2 border-primary rounded-full z-10"></div>
                            <h3 className="font-bold text-primary text-base">Day 2: Temples & River Cruise</h3>
                        </div>
                         <div className="ml-8 relative">
                            <div className="absolute -left-[41px] top-0 w-6 h-6 bg-white border-2 border-primary rounded-full z-10"></div>
                            <h3 className="font-bold text-primary text-base">Day 3: Massage & Overnight Train</h3>
                        </div>
                         <div class="ml-8 relative">
                             <div class="absolute -left-[41px] top-0 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-sm z-10"></div>
                            <h3 class="font-bold text-primary text-base">Day 7: Island Boat Trip</h3>
                        </div>
                    </div>
                </div>

                {/* Tour Map */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-6">Tour Map</h2>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-96 relative border border-gray-200 bg-gray-100">
                        {/* Placeholder for map iframe */}
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.18237072596!2d-0.10159865000000001!3d51.52864165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2seg!4v1689623863481!5m2!1sen!2seg" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(100%) contrast(1.2)' }} allowFullScreen="" loading="lazy"></iframe>
                    </div>
                </div>

                <FaqSection />

                <TourReviews />

                <ReviewForm />

            </div>

            {/* Right Column: Booking Widget */}
            <div className="w-full lg:w-1/3">
                <BookingWidget />
            </div>

        </div> 
        
        {/* Bottom Slider */}
        <RelatedTours />

      </div>

    </div>
  )
}