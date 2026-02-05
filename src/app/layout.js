import '@/app/globals.css'
// UPDATED IMPORTS:
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Tailored Egypt Tours',
  description: 'Welcome to Egypt',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts: Montserrat and Great Vibes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* FontAwesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        {/* Tailwind CSS (CDN Version) */}
        <script src="https://cdn.tailwindcss.com"></script>

        {/* Tailwind Custom Configuration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: '#003940',
                    'primary-dark': '#002a30',
                    secondary: '#D4A373',
                    accent: '#E9C46A',
                    'primary-light': '#E6F0F1',
                  },
                  fontFamily: {
                    sans: ['Montserrat', 'sans-serif'],
                    script: ['Great Vibes', 'cursive'],
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body className="bg-emerald-50/50" style={{ backgroundColor: '#f8fafc' }}>
        <Navbar />
        {children}
        <Footer />  
      </body>
    </html>
  )
}