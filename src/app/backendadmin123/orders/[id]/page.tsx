"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "600", "700"] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  description?: string;
};

type Order = {
  id: number;
  order_number: number;
  email: string;
  username: string;
  notes: string;
  facebook_password: string | null;
  cart_items: CartItem[];
  status: string;
  created_at: string;
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    setLoading(true);

    const { data, error } = await supabase
      .from("successful_orders")
      .select(
        "id, order_number, email, username, notes, facebook_password, cart_items, status, created_at"
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Error fetching order:", error.message);
    } else {
      console.log("✅ Order detail:", data);
      setOrder(data as Order);
    }

    setLoading(false);
  }

  async function updateStatus(newStatus: string) {
    await supabase.from("successful_orders").update({ status: newStatus }).eq("id", id);
    fetchOrder();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.push("/backendadmin123")}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Orders
        </button>
        <p className="text-red-500">Order not found.</p>
      </div>
    );
  }

  const total = order.cart_items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className={`${manrope.className} p-6`}>
      <button
        onClick={() => router.push("/backendadmin123")}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Orders
      </button>

      <h1 className="text-2xl font-bold mb-4">Order #{order.order_number}</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6 space-y-2">
        <p><strong>Email:</strong> {order.email || "-"}</p>
        <p><strong>Username:</strong> {order.username || "-"}</p>
        <p><strong>Notes:</strong> {order.notes || "-"}</p>
        <p><strong>Facebook Password:</strong> {order.facebook_password || "-"}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>

        <div className="mt-4 space-x-2">
          <button
            onClick={() => updateStatus("pending")}
            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
          >
            Mark Pending
          </button>
          <button
            onClick={() => updateStatus("completed")}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
          >
            Mark Completed
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Items</h2>
      <div className="bg-white shadow rounded-lg p-6">
        {order.cart_items && order.cart_items.length > 0 ? (
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.cart_items.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">${item.price.toFixed(2)}</td>
                  <td className="p-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No items found for this order.</p>
        )}
      </div>
    </div>
  );
}
