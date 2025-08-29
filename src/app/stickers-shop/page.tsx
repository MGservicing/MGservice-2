// src/app/stickers-shop/page.tsx
import { createClient } from "@supabase/supabase-js";
import Filters from "./Filters"; // 👈 Client component
import { Suspense } from "react";
import { Product } from "@/types/Product"; // ✅ Use shared type
import { Manrope } from "next/font/google";
import ChromeTabs from "@/components/ChromeTabs"; // ✅ client-only tabs

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 60; // ISR: refresh every 60s

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", "stickers")
    .order("name", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return data || [];
}

export default async function StickersShopPage() {
  const products = await getProducts();

  return (
    <div className={`${manrope.className} w-full`}>
      {/* ✅ Hero Section */}
      <section className="w-full bg-gray-50 border-b border-gray-300">
        <div className="max-w-[1024px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Left (80%) */}
            <div className="md:col-span-4 text-left">
              <h1 className="text-[26px] md:text-[32px] font-extrabold mb-5">
                Monopoly GO! Stickers Shop 🏷️
              </h1>
              <p className="text-gray-700 text-[14px] md:text-[16px] leading-relaxed">
                Browse all Monopoly GO! stickers available in our shop. Search
                by name, star rating, or golden rarity to complete your
                collection faster. Trusted, fast delivery, and always
                up-to-date!
              </p>
            </div>

            {/* Right (20%) reserved for image */}
            <div className="md:col-span-1 flex justify-center">
              <img
                src="https://msukfjwrrzjnkpznwnrm.supabase.co/storage/v1/object/public/Site%20Image/mainpage.webp"
                alt="Stickers Shop"
                className="hidden md:block max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Chrome Tabs (Client Component) */}
      <ChromeTabs />

      {/* ✅ Stickers Grid */}
      <div className="w-full px-3 py-6 border border-gray-300 border-t-0 bg-white shadow-sm">
        <div className="max-w-[1000px] mx-auto">
          <Suspense fallback={<p>Loading stickers...</p>}>
            <Filters products={products} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
