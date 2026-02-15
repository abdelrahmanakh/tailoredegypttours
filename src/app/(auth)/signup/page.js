'use client'
import { useState } from 'react'
import Link from 'next/link'
// UPDATED IMPORTS:
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans flex flex-col min-h-screen pt-14">

      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-12 bg-gray-50">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse max-w-5xl w-full min-h-[650px]">
            
            {/* Right Side: Image/Decoration */}
            <div className="w-full md:w-1/2 relative hidden md:block">
                <img src="https://images.unsplash.com/photo-1560156713-332306917646?q=80&w=1966&auto=format&fit=crop" alt="Abu Simbel" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/40 flex flex-col justify-center items-center text-white p-12 text-center backdrop-blur-[1px]">
                    <h2 className="font-script text-6xl mb-4">Start Your Journey</h2>
                    <p className="text-lg font-light tracking-wide">Create an account to unlock exclusive deals and personalized itineraries.</p>
                </div>
            </div>

            {/* Left Side: Sign Up Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                
                <div className="text-center md:text-left mb-8">
                    <h2 className="text-3xl font-bold text-primary mb-2">Create an account</h2>
                    <p className="text-gray-500 text-sm">Join us and experience the wonders of Egypt.</p>
                </div>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    
                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative">
                            <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" required />
                            <i className="fa-regular fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

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
                    
                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" 
                                required 
                            />
                            <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                            >
                                <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-start gap-2 text-sm mt-2">
                        <input type="checkbox" className="accent-primary w-4 h-4 rounded mt-1" required />
                        <span className="text-gray-600 text-xs">I agree to the <a href="#" className="text-primary font-bold hover:underline">Terms & Conditions</a> and <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>.</span>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        Create Account
                    </button>

                </form>

                {/* Divider */}
                <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <span class="relative bg-white px-4 text-xs text-gray-400 font-medium uppercase">Or sign up with</span>
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

                {/* Login Link */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    Already have an account? 
                    <Link href="/signin" className="text-primary font-bold hover:text-accent transition ml-1">Log in</Link>
                </div>

            </div>
        </div>
      </main>

    </div>
  )
}