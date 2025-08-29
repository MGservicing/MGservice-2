"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "600", "700"] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Order = {
  id: number;
  order_number: number;
  email: string;
  cart_items: any[];
  status: string;
  created_at: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("successful_orders") // ✅ switched to successful_orders
      .select("id, order_number, email, cart_items, status, created_at")
      .order("id", { ascending: false });

    if (error) {
      console.error("❌ Supabase error fetching orders:", error.message);
    } else {
      console.log("✅ Orders fetched from Supabase:", data);
      setOrders(data as Order[]);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className={`${manrope.className}`}>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order #</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const items = Array.isArray(o.cart_items) ? o.cart_items : [];
              const total = items.reduce(
                (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                0
              );

              return (
                <tr
                  key={o.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/backendadmin123/orders/${o.id}`)}
                >
                  <td className="p-3 font-mono">{o.order_number}</td>
                  <td className="p-3">{o.email || "-"}</td>
                  <td className="p-3">{items.length} items</td>
                  <td className="p-3">${total.toFixed(2)}</td>
                  <td className="p-3">
                    {o.created_at
                      ? new Date(o.created_at).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        o.status === "completed" || o.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
