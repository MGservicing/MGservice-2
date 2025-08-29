// src/app/api/start-checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { encrypt } from "@/lib/crypto"; // ✅ encryption helper

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ service role key for insert/update
);

export async function POST(req: Request) {
  try {
    const { cart, email, username, inviteLink, notes, fbPassword } =
      await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ✅ Encrypt password if provided
    const safePassword = fbPassword ? encrypt(fbPassword) : null;

    // 1️⃣ Save to pending_orders
    const { data: order, error } = await supabase
      .from("pending_orders")
      .insert([
        {
          email,
          username,
          invite_link: inviteLink,
          notes,
          cart_items: cart, // ✅ jsonb column in Supabase
          status: "pending",
          facebook_password: safePassword,
        },
      ])
      .select("order_number")
      .single();

    if (error) throw error;

    const orderNumber = order.order_number;

    // 2️⃣ Build Stripe line items
    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // 3️⃣ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email || undefined,
      line_items,
      metadata: {
        order_number: orderNumber.toString(),
      },
      success_url: `${siteUrl}/success?order_number=${orderNumber}`,
      cancel_url: `${siteUrl}/cart`,
    });

    // 4️⃣ Save Stripe session id in Supabase (optional, for webhook cross-check)
    await supabase
      .from("pending_orders")
      .update({ session_id: session.id })
      .eq("order_number", orderNumber);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Start checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
