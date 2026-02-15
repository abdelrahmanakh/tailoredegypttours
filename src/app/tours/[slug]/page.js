import { notFound } from 'next/navigation'
import ImageGallery from '@/features/tour-details/components/ImageGallery'
import BookingWidget from '@/features/tour-details/components/BookingWidget'
import Itinerary from '@/features/tour-details/components/Itinerary'
import FaqSection from '@/features/tour-details/components/FaqSection'
import RelatedTours from '@/features/tour-details/components/RelatedTours'
import TourReviews from '@/features/tour-details/components/TourReviews'
import TourActions from '@/features/tour-details/components/TourActions' 
import ReviewForm from '@/features/tour-details/components/ReviewForm'
import AvailabilityCalendar from '@/features/tour-details/components/AvailabilityCalendar'
import { getTourBySlug, getRelatedTours } from '@/features/tour-details/actions/getTourBySlug'

export default async function TourDetailsPage(props) {
  const params = await props.params;
  const tour = await getTourBySlug(params.slug);

  if (!tour) notFound();

  const relatedTours = await getRelatedTours(tour.id);

  return (
    <div className="bg-white min-h-screen">
      {/* Container matching HTML */}
      <div className="container mx-auto px-4 md:px-12 py-28">
        
        {/* Breadcrumbs */}
        <div className="text-xs text-gray-500 mb-4">
            <a href="/" className="hover:text-primary">Home</a> {'>'} 
            <a href="/tours" className="hover:text-primary"> Tours</a> {'>'} 
            <span className="text-primary font-medium"> {tour.location}</span>
        </div>

        {/* Title Header */}
        <div className="flex justify-between items-start mb-6">
            <div>
                <div className="flex gap-3 mb-3">
                    {tour.tags.length > 0 ? (
                            tour.tags.map((tag, index) => (
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{tag}
                                </span>
                            ))
                        ) : (
                            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">Tour</span>
                         )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 leading-tight max-w-4xl">
                    {tour.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <div className="flex text-yellow-400 text-xs">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-solid ${i < Math.round(tour.rating) ? 'fa-star' : 'fa-star text-gray-200'}`}></i>
                            ))}
                        </div>
                        <span className="font-bold text-primary">{tour.rating.toFixed(1)}</span>
                        <span>({tour.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{tour.location}</span>
                    </div>
                </div>
            </div>
            
            {/* Share & Wishlist Buttons */}
                <TourActions tour={tour} />
        </div>

        {/* Main Grid: Content Left, Booking Right */}
        <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Left Column: Content */}
            <div className="w-full lg:w-2/3">

                <ImageGallery images={tour.images} />
                
                {/* Quick Info Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-gray-200 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary text-xl">
                            <i className="fa-regular fa-clock"></i>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-1">Duration</div>
                            <div className="text-sm font-bold text-primary">{tour.duration}</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary text-xl">
                            <i className="fa-regular fa-user"></i>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-1">Group Size</div>
                            <div className="text-sm font-bold text-primary">{tour.maxPeople} people</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary text-xl">
                            <i className="fa-solid fa-user-group"></i>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-1">Ages</div>
                            <div className="text-sm font-bold text-primary">{tour.minAge}-99 yrs</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary text-xl">
                            <i className="fa-regular fa-comment-dots"></i>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 font-bold mb-1">Languages</div>
                            <div className="text-sm font-bold text-primary">{tour.languages}</div>
                        </div>
                    </div>
                </div>

                {/* Overview */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-4">Tour Overview</h2>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {tour.overview}
                    </p>
                </div>

                {/* Highlights */}
                {tour.highlights.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-primary mb-4">Tour Highlights</h2>
                        <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside marker:text-primary">
                            {tour.highlights.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Included / Excluded (Using your design grid) */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-6">What's included</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="space-y-4">
                            {tour.included.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5"></div>
                                    <span className="text-sm text-gray-600">{item}</span>
                                </div>
                            ))}
                        </div>
                         {/* Optionally show excluded in second column if desired, or mix */}
                    </div>
                </div>

                {/* Itinerary */}
                {tour.itinerary.length > 0 && (
                    <div className="mb-10">
                         <h2 className="text-2xl font-bold text-primary mb-8">Itinerary</h2>
                         <Itinerary days={tour.itinerary} />
                    </div>
                )}

                {/* Tour Map Section (Restored from HTML) */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-primary mb-6">Tour Map</h2>
                    <div className="rounded-2xl overflow-hidden shadow-lg h-96 relative border border-gray-200">
                        {/* Note: You can eventually replace this src with a dynamic Google Maps embed link from your DB */}
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.47339870626!2d-0.24168154921873135!3d51.52855824202241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c7c7eb9be3%3A0x8456e987c440f519!2sLondon%2C%20UK!5e0!3m2!1sen!2seg!4v1696683226343!5m2!1sen!2seg" width="100%" height="100%" style={{border: 0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="grayscale contrast-125 opacity-90"></iframe>
                    </div>
                </div>

                {/* 6. Availability Calendar (Dynamic) */}
                <div className="mb-10 min-h-[400px]">
                    <h2 className="text-2xl font-bold text-primary mb-6">Availability Calendar</h2>
                    <AvailabilityCalendar tourId={tour.id} />
                </div>

                {/* FAQs */}
                {tour.faqs.length > 0 && (
                    <FaqSection faqs={tour.faqs} />
                )}

                {/* Reviews */}
                <TourReviews 
                    reviews={tour.reviewsList} 
                    rating={tour.rating} 
                    reviewCount={tour.reviews}
                    ratingStats={tour.ratingStats}
                />
                
                {/* Review Form */}
                <ReviewForm tourId={tour.id} />

            </div>

            {/* Right Column: Sticky Booking Widget */}
            <div className="w-full lg:w-1/3">
                <BookingWidget 
                    price={tour.price} 
                    priceChild={tour.priceChild}
                    extras={tour.extras}
                />
            </div>

        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
             <RelatedTours tours={relatedTours} />
        )}

      </div>
    </div>
  )
}