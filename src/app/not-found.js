import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-script text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Oops! The page you are looking for seems to have gotten lost in the sands of time.
      </p>
      <Link 
        href="/" 
        className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition shadow-lg"
      >
        Return Home
      </Link>
    </div>
  )
}