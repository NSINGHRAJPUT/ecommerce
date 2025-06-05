"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter(); 
  const { clearCart } = useCart();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const session_id = urlParams.get("session_id");
          console.log("Session ID:", session_id);
        if (!session_id) {
          setStatus("failed");
          toast.error("No session ID found");
          return;
        }

        const response = await axios.post("/api/verify-payment", {
          sessionId: session_id,
        });

        if (response.data.success) {
          setStatus("success");
          toast.success("Payment successful!");
          // Clear the cart after successful payment
          clearCart();
        } else {
          setStatus("failed");
          toast.error("Payment verification failed.");
        }
      } catch (error) {
        setStatus("failed");
        toast.error("Payment verification failed.");
        console.error("Payment verification error:", error);
      }
    };

    verifyPayment();
  }, []);

  if (status === "verifying") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your payment...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-green-100 p-6 rounded-lg max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-green-700">Payment Successful!</h1>
          <p className="mb-6">Thank you for your purchase. Your order has been confirmed.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/orders" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              View Orders
            </Link>
            <Link href="/products" className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-red-100 p-6 rounded-lg max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-red-700">Payment Failed</h1>
        <p className="mb-6">There was an issue processing your payment. Please try again.</p>
        <Link href="/cart" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Return to Cart
        </Link>
      </div>
    </div>
  );
}
