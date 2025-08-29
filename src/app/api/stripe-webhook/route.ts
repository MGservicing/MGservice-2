// src/app/api/stripe-webhook/route.ts
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendCustomerEmail, sendAdminEmail } from "@/lib/emails/sendEmail"; // ✅ updated import

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil", // ✅ official Stripe API version
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderNumber = session.metadata?.order_number;

    if (orderNumber) {
      // 1️⃣ Fetch pending order
      const { data: pending, error } = await supabase
        .from("pending_orders")
        .select("*")
        .eq("order_number", Number(orderNumber))
        .single();

      if (error || !pending) {
        console.error("⚠️ Pending order not found:", error);
        return NextResponse.json({ received: true });
      }

      // 2️⃣ Insert into successful_orders
      const { error: insertError } = await supabase.from("successful_orders").insert([
        {
          order_number: pending.order_number,
          email: pending.email,
          username: pending.username,
          invite_link: pending.invite_link,
          notes: pending.notes,
          cart_items: pending.cart_items, // ✅ JSON array
          subtotal: pending.subtotal,
          tax: pending.tax,
          total: pending.total,
          status: "paid",
          facebook_password: pending.facebook_password,
        },
      ]);
      if (insertError) {
        console.error("❌ Failed to insert successful_orders:", insertError);
      }

      // 3️⃣ Mark pending as processed
      const { error: updateError } = await supabase
        .from("pending_orders")
        .update({ status: "processed" })
        .eq("order_number", Number(orderNumber));
      if (updateError) {
        console.error("❌ Failed to update pending_orders:", updateError);
      }

      // 4️⃣ Send emails with amounts + cart
      try {
        if (pending.email) {
          await sendCustomerEmail(pending.email, orderNumber, {
            subtotal: pending.subtotal ?? 0,
            tax: pending.tax ?? 0,
            total: pending.total ?? 0,
          });
        }

        await sendAdminEmail(
          orderNumber,
          pending.email ?? "N/A",
          pending.total ?? 0,
          pending.cart_items ?? []
        );

        console.log("📧 Emails sent successfully");
      } catch (mailErr) {
        console.error("⚠️ Failed to send email:", mailErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
