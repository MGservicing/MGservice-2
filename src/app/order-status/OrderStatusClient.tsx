"use client";

import { useSearchParams } from "next/navigation";
import OrderStatusContent from "./OrderStatusContent";

export default function OrderStatusClient() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");

  return <OrderStatusContent emailFromUrl={emailFromUrl} />;
}