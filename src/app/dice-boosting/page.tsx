// src/app/dice-boosting/page.tsx
import { createClient } from "@supabase/supabase-js";
import DiceBoostingClient from "./DiceBoostingClient";

export const revalidate = 60; // ✅ ISR every 60s

async function getBonuses() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("bonuses")
    .select("service_id, bonus_token, bonus_amount")
    .eq("is_active", true);

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return data || [];
}

export default async function DiceBoostingPage() {
  const bonuses = await getBonuses(); // ✅ prefetch server-side

  return <DiceBoostingClient bonuses={bonuses} />;
}
