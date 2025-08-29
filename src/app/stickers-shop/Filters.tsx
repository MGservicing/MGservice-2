"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Product } from "@/types/Product";

export default function Filters({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [goldenFilter, setGoldenFilter] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStars = starFilter === null ? true : p.stars === starFilter;
      const matchesGolden = goldenFilter ? p.isGolden === true : true;
      return matchesSearch && matchesStars && matchesGolden;
    });
  }, [products, search, starFilter, goldenFilter]);

  // 🔹 If no products yet → show skeletons
  if (!products || products.length === 0) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="mb-2 relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search any sticker by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setStarFilter(null);
            setGoldenFilter(false);
          }}
          className="w-full p-3 pl-10 rounded-full border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Gold filter */}
        <button
          onClick={() => {
            setGoldenFilter((prev) => {
              const newVal = !prev;
              if (newVal) setStarFilter(null);
              return newVal;
            });
            setSearch("");
          }}
          className={`px-4 py-1 rounded-full border text-sm font-medium flex items-center gap-1 ${
            goldenFilter
              ? "bg-yellow-400 text-white border-yellow-500"
              : "bg-gray-50 border-gray-300 text-gray-500"
          }`}
        >
          {goldenFilter && (
            <span className="ml-1 text-white text-sm font-bold">✔</span>
          )}
          Gold
        </button>

        {/* Star filters */}
        {[6, 5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => {
              setStarFilter((prev) => {
                const newVal = prev === star ? null : star;
                if (newVal !== null) setGoldenFilter(false);
                return newVal;
              });
              setSearch("");
            }}
            className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1 ${
              starFilter === star
                ? "bg-green-500 text-white border-green-600"
                : "bg-gray-50 border-gray-300 text-gray-500"
            }`}
          >
            {starFilter === star && (
              <span className="ml-1 text-white text-sm font-bold">✔</span>
            )}
            <span className="pl-[2px] text-sm">{star}</span>
            <span className="text-base">★</span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No stickers found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
