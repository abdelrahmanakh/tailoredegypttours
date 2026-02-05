import { notFound } from "next/navigation";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTourBySlug(slug) {
  await delay(1000);

  // Mock Database
  const tours = [
    {
      slug: "grand-safari-2024",
      title: "Grand Egyptian Safari",
      description: "Experience the ultimate adventure through the deserts of Egypt...",
      price: 1200,
      images: ["/assets/egyptjoy.png", "/assets/egyptjoy2 4.png"],
      duration: "5 Days",
      maxGroupSize: 15,
      location: "Cairo",
    },
    {
        slug: "nile-cruise-luxury",
        title: "Luxury Nile Cruise",
        description: "Sail the Nile in style...",
        price: 850,
        images: ["/assets/egyptjoy2 4.png"],
        duration: "3 Days",
        maxGroupSize: 20,
        location: "Luxor",
      },
  ];

  const tour = tours.find((t) => t.slug === slug);

  if (!tour) {
    // This triggers the error.js or not-found.js automatically
    notFound(); 
  }

  return tour;
}