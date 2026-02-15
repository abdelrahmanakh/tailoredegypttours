'use client'
import { useState } from 'react'
import Link from 'next/link'
// UPDATED IMPORTS:
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans flex flex-col min-h-screen pt-14">

      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-12 bg-gray-50">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full min-h-[600px]">
            
            {/* Left Side: Image/Decoration */}
            <div className="w-full md:w-1/2 relative hidden md:block">
                <img src="https://images.unsplash.com/photo-1539650116455-8efdb4f8d548?q=80&w=2000&auto=format&fit=crop" alt="Egypt Pyramids" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/40 flex flex-col justify-center items-center text-white p-12 text-center backdrop-blur-[1px]">
                    <h2 className="font-script text-6xl mb-4">Welcome Back</h2>
                    <p className="text-lg font-light tracking-wide">Continue your journey through the history of the Pharaohs.</p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                
                <div className="text-center md:text-left mb-8">
                    <h2 className="text-3xl font-bold text-primary mb-2">Login to your account</h2>
                    <p className="text-gray-500 text-sm">Discover the best of Egypt tailored just for you.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <input type="email" placeholder="name@example.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" required />
                            <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" 
                                required 
                            />
                            <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                            >
                                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary">
                            <input type="checkbox" className="accent-primary w-4 h-4 rounded" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="text-primary font-bold hover:underline">Forgot password?</a>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        Login
                    </button>

                </form>

                {/* Divider */}
                <div className="relative my-8 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <span className="relative bg-white px-4 text-xs text-gray-400 font-medium uppercase">Or login with</span>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        <span className="text-sm font-bold text-gray-600">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition">
                        <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
                        <span className="text-sm font-bold text-gray-600">Facebook</span>
                    </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-8 text-sm text-gray-600">
                    Don't have an account? 
                    <Link href="/signup" className="text-primary font-bold hover:text-accent transition ml-1">Sign up now</Link>
                </div>

            </div>
        </div>
      </main>

    </div>
  )
}