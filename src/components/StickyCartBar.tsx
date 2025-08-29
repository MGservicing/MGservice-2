"use client";

import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react"; 
import { Manrope } from "next/font/google";
import { useState } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type StickyCartBarProps = {
  product: {
    id: string;
    name: string;
    price: number;           // final discounted price
    originalPrice?: number;  // ✅ added original price
    type?: "boost";
  } | null;
  cartItem: any;
  quantity: number;
  totalPrice: number;
  handleAddToCart: () => void;
  bonus?: { bonus_token: string; bonus_amount: number } | null;
};

export default function StickyCartBar({
  product,
  cartItem,
  quantity,
  totalPrice,
  handleAddToCart,
  bonus,
}: StickyCartBarProps) {
  const [showTick, setShowTick] = useState(false);

  const handleEdit = () => {
    if (!product) return;
    handleAddToCart();
    setShowTick(true);
    setTimeout(() => setShowTick(false), 1200);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg">
      <div className="max-w-[1024px] mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-4">
        
        {/* Left side: Product name + Bonus */}
        <div className="text-center sm:text-left mb-1 sm:mb-0">
          <h3 className="text-lg font-semibold leading-tight">
            {product ? product.name : "Choose Boost"}
          </h3>
          {bonus && (
            <p className="text-sm text-gray-600 mt-1 sm:mt-0">
              Bonus:{" "}
              <span className="font-semibold text-indigo-600">
                {bonus.bonus_amount} {bonus.bonus_token}
              </span>
            </p>
          )}
        </div>

        {/* Right side: Total + Buttons */}
        <div className="flex flex-col w-[200px]">
          <p className="text-gray-600 mb-1 text-center sm:text-left">
            Total:{" "}
            {product?.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="line-through mr-1 text-gray-400">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="font-mono font-bold text-green-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-mono font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            )}
          </p>

          {!cartItem ? (
            <button
              onClick={handleAddToCart}
              disabled={!product}
              className={`${manrope.className} w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-5 rounded-sm font-semibold transition border-2 border-gray-200 ${
                !product ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex gap-2 w-full">
              {/* Edit button with tick feedback */}
              <button
                onClick={handleEdit}
                disabled={!product}
                className={`${manrope.className} flex-1 flex items-center justify-center gap-1 border-2 border-blue-500 bg-blue-400 hover:bg-blue-500 text-white py-2 px-5 rounded-sm font-semibold 
                            transition-transform duration-150 active:scale-105`}
              >
                Edit
                {showTick && <Check size={16} className="ml-1" strokeWidth={3} />}
              </button>

              <Link
                href="/cart"
                className={`${manrope.className} flex items-center justify-center px-4 bg-green-500 text-white rounded-sm relative border-2 border-green-600 hover:bg-green-600 transition`}
              >
                <ShoppingCart size={18} />
                <span className="absolute top-[2px] right-[2px] text-[11px] bg-white text-green-600 font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {quantity}
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
