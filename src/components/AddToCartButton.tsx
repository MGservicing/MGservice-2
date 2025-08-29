"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400","500","600"] });

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;
  };
};

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { cart, addToCart } = useCart();

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (quantity > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 150);
      return () => clearTimeout(timer);
    }
  }, [quantity]);

  if (!cartItem) {
    return (
      <button
        onClick={() => addToCart({ ...product, quantity: 1 })}
        className={`${manrope.className} w-full mt-auto bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-3 rounded-sm font-semibold transition border-2 border-gray-200`}
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div className="flex mt-auto w-full gap-1">
      <button
        onClick={() => addToCart({ ...product, quantity: 1 })}
        className={`${manrope.className} flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-1.5 px-3 rounded-sm font-semibold transition border-2 border-gray-200`}
      >
        Add to Cart
      </button>

      <Link
        href="/cart"
        className={`${manrope.className} flex items-center justify-center px-2 bg-green-600 text-white rounded-sm relative border-1 border-green-700 hover:bg-green-700 transition group`}
      >
        <ShoppingCart size={18} />
        <span
          className={`absolute top-0.5 right-0.5 text-[10px] bg-white text-green-600 font-bold rounded-full w-4 h-4 flex items-center justify-center transition-transform ${
            bump ? "scale-120" : "scale-100"
          }`}
        >
          {quantity}
        </span>
        <span className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          Go to Cart
        </span>
      </Link>
    </div>
  );
}
