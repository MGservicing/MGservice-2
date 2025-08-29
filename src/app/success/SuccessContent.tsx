"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Manrope } from "next/font/google";
import { useCart } from "@/context/CartContext";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Order = {
  order_number: number;
  email: string;
};

export default function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("loading");

  useEffect(() => {
    if (!orderNumber) return;

    const processOrder = async () => {
      try {
        // 1️⃣ Check current order status from pending_orders
        const res = await fetch(`/api/verify-order?order_number=${orderNumber}`);
        const data = await res.json();
        setStatus(data.status);

        if (data.status === "processed") {
          // ✅ Only clear cart when processed (Stripe confirmed)
          clearCart();

          // Mark as fully paid in pending_orders
          await fetch("/api/verify-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_number: orderNumber }),
          });
          setStatus("paid");
        }

        // 2️⃣ Get order details from successful_orders for display
        const { data: success, error: successErr } = await supabase
          .from("successful_orders")
          .select("order_number, email")
          .eq("order_number", Number(orderNumber))
          .single();

        if (successErr) {
          console.error("❌ Failed to fetch successful order:", successErr.message);
          setError(successErr.message);
        } else {
          setOrder(success);
        }
      } catch (err: any) {
        console.error("❌ Unexpected error:", err.message);
        setError("Something went wrong.");
      }
    };

    processOrder();
  }, [orderNumber, clearCart]);

  if (error) {
    return <p className="text-center mt-6 text-red-500">Failed to load order.</p>;
  }

  if (status === "pending") {
    return (
      <p className="text-center mt-6 text-yellow-600">
        ⏳ Awaiting payment confirmation...
      </p>
    );
  }

  return (
    <div
      className={`${manrope.className} min-h-screen flex items-center justify-center bg-gray-100 px-4 -mt-14`}
    >
      <div className="relative bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-left">
        <div className="text-4xl mb-3">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Thank you for your order!
        </h1>
        <p className="text-gray-600 mb-6">
          {status === "paid"
            ? "Your payment is successful. You’ll receive a confirmation email soon."
            : "We’ve received your order and it’s being processed."}
        </p>

        {order && (
          <p className="text-gray-800 font-medium mb-6">
            <strong>Order Number:</strong>{" "}
            <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">
              {order.order_number}
            </span>
          </p>
        )}

        <div className="flex gap-4">
          <a
            href={
              order
                ? `/order-status?email=${encodeURIComponent(order.email)}`
                : "/order-status"
            }
            className="flex-1 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition text-center font-semibold"
          >
            Track your order
          </a>
          <a
            href="/"
            className="flex-1 bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition text-center font-semibold"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
