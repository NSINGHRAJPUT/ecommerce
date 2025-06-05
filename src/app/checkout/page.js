"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "../context/CartContext";
import Cookies from "universal-cookie";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const cookies = new Cookies();
  const token = cookies.get("token");

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/create-checkout-session",
        {
          items: cartItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { sessionId } = response.data;
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
}
