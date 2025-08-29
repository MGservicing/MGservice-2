import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role needed to update
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("order_number");

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing order_number" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("pending_orders")
    .select("status")
    .eq("order_number", Number(orderNumber)) // ✅ ensure numeric match
    .single();

  if (error) {
    console.error("❌ verify-order GET failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: data?.status || "unknown" });
}

export async function POST(req: Request) {
  const { order_number } = await req.json();

  if (!order_number) {
    return NextResponse.json({ error: "Missing order_number" }, { status: 400 });
  }

  // 🔄 Update status only if still processed (not already paid)
  const { error } = await supabase
    .from("pending_orders")
    .update({ status: "paid" }) // ✅ final step
    .eq("order_number", Number(order_number))
    .eq("status", "processed"); // ✅ ensures only processed → paid

  if (error) {
    console.error("❌ verify-order POST failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
