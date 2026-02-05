import Link from 'next/link'

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-primary text-white p-6 flex flex-col fixed h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="flex-1 space-y-2">
          
          <div className="text-xs font-bold text-gray-400 uppercase mt-4 mb-2">Main</div>
          <Link href="/admin" className="block p-2 hover:bg-white/10 rounded"><i className="fa-solid fa-gauge mr-2 w-5"></i> Dashboard</Link>
          <Link href="/admin/bookings" className="block p-2 hover:bg-white/10 rounded"><i className="fa-solid fa-ticket mr-2 w-5"></i> Bookings</Link>
          
          <div className="text-xs font-bold text-gray-400 uppercase mt-6 mb-2">Tours</div>
          <Link href="/admin/tours" className="block p-2 hover:bg-white/10 rounded"><i className="fa-solid fa-plane mr-2 w-5"></i> Tours</Link>
          <Link href="/admin/reviews" className="block p-2 hover:bg-white/10 rounded"><i className="fa-solid fa-comment mr-2 w-5"></i> Reviews</Link>

          <div className="text-xs font-bold text-gray-400 uppercase mt-6 mb-2">Settings</div>
          <Link href="/admin/destinations" className="block p-2 hover:bg-white/10 rounded"><i className="fa-solid fa-map-location-dot mr-2 w-5"></i> Destinations</Link>
          <Link href="/admin/categories" className="block p-2 hover:bg-white/10 rounded"><i className="fa-solid fa-layer-group mr-2 w-5"></i> Categories</Link>
          <Link href="/admin/tags" className="block p-2 hover:bg-white/10 rounded"><i className="fa-solid fa-tags mr-2 w-5"></i> Tags</Link>
          <Link href="/admin/languages" className="block p-2 hover:bg-white/10 rounded"><i className="fa-solid fa-globe mr-2 w-5"></i> Languages</Link>

        </nav>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  )
}