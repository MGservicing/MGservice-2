"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag } from "lucide-react";
import { Manrope } from "next/font/google";
import Image from "next/image";

// ✅ Load Manrope
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Header() {
  const { cart } = useCart();
  const pathname = usePathname();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isCartPage = pathname === "/cart";

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      {/* ✅ Match site width cap */}
      <div className="max-w-[1024px] mx-auto flex items-center justify-between px-4 py-1">
        {/* ✅ Logo with max height = cart button */}
        <Link href="/" className="flex items-center h-10">
          <Image
            src="/MGservicing_Logo.webp"
            alt="MGservicing Logo"
            width={120}          // width auto-adjusts
            height={35}          // height fixed to 32px
            className="h-full w-auto object-contain"
            priority
          />
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-3 py-1.5">
          {/* Cart button */}
          <Link
            href="/cart"
            className={`flex items-center gap-1.5 px-4 pt-1.5 pb-1 rounded-full relative text-[15px] font-semibold transition border-2 transform duration-150 hover:shadow-sm active:scale-103 ${
              isCartPage
                ? "bg-gray-200 text-gray-700 border-gray-300"
                : "bg-green-500 text-white border-green-700 hover:bg-green-600"
            }`}
          >
            <ShoppingBag
              size={20}
              strokeWidth={isCartPage ? 2 : 2.8}
              className={isCartPage ? "text-gray-700" : "text-white"}
            />
            <span className={manrope.className}>{itemCount}</span>
          </Link>

          {/* Hamburger menu */}
          <button className="p-1.5">
            <Menu size={23} />
          </button>
        </div>
      </div>
    </header>
  );
}
