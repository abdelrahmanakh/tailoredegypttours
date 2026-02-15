import { 
  getFeaturedTours, 
  getTourCategories, 
  getFeaturedDestinations, 
  getCustomerReviews 
} from "@/features/home/actions/getFeaturedData";

import Hero from '@/features/home/components/Hero'
import TopDeals from '@/features/home/components/TopDeals'
import PopularTours from '@/features/home/components/PopularTours'
import CustomerReviews from '@/features/home/components/CustomerReviews'

// These components remain static for now or can be updated later
import WhyChooseUs from '@/features/home/components/WhyChooseUs'
import PromoSection from '@/features/home/components/PromoSection'
import PopularThingsToDo from '@/features/home/components/PopularThingsToDo'
import TravelArticles from '@/features/home/components/TravelArticles'

export default async function Home() {
  // Parallel data fetching for performance
  const [featuredTours, categories, destinations, reviews] = await Promise.all([
    getFeaturedTours(),
    getTourCategories(),
    getFeaturedDestinations(),
    getCustomerReviews()
  ]);

  return (
    <main className="font-sans text-gray-800">
      {/* Pass categories to Hero for the dropdown */}
      <Hero categories={categories} />
      
      {/* Pass destinations to TopDeals */}
      <TopDeals destinations={destinations} />
      
      <WhyChooseUs />
      
      <PopularTours tours={featuredTours}/>
      
      <PromoSection />
      
      <PopularThingsToDo />
      
      {/* Pass reviews to CustomerReviews */}
      <CustomerReviews reviews={reviews} />
      
      {/* <TravelArticles /> */}
    </main>
  )
}