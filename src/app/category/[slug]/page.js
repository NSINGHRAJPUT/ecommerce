"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

export default function CategoryPage({ params }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { slug } = await params;
        const response = await axios.get(
          `https://dummyjson.com/products/category/${slug}`,
          {
            params: {
              limit: 10,
            },
          }
        );
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 capitalize">{params.slug}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product?.id}
            href={`/product/${product?.id}`}
            className="bg-white rounded-lg shadow-lg border-[1px] overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <Image
                src={product?.thumbnail}
                alt={product?.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 capitalize truncate">
                {product?.title}
              </h2>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product?.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold">
                  ${product?.price}
                </span>
                <span className="text-sm text-gray-500">
                  Rating: {product?.rating}⭐
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
