"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductGrid from "./ProductGrid";

const transformProduct = (product) => ({
  id: product._id || product.id, // Use MongoDB _id
  name: product.title,
  price: product.price,
  image: product.thumbnail,
  category: product.category,
});

async function getProducts(skip = 0) {
  try {
    const response = await fetch(
      `/api/admin/add-product?limit=10&skip=${skip}`
    );
    const data = await response.json();
    return {
      products: data.products.map(transformProduct),
      hasMore: data.pagination?.hasMore || false
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], hasMore: false };
  }
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const skip = useRef(0);

  const loadMoreProducts = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await getProducts(skip.current);
      console.log("New products:", result.products);
      
      if (result.products.length === 0) {
        setHasMore(false);
      } else {
        // Prevent duplicate products by checking IDs
        setProducts((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewProducts = result.products.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewProducts];
        });
        
        setHasMore(result.hasMore);
        skip.current += result.products.length;
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    }
    setLoading(false);
  }, [loading]);

  useEffect(() => {
    loadMoreProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (hasMore) {
          loadMoreProducts();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadMoreProducts]);

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <ProductGrid products={products} />
      {loading && <div className="text-center py-4">Loading...</div>}
      {!hasMore && <div className="text-center py-4">No more products</div>}
    </section>
  );
}
