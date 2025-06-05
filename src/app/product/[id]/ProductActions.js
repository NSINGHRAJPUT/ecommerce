"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ProductActions({ product }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Add to cart logic here
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Add to cart logic here
    router.push("/checkout");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="font-medium">
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Number.parseInt(e.target.value)))
          }
          className="border rounded px-2 py-1 w-16 text-center"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex-1"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex-1"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
