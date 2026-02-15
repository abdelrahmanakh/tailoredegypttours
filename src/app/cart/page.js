'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// UPDATED IMPORTS:
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartItem from '@/features/cart/components/CartItem'

// ... (keep initialItems array) ...
const initialItems = [
  { id: 1, title: "Valley of the Kings", image: "https://plus.unsplash.com/premium_photo-1678131188332-693a503680ae?q=80&w=870&auto=format&fit=crop", date: "Feb 15, 2025", time: "08:00 AM", guests: "2 Adults", price: 205.00 },
  { id: 2, title: "Nile Cruise", image: "https://images.unsplash.com/photo-1574864745093-5566c5be5855?q=80&w=870&auto=format&fit=crop", date: "Mar 01, 2025", time: "4 Days", guests: "2 Adults", price: 700.00 }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialItems);
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

  useEffect(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    const tax = subtotal * 0.14; 
    setTotals({ subtotal, tax, total: subtotal + 40 + tax });
  }, [cartItems]);

  const removeItem = (id) => {
    if (confirm('Remove item?')) setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    // ADDED pt-28 HERE 👇
    <div className="bg-gray-50 text-gray-800 font-sans flex flex-col min-h-screen pt-14">
      <main className="flex-grow container mx-auto px-4 md:px-12 py-10">
        <h1 className="text-3xl font-bold text-primary mb-8">Your Cart ({cartItems.length} Items)</h1>
        {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3 space-y-6">
                    {cartItems.map((item) => (
                        <CartItem key={item.id} item={item} onRemove={removeItem} />
                    ))}
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-3 mb-6 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">${totals.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Service Fee</span><span className="font-bold">$40.00</span></div>
                            <div className="flex justify-between"><span>Taxes</span><span className="font-bold">${totals.tax.toFixed(2)}</span></div>
                        </div>
                        <div className="flex justify-between text-xl font-bold mb-6 pt-4 border-t"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
                        <button className="bg-accent hover:bg-yellow-500 text-primary font-bold w-full py-4 rounded-xl">Checkout</button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center py-20">Your cart is empty. <Link href="/tours" className="text-primary underline">Go Shopping</Link></div>
        )}
      </main>
    </div>
  )
}