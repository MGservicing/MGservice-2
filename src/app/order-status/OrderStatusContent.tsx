"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Manrope } from "next/font/google";
import { ArrowLeft } from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Order = {
  order_number: number;
  email: string;
  status: string;
  cart_items: any[];
  created_at: string;
};

export default function OrderStatusContent({ emailFromUrl }: { emailFromUrl: string | null }) {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const fetchOrders = async (customEmail?: string) => {
    const targetEmail = customEmail || email;
    if (!targetEmail) {
      setError("Please enter your email");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from("successful_orders")
      .select("order_number, email, cart_items, status, created_at")
      .eq("email", targetEmail)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      setError("Failed to fetch orders. Please try again.");
      return;
    }

    if (data) {
      setOrders(data as Order[]);
    }
  };

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      fetchOrders(emailFromUrl);
    }
  }, [emailFromUrl]);

  return (
    <section className={`${manrope.className} max-w-[1024px] mx-auto px-5 py-5`}>
      {/* Back button */}
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center font-medium text-[16px] text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Link>
      </div>

      <h1 className="text-3xl font-bold mt-6 mb-2">My Orders</h1>
      <p className="text-gray-600">
        You can check your orders status below. Please make sure your email is correct.
      </p>
      <p className="text-[16px] text-gray-600 mb-6">
        If there’s an issue with your orders please check our{" "}
        <Link href="/help" className="text-indigo-600 hover:underline">
          Help Center
        </Link>
        .
      </p>

      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchOrders();
        }}
        className="mb-6 relative w-full"
      >
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
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 pl-12 pr-24 rounded-full border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-0 right-6 text-indigo-600 font-semibold hover:text-indigo-800 transition disabled:opacity-50"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Orders table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.order_number}
                  className="text-sm text-center border-b border-gray-300 last:border-b-0"
                >
                  <td className="px-4 py-2 font-semibold">{order.order_number}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">
                    {Array.isArray(order.cart_items)
                      ? `${order.cart_items.length} items`
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {order.created_at
                      ? new Date(order.created_at).toISOString().split("T")[0]
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        order.status === "completed"
                          ? "text-green-600 font-bold"
                          : order.status === "pending"
                          ? "text-yellow-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              searched &&
              !loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No orders found. Make sure the email is correct.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
