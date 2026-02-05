import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  // Fetch counts
  const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } });
  const pendingReviews = await prisma.review.count({ where: { isVisible: false } });
  const totalTours = await prisma.tour.count();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Bookings Card */}
        <Link href="/admin/bookings" className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 hover:shadow-md transition">
          <div className="text-gray-500 text-sm font-bold uppercase">Pending Bookings</div>
          <div className="text-4xl font-bold text-gray-800 mt-2">{pendingBookings}</div>
          <div className="text-xs text-gray-400 mt-2">Needs verification</div>
        </Link>

        {/* Pending Reviews Card */}
        <Link href="/admin/reviews" className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
          <div className="text-gray-500 text-sm font-bold uppercase">New Reviews</div>
          <div className="text-4xl font-bold text-gray-800 mt-2">{pendingReviews}</div>
          <div className="text-xs text-gray-400 mt-2">Waiting for approval</div>
        </Link>

        {/* Total Tours Card */}
        <Link href="/admin/tours" className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition">
          <div className="text-gray-500 text-sm font-bold uppercase">Total Tours</div>
          <div className="text-4xl font-bold text-gray-800 mt-2">{totalTours}</div>
          <div className="text-xs text-gray-400 mt-2">Active packages</div>
        </Link>
      </div>
    </div>
  )
}