'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: 'fa-gauge', link: '#' },
    { name: 'Booking History', icon: 'fa-ticket', link: '#' },
    { name: 'My Wishlist', icon: 'fa-heart', link: '/wishlist' },
    { name: 'Settings', icon: 'fa-gear', link: '#' },
    { name: 'Log Out', icon: 'fa-right-from-bracket', link: '/signin' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-24">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
                <h3 className="font-bold text-primary text-sm">Ali Tufan</h3>
                <p className="text-xs text-gray-500">Traveler</p>
            </div>
        </div>
        
        <nav className="space-y-1">
            {menuItems.map((item) => (
                <Link 
                    key={item.name} 
                    href={item.link}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${pathname === item.link ? 'bg-emerald-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`}
                >
                    <i className={`fa-solid ${item.icon} w-5`}></i>
                    {item.name}
                </Link>
            ))}
        </nav>
    </div>
  )
}