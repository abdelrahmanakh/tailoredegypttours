// UPDATED IMPORTS: Point to the new feature folder
import { getFeaturedTours } from "@/features/home/actions/getFeaturedData";
import Hero from '@/features/home/components/Hero'
import TopDeals from '@/features/home/components/TopDeals'
import WhyChooseUs from '@/features/home/components/WhyChooseUs'
import PopularTours from '@/features/home/components/PopularTours'
import PromoSection from '@/features/home/components/PromoSection'
import PopularThingsToDo from '@/features/home/components/PopularThingsToDo'
import CustomerReviews from '@/features/home/components/CustomerReviews'
import TravelArticles from '@/features/home/components/TravelArticles'

export default async function Home() {
  const featuredTours = await getFeaturedTours();
  return (
    <main className="font-sans text-gray-800">
      
      <Hero />
      
      <TopDeals />
      
      <WhyChooseUs />
      
      <PopularTours tours={featuredTours}/>
      
      <PromoSection />
      
      <PopularThingsToDo />
      
      <CustomerReviews />
      
      <TravelArticles />
      
    </main>
  )
}