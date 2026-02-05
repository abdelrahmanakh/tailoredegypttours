'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname();
  // If we are on ANY admin page (login or dashboard), do not render the footer
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-[#FDFBF6] pt-24 pb-10 mt-12 text-primary overflow-hidden">
      {/* Footer Background Map */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <svg className="w-full h-full object-cover opacity-50" viewBox="0 0 1440 656" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_7_745)">
            <path opacity="0.05" d="M1674.84 0H-180.84C-187.764 0 -193.378 5.61362 -193.378 12.5384V642.592C-193.378 649.516 -187.764 655.13 -180.84 655.13H1674.84C1681.76 655.13 1687.38 649.516 1687.38 642.592V12.5384C1687.38 5.61362 1681.76 0 1674.84 0Z" fill="#D9A441"/>
            <mask id="mask0_7_745" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="-194" y="0" width="1882" height="656">
              <path d="M1674.84 0H-180.84C-187.764 0 -193.378 5.61362 -193.378 12.5384V642.592C-193.378 649.516 -187.764 655.13 -180.84 655.13H1674.84C1681.76 655.13 1687.38 649.516 1687.38 642.592V12.5384C1687.38 5.61362 1681.76 0 1674.84 0Z" fill="#F5F5F5"/>
            </mask>
            <g mask="url(#mask0_7_745)">
               {/* Simplified Path for brevity - functionally identical to your SVG */}
               <path d="M-193.378 13.8475C-193.378 13.8475 -144.949 20.4493 -100.501 20.9099C-55.39 21.3705 -16.9118 20.9099 38.1505 18.607C113.115 15.5363 257.738 3.10039 334.693 9.85573C411.649 16.6111 414.965 16.9181 454.107 21.217C497.891 26.1299 586.788 35.9558 696.912 35.4952C814.335 35.0347 1027.29 10.0093 1114.86 11.2375C1124.14 11.3911 1158.65 12.4657 1184.52 14.3081C1209.73 16.1505 1246.87 20.1422 1297.3 21.524C1318.52 22.1381 1352.36 23.2129 1391.5 22.9058C1401.45 22.7523 1433.3 22.2917 1471.11 20.4493C1508.93 18.607 1544.09 15.6898 1575.92 14.7687C1644.26 13.0799 1687.38 15.5363 1687.38 15.5363V-1.04492H-193.378V13.8475Z" fill="#F2F2F2"/>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_7_745">
              <rect width="1880.76" height="655.13" fill="white" transform="translate(-193.378)"/>
            </clipPath>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-xl md:text-2xl font-bold text-center md:text-left">
            <span className="text-primary">Speak to our expert at</span> 
            <span className="text-yellow-500 ml-2">+1-564-653-9991</span>
          </div>
          <div className="flex items-center gap-4 text-primary text-2xl">
            <span className="font-bold text-lg mr-2">Follow Us</span>
            <Link href="#" className="hover:text-yellow-500 transition"><i className="fa-brands fa-facebook-f"></i></Link>
            <Link href="#" className="hover:text-yellow-500 transition"><i className="fa-brands fa-instagram"></i></Link>
            <Link href="#" className="hover:text-yellow-500 transition"><i className="fa-brands fa-youtube"></i></Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <address className="not-italic text-sm text-gray-600 space-y-4 leading-relaxed">
              <p>28 Omar Afandy, Qena,<br/>Egypt.</p>
              <p><a href="mailto:info@egyptjoy.com" className="underline decoration-1 underline-offset-4 hover:text-primary transition">info@egyptjoy.com</a></p>
            </address>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="text-sm text-gray-600 space-y-4">
              <li><Link href="#" className="hover:text-primary transition">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Travel Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="text-sm text-gray-600 space-y-4">
              <li><Link href="#" className="hover:text-primary transition">Help center</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Live chat</Link></li>
              <li><Link href="#" className="hover:text-primary transition">How it works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">Subscribe to the free newsletter</p>
            <form className="relative">
              <input type="email" placeholder="Your email address" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition" />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-primary px-2 py-1">Send</button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200/50">
          <div className="text-xs text-gray-500 font-medium mb-4 md:mb-0">&copy; Copyright TERA-X 2025</div>
          <div className="flex items-center gap-4 text-2xl">
            <i className="fa-brands fa-cc-visa text-blue-900"></i>
            <i className="fa-brands fa-cc-mastercard text-red-600"></i>
            <i className="fa-brands fa-cc-paypal text-blue-600"></i>
          </div>
        </div>
      </div>
    </footer>
  )
}