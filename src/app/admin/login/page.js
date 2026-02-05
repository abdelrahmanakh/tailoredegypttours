'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAdminCookie } from './actions'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault() // Prevent form reload
    
    const success = await setAdminCookie(username, password)
    
    if (success) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary">Admin Access</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              placeholder="admin"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-primary transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:border-primary transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 text-sm text-center font-bold">{error}</div>}

          <button 
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white w-full py-3 rounded-lg font-bold shadow-md transition-transform hover:-translate-y-0.5"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}