// src/app/checkout/page.tsx
"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startCheckout = async () => {
      if (cart.length === 0) return;

      try {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart }),
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url; // 🚀 Redirect to Stripe Checkout
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Checkout error:", err);
        setLoading(false);
      }
    };

    startCheckout();
  }, [cart]);

  if (cart.length === 0) {
    return <p className="text-center mt-6">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-lg mx-auto text-center py-20">
      {loading ? (
        <p className="text-lg font-semibold">Redirecting to Stripe Checkout…</p>
      ) : (
        <p className="text-red-600">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
