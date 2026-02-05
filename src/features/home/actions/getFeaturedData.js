// Simulating a database delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getFeaturedTours() {
  await delay(1000); // Fake delay to see the Skeleton loading state!

  // In a real app, this would be: await db.tour.findMany({ where: { isFeatured: true } })
  return [
    {
      id: 1,
      slug: "grand-safari-2024",
      title: "Grand Egyptian Safari",
      image: "/assets/egyptjoy.png",
      price: 1200,
      duration: "5 Days",
      rating: 4.8,
      reviews: 124,
      location: "Cairo, Egypt",
    },
    {
      id: 2,
      slug: "nile-cruise-luxury",
      title: "Luxury Nile Cruise",
      image: "/assets/egyptjoy2 4.png",
      price: 850,
      duration: "3 Days",
      rating: 4.9,
      reviews: 89,
      location: "Luxor, Egypt",
    },
    {
      id: 3,
      slug: "pyramids-giza-special",
      title: "Pyramids of Giza Special",
      image: "/assets/Group 18.png",
      price: 150,
      duration: "1 Day",
      rating: 4.7,
      reviews: 305,
      location: "Giza, Egypt",
    },
  ];
}