"use client";

import { Suspense } from "react";
import OrderStatusClient from "./OrderStatusClient";

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading order status...</p>}>
      <OrderStatusClient />
    </Suspense>
  );
}
