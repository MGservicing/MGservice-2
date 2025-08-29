import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use Service Role key for inserts
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, items, total_amount, payment_intent_id } = req.body;

    if (!email || !items || !total_amount || !payment_intent_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          email,
          items, // jsonb field in Supabase
          total_amount,
          payment_intent_id
        }
      ])
      .select();

    if (error) throw error;

    return res.status(200).json({ success: true, order: data[0] });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
