"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        console.log("Fetched categories:", response.data.categories);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="my-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="mt-4 text-center">
          <Link href="/categories" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Link
            key={category._id}
            href={`/category/${category._id}`}
            className="relative aspect-square group"
          >
            <div className="absolute inset-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold capitalize">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
