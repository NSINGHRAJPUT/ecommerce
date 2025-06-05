"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import beauty from "../assets/categories/beauty.png";
import fragrances from "../assets/categories/fragrances.png";
import furniture from "../assets/categories/furniture.png";
import groceries from "../assets/categories/groceries.png";
import homeDecoration from "../assets/categories/home decoration.png";
import kitchenAccessories from "../assets/categories/kitchen.png";
import laptops from "../assets/categories/laptops.png";
import mensShirts from "../assets/categories/men shirts.png";
import mensShoes from "../assets/categories/men's shoes.png";
import mensWatches from "../assets/categories/men watches.png";
import mobileAccessories from "../assets/categories/mobile accessories.png";
import motorcycle from "../assets/categories/motorcycle.png";
import skinCare from "../assets/categories/skincare.png";
import smartphones from "../assets/categories/smartphones.png";
import sportsAccessories from "../assets/categories/sports accessories.png";
import sunglasses from "../assets/categories/sunglasses.png";
import tablets from "../assets/categories/tablets.png";
import tops from "../assets/categories/tops.png";
import vehicle from "../assets/categories/vehicle.png";
import womensBags from "../assets/categories/women bags.png";
import womensDresses from "../assets/categories/women dresses.png";
import womensJewellery from "../assets/categories/women jewellery.png";
import womensShoes from "../assets/categories/women shoes.png";
import womensWatches from "../assets/categories/women watches.png";

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryImage = (slug) => {
    switch (slug) {
      case "beauty":
        return beauty;
      case "fragrances":
        return fragrances;
      case "furniture":
        return furniture;
      case "groceries":
        return groceries;
      case "home-decoration":
        return homeDecoration;
      case "kitchen-accessories":
        return kitchenAccessories;
      case "laptops":
        return laptops;
      case "mens-shirts":
        return mensShirts;
      case "mens-shoes":
        return mensShoes;
      case "mens-watches":
        return mensWatches;
      case "mobile-accessories":
        return mobileAccessories;
      case "motorcycle":
        return motorcycle;
      case "skin-care":
        return skinCare;
      case "smartphones":
        return smartphones;
      case "sports-accessories":
        return sportsAccessories;
      case "sunglasses":
        return sunglasses;
      case "tablets":
        return tablets;
      case "tops":
        return tops;
      case "vehicle":
        return vehicle;
      case "womens-bags":
        return womensBags;
      case "womens-dresses":
        return womensDresses;
      case "womens-jewellery":
        return womensJewellery;
      case "womens-shoes":
        return womensShoes;
      case "womens-watches":
        return womensWatches;
      default:
        return "/assets/categories/default.png";
    }
  };

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">All Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={`/category/${category.slug}`}
            className="relative aspect-square group"
          >
            <div className="absolute inset-0">
              <Image
                src={getCategoryImage(category.slug)}
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
