"use client"

import { useState } from "react"
import { useCart } from "../context/CartContext"

export default function PhonePePayment() {
  const { cartItems, clearCart } = useCart()
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const handlePayment = async () => {
    setIsLoading(true)
    setPaymentStatus(null)
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.paymentUrl) {
        throw new Error("Payment URL not received from server")
      }

      // Redirect to PhonePe payment page
      window.location.href = data.paymentUrl

      // Note: The following lines will not execute immediately due to the redirect
      setPaymentStatus("Payment initiated")
      clearCart()
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus(`Payment failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <p className="mb-4">Total Amount: ${totalAmount.toFixed(2)}</p>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? "Processing..." : "Pay with PhonePe"}
      </button>
      {paymentStatus && (
        <p className={`mt-4 ${paymentStatus.includes("failed") ? "text-red-600" : "text-green-600"}`}>
          {paymentStatus}
        </p>
      )}
    </div>
  )
}

