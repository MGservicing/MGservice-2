"use client";

import { useEffect, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400","500","600","700"] });

type Product = {
  id: string;
  name: string;
  set_name?: string;
  description?: string;
  image_url: string;
  price: number; // ✅ discounted price from Supabase
  stars?: number; // 1–6
  isGolden?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  // ⏳ Timer logic (resets daily at 00:00 GMT)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const gmtNow = new Date(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      );

      const midnightGMT = new Date(
        gmtNow.getFullYear(),
        gmtNow.getMonth(),
        gmtNow.getDate() + 1,
        0, 0, 0
      );

      const diff = midnightGMT.getTime() - gmtNow.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // 💲 Supabase gives discounted price → calculate original
  const discountedPrice = product.price;
  const originalPrice = discountedPrice / 0.7;

  return (
    <div className="bg-white rounded-md p-0 flex flex-col h-full">
      {/* Image */}
      <div className="w-full mb-2.5 overflow-hidden rounded-md">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full object-contain rounded-md"
        />
      </div>

      {/* Info */}
      <h3
        className={`${manrope.className} font-semibold text-gray-800 text-[16px] leading-snug`}
      >
        {product.name}
      </h3>
      {product.set_name && (
        <p
          className={`${manrope.className} text-[14px] font-medium text-gray-500`}
        >
          {product.set_name}
        </p>
      )}

      {/* Price (monospace font) */}
      <div
        className="mt-1 text-sm"
        style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
      >
        <span className="text-gray-500 line-through mr-2 text-[14px]">
          ${originalPrice.toFixed(2)}
        </span>
        <span className="text-green-600 font-medium text-[16px]">
          ${discountedPrice.toFixed(2)}
        </span>
      </div>

      {/* 🔥 Sale Timer */}
      <div
        className={`${manrope.className} mt-0 text-[14px] font-normal text-green-600`}
      >
        30% OFF – Ends in {timeLeft}
      </div>

      {/* Add to Cart */}
      <div className="mt-2">
        <AddToCartButton
          product={{
            ...product,
            price: discountedPrice, // ✅ Cart uses discounted price directly
          }}
        />
      </div>
    </div>
  );
}
