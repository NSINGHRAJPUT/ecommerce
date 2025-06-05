"use client"

import { useCart } from "../context/CartContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import Cookies from "universal-cookie"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart()
    const router = useRouter()
    const cookies = new Cookies()
    const [isLoading, setIsLoading] = useState(false)

    if (!cookies.get('token')) { 
        router.replace("/login")
        return null
    }

    const totalAmount = cartItems.reduce((total:any, item:any) => total + item.price * item.quantity, 0)
    
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty')
            return
        }
        
        try {
            setIsLoading(true)
            const token = cookies.get('token')
            
            const response = await axios.post('/api/create-checkout-session', 
                { items: cartItems },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            
            if (response.data.url) {
                // Redirect to Stripe checkout
                window.location.href = response.data.url
            } else {
                throw new Error('No checkout URL returned')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            toast.error('Failed to create checkout session')
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
            {cartItems.length === 0 ? (
                <p className="text-gray-700 text-lg">
                    Your cart is empty.{" "}
                    <Link href="/products" className="text-blue-600 hover:underline font-medium">
                        Continue shopping
                    </Link>
                </p>
            ) : (
                <>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {cartItems.map((item:any) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">${item.price.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                                                className="w-20 px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => removeFromCart(item.id)} 
                                                className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-800">Total: ${totalAmount.toFixed(2)}</div>
                        <button
                            onClick={handleCheckout}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Processing..." : "Proceed to Payment"}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

