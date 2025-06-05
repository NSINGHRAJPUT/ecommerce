"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Cookies from "universal-cookie";
import { useCart } from "../../context/CartContext";

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  const router = useRouter();
  const { addToCart } = useCart();
  const { id } = params;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/${id}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    const token = cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
    });
    alert("Product added to cart!");
  };

  const handleBuyNow = () => {
    const token = cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
    });
    router.push("/checkout");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="grid md:grid-cols-12 gap-8 p-6">
            {/* Left Column - Images */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative h-96 border rounded-lg p-2 bg-white">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#ff9f00] text-white py-4 rounded-lg font-medium text-lg"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#fb641b] text-white py-4 rounded-lg font-medium text-lg"
                >
                  BUY NOW
                </button>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="md:col-span-7">
              <div className="space-y-4">
                <h1 className="text-xl text-gray-800">{product.title}</h1>
                <div className="flex items-center space-x-4">
                  <span className="px-2 py-1 bg-green-600 text-white rounded-md text-sm">
                    {product.rating} ★
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({product.reviews?.length} Reviews)
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-medium">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-green-600 font-medium">
                      {Math.round(product.discountPercentage)}% off
                    </span>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-lg">Available offers</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      • Bank Offer 5% Unlimited Cashback on Flipkart Axis Bank
                      Credit Card
                    </p>
                    <p>
                      • Special Price Get extra ₹3000 off (price inclusive of
                      discount)
                    </p>
                    <p>
                      • No cost EMI ₹1,999/month. Standard EMI also available
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-500">Brand</span>
                      <p>{product.brand}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Category</span>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock</span>
                      <p>{product.stock} units</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-lg">Product Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-lg">Specifications</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-500">SKU:</span> {product.sku}
                    </p>
                    <p>
                      <span className="text-gray-500">Warranty:</span>{" "}
                      {product.warrantyInformation}
                    </p>
                    <p>
                      <span className="text-gray-500">Shipping:</span>{" "}
                      {product.shippingInformation}
                    </p>
                    <p>
                      <span className="text-gray-500">Return Policy:</span>{" "}
                      {product.returnPolicy}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-medium text-lg">Ratings & Reviews</h3>
                  <div className="space-y-4">
                    {product.reviews?.map((review, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-green-600 text-white rounded-md text-sm">
                            {review.rating} ★
                          </span>
                          <span className="font-medium">
                            {review.reviewerName}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                        <p className="mt-1 text-gray-400 text-sm">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
