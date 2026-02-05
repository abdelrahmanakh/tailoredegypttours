'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const pathname = usePathname();
  // Check if we are on the Home page
  const isHome = pathname === '/';
  
  if (pathname && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null;
  }
  // Handle Scroll Effect to toggle transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
        className={`fixed w-full top-0 z-50 transition-all duration-300 font-sans px-6 md:px-12 flex justify-between items-center
        ${isHome && !isScrolled 
            ? 'bg-transparent py-6' // Transparent & Taller on Home (Top)
            : 'bg-primary shadow-lg py-4' // Solid & Compact on Scroll or other pages
        }`}
    >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative transition-transform group-hover:scale-110 duration-300">
                <img src="/assets/egyptjoy.png" className="opacity-100 w-full h-full object-contain" alt="Logo Icon" />
            </div>
            <div className="leading-tight text-white">
                <h1 className="font-serif text-xl tracking-widest font-bold relative">
                    TAILORED
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full duration-500"></span>
                </h1>
                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 group-hover:text-accent transition-colors duration-300">Egypt Tours</p>
            </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-white">
            
            {/* Language Dropdown */}
            <div className="relative">
                <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 hover:text-accent transition-colors duration-300 group focus:outline-none">
                    <i className={`fa-solid fa-globe transition-transform duration-500 ${langOpen ? 'rotate-180' : ''}`}></i> 
                    <span>Language</span>
                </button>
                
                {langOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-40 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden transform origin-top transition-all duration-200 z-50">
                      <button onClick={() => setLangOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 hover:text-primary transition text-sm border-b border-gray-100 font-bold text-primary bg-emerald-50 w-full text-left">
                          <img src="https://flagcdn.com/w20/us.png" className="w-5 h-auto shadow-sm rounded-sm" alt="English" /> English
                      </button>
                      <button onClick={() => setLangOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 hover:text-primary transition text-sm border-b border-gray-100 w-full text-left">
                          <img src="https://flagcdn.com/w20/de.png" className="w-5 h-auto shadow-sm rounded-sm" alt="Deutsch" /> Deutsch
                      </button>
                  </div>
                )}
            </div>

            <Link href="/wishlist" className="flex items-center gap-2 hover:text-accent transition-colors duration-300 group">
                <i className="fa-regular fa-heart group-hover:scale-110 transition-transform duration-300"></i>
                <span>Favorite</span>
            </Link>
            
            <Link href="/cart" className="flex items-center gap-2 hover:text-accent transition-colors duration-300 group">
                <i className="fa-solid fa-cart-shopping group-hover:scale-110 transition-transform duration-300"></i>
                <span>Cart</span>
            </Link>
            
            <Link href="/signup" className="hover:text-accent transition-colors duration-300 relative group">
                Sign up
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full duration-300"></span>
            </Link>
            
            <Link href="/signin" className="bg-white text-primary px-6 py-2 rounded-full font-bold hover:bg-accent hover:text-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Log in
            </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-2xl text-white hover:text-accent transition-colors duration-300">
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-primary border-t border-white/10 md:hidden flex flex-col items-center py-6 gap-6 shadow-xl z-40 animate-in slide-in-from-top-2 duration-300">
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-accent text-lg font-medium">Favorites</Link>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-accent text-lg font-medium">Cart</Link>
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-accent text-lg font-medium">Log In</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-accent text-lg font-medium">Sign Up</Link>
            </div>
        )}
    </nav>
  )
}