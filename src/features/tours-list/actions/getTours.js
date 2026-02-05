'use server'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTours(searchParams = {}) {
  // Simulate Network Delay (so you can see your loading.js!)
  await delay(800); 

  // 1. Mock Data
  let tours = [
    { 
      id: 1, 
      title: "Valley of the kings & Hateshpsut temple Half day tour", 
      location: "Luxor, Egypt", 
      price: 80, 
      rating: 4.8, 
      reviews: 243, 
      duration: "2 Days", 
      image: "https://plus.unsplash.com/premium_photo-1661963854938-e69a4e65c1e3?q=80&w=1074&auto=format&fit=crop",
      description: "Perfect for those wanting to explore Luxor with little time, tick off bucket list destinations and learn about one of the world's oldest civilisations."
    },
    { 
      id: 2, 
      title: "Great Pyramids of Giza & Sphinx Private Tour", 
      location: "Giza, Egypt", 
      price: 45, 
      rating: 5.0, 
      reviews: 500, 
      duration: "5 Hours", 
      image: "https://images.unsplash.com/photo-1574864745093-5566c5be5855?q=80&w=870&auto=format&fit=crop",
      description: "Experience the wonder of the ancient world with a private guide and comfortable transport. Visit the Sphinx and the Great Pyramids."
    },
    { 
      id: 3, 
      title: "Luxury Nile Cruise: Aswan to Luxor 4 Days", 
      location: "Aswan, Egypt", 
      price: 350, 
      rating: 4.7, 
      reviews: 120, 
      duration: "4 Days", 
      image: "https://images.unsplash.com/photo-1744733881352-b6b4789f93c5?q=80&w=1556&auto=format&fit=crop",
      description: "Sail the majestic Nile river on a 5-star cruise ship. Enjoy daily excursions to temples, gourmet dining, and evening entertainment."
    }
  ];

  // 2. Extract Params
  const maxPrice = searchParams.price ? parseInt(searchParams.price) : 1000;
  const sortOption = searchParams.sort || 'Featured';

  // 3. Filter Logic
  let filtered = tours.filter(tour => tour.price <= maxPrice);

  // 4. Sort Logic
  if (sortOption === 'Price: Low to High') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'Price: High to Low') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'Top Rated') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}