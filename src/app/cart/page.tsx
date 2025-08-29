"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Manrope } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import CartCheckoutForm from "./CartCheckoutForm"; // ✅ import new form

// ✅ Manrope font
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // ✅ Total item count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 🧮 Price Calculations
  let originalSubtotal = 0;
  let subtotal = 0;

  cart.forEach((item) => {
    const isBoost = item.name.toLowerCase().includes("boost");
    let originalPrice: number;

    if (isBoost) {
      originalPrice = item.originalPrice ?? item.price;
    } else {
      // Stickers → auto 30% off
      originalPrice = item.price / 0.7;
    }

    originalSubtotal += originalPrice * item.quantity;
    subtotal += item.price * item.quantity;
  });

  const discount = originalSubtotal - subtotal;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className={`${manrope.className} max-w-[1024px] mx-auto p-6 text-center`}>
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link
          href="/"
          className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add Items
        </Link>
      </div>
    );
  }

  return (
    <div className={`${manrope.className} max-w-[1024px] mx-auto px-5 py-7 grid md:grid-cols-5 gap-8`}>
      {/* Left side - Items (60%) */}
      <div className="md:col-span-3 space-y-6 py-2">
        {/* Back button */}
        <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
          <Link
            href="/"
            className="pt-1 inline-flex items-center font-medium text-[16px] text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Add Items
          </Link>
        </div>

        {/* Cart Items */}
        <div className="divide-y divide-gray-200">
          {cart.map((item) => {
            const isBoost = item.name.toLowerCase().includes("boost");

            let originalPrice: number;
            if (isBoost) {
              originalPrice = item.originalPrice ?? item.price;
            } else {
              originalPrice = item.price / 0.7;
            }

            const itemTotal = item.price * item.quantity;
            const originalTotal = originalPrice * item.quantity;
            const discountPercent =
              originalPrice > item.price
                ? Math.round(100 - (item.price / originalPrice) * 100)
                : 0;

            return (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded object-contain bg-gray-100"
                  />
                  <div>
                    <p className="text-[17px] font-semibold">{item.name}</p>

                    {/* Quantity + Edit */}
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden w-28">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.id, item.quantity - 1)
                              : removeFromCart(item.id)
                          }
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 border-r border-gray-300"
                        >
                          –
                        </button>
                        <span className="flex-1 text-center text-[16px] font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isBoost}
                          className={`w-7 h-7 flex items-center justify-center border-l border-gray-300 ${
                            isBoost
                              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      {isBoost && (
                        <button
                          className="px-3 py-1 border-2 border-blue-500 bg-blue-400 text-white rounded-md text-sm font-semibold hover:bg-blue-500 transition"
                          onClick={() => router.push("/dice-boosting")}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Info */}
                <div className="text-right">
                  <p
                    className="text-green-600 font-medium"
                    style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
                  >
                    ${itemTotal.toFixed(2)}
                  </p>

                  {discountPercent > 0 && (
                    <p className="text-gray-500 text-sm">
                      <span className="line-through mr-1">${originalTotal.toFixed(2)}</span>
                      ({discountPercent}% off)
                    </p>
                  )}

                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="border-t border-gray-200 pt-4">
          <p className="flex justify-between">
            <span className="text-[15px]">
              {totalItems} {totalItems === 1 ? "product" : "products"}
            </span>
            {discount > 0 && (
              <span className="text-gray-600 flex items-center">
                <span className="text-[14px]">(${discount.toFixed(2)} off)</span>
                <span
                  className="line-through ml-2"
                  style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
                >
                  ${originalSubtotal.toFixed(2)}
                </span>
              </span>
            )}
          </p>

          <p className="flex justify-between">
            <span className="font-semibold text-[17px]">Subtotal</span>
            <span
              className="text-green-600 font-medium text-[16px]"
              style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
            >
              ${subtotal.toFixed(2)}
            </span>
          </p>

          <div className="mt-4 mb-4">
            <p className="flex justify-between">
              <span className="font-semibold text-[16px]">Tax (5%)</span>
              <span style={{ fontFamily: 'Consolas, "Courier New", monospace' }}>
                ${tax.toFixed(2)}
              </span>
            </p>
          </div>

          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
            <span className="font-semibold text-[18px] text-black">Total</span>
            <span
              className="font-semibold text-[18px] text-green-600"
              style={{ fontFamily: 'Consolas, "Courier New", monospace' }}
            >
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Checkout form (40%) */}
      <div className="md:col-span-2">
        <CartCheckoutForm cart={cart} totalItems={totalItems} />
      </div>
    </div>
  );
}
