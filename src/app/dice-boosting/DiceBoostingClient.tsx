"use client";

import { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import { useCart } from "@/context/CartContext";
import StickyCartBar from "@/components/StickyCartBar";
import DicePreview from "@/components/DicePreview";
import ChromeTabs from "@/components/ChromeTabs"; // ✅ added
import { BoostOption } from "@/types/boost"; // ✅ shared type

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type ServiceOption = {
  id: string;
  label: string;
  price: number;
};

type Bonus = {
  service_id: string;
  bonus_token: string;
  bonus_amount: number;
};

// ✅ Boost options with original + item price
const boostOptions: Omit<BoostOption, "price">[] = [
  { id: "boost-2k", label: "+2,000 🎲", originalPrice: 10, itemPrice: 10 },
  { id: "boost-3k", label: "+3,000 🎲", originalPrice: 15, itemPrice: 14 },
  { id: "boost-4k", label: "+4,000 🎲", originalPrice: 20, itemPrice: 18 },
  { id: "boost-5k", label: "+5,000 🎲", originalPrice: 25, itemPrice: 22.5 },
  { id: "boost-6k", label: "+6,000 🎲", originalPrice: 30, itemPrice: 25.5 },
  { id: "boost-7k", label: "+7,000 🎲", originalPrice: 35, itemPrice: 29.75 },
  { id: "boost-8k", label: "+8,000 🎲", originalPrice: 40, itemPrice: 32 },
  { id: "boost-9k", label: "+9,000 🎲", originalPrice: 45, itemPrice: 36 },
];

const serviceOptions: ServiceOption[] = [
  { id: "side-event", label: "Side Event Completion", price: 10 },
  { id: "top-event", label: "Top Event Completion", price: 15 },
  { id: "side+top-event", label: "Side + Top Completion", price: 20 },
  { id: "none", label: "No Extra Service", price: 0 },
];

// ✅ Dice-based discount
const getFinalPrice = (itemPrice: number, dice: number) => {
  if (dice < 1000) return itemPrice;
  return Math.max(itemPrice - 2, 0);
};

export default function DiceBoostingClient({ bonuses }: { bonuses: Bonus[] }) {
  const { cart, addToCart } = useCart();

  const [currentDice, setCurrentDice] = useState("");
  const [selectedBoost, setSelectedBoost] = useState<BoostOption | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null
  );

  // ✅ Restore selections if boost already in cart
  useEffect(() => {
    const boostItem = cart.find((item) => item.type === "boost");
    if (boostItem) {
      const savedBoost = boostOptions.find(
        (b) => b.id === boostItem.selectedBoostId
      );
      const savedService = serviceOptions.find(
        (s) => s.id === boostItem.selectedServiceId
      );

      if (savedBoost) {
        // recalc final price on restore
        const dice = parseInt(boostItem.currentDice ?? "0") || 0;
        const finalPrice = getFinalPrice(savedBoost.itemPrice, dice);
        setSelectedBoost({ ...savedBoost, price: finalPrice });
      }
      if (savedService) setSelectedService(savedService);
      if (boostItem.currentDice)
        setCurrentDice(boostItem.currentDice.toString());
    }
  }, [cart]);

  // ✅ Auto scroll on mobile (< sm = 640px)
  useEffect(() => {
    if (window.innerWidth < 640) {
      const heroEnd = document.getElementById("hero-end");
      if (heroEnd) {
        heroEnd.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  // ✅ Bonus lookup
  const bonus =
    selectedService && selectedService.id !== "none"
      ? bonuses.find((b) => b.service_id === selectedService.id) || null
      : null;

  const dice = parseInt(currentDice) || 0;
  const finalBoostPrice = selectedBoost?.price || 0;

  const totalPrice = finalBoostPrice + (selectedService?.price || 0);

  const product =
    selectedBoost && selectedService
      ? {
          id: "dice-boosting",
          name: `Boost ${selectedBoost.label}${
            selectedService?.id !== "none" ? ` | ${selectedService.label}` : ""
          }`,
          price: totalPrice,
          originalPrice:
            selectedBoost.originalPrice + (selectedService?.price || 0), // ✅ store original
          type: "boost" as const,
          selectedBoostId: selectedBoost.id,
          selectedServiceId: selectedService.id,
          currentDice: currentDice,
          image_url: "https://msukfjwrrzjnkpznwnrm.supabase.co/storage/v1/object/public/Site%20Image/Diceboost.webp", // ✅ add product image
        }
      : null;

  const cartItem = cart.find((item) => item.type === "boost") || null;
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    
    if (!product) return;
    addToCart({
      ...product,
      quantity: 1,
      type: "boost",
      selectedBoostId: selectedBoost?.id,
      selectedServiceId: selectedService?.id,
      currentDice: currentDice,
    });
  };

  const formComplete =
    currentDice.trim() !== "" &&
    selectedBoost !== null &&
    selectedService !== null;

  return (
    <div className={`${manrope.className} w-full`}>
      {/* ✅ Hero Section */}
      <section className="w-full bg-gray-100 border-b border-gray-300">
        <div className="max-w-[1024px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Left (80%) */}
            <div className="md:col-span-4 text-left">
              <h1 className="text-[26px] md:text-[32px] font-extrabold mb-5">
                Monopoly GO! Dice Boosting 🎲
              </h1>
              <p className="text-gray-700 text-[16px] md:text-[18px] leading-relaxed">
                Pick your boost and leave the rest to us! After checkout, you’ll
                receive simple steps to get started. Any extras or bonuses are
                applied instantly — no hassle. Track your order anytime on the
                My Orders page.
              </p>
            </div>

            {/* Right (20%) reserved for image */}
            <div className="md:col-span-1 flex justify-center">
              <img
                src="/Diceboost.webp"
                alt="Dice Boosting"
                className="hidden md:block max-h-full object-contain"
              />
            </div>
          </div>

          {/* ✅ Alert Box */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center max-w-[720px] w-full border border-red-400 bg-red-100 text-red-700 px-4 py-3 rounded-md shadow-sm">
              <span className="mr-5">❗</span>
              <p className="text-[16px] text-left flex-1">
                For this service, we will need access to your Facebook account,
                including your password.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Chrome Tabs */}
      <ChromeTabs />

      {/* ✅ Anchor for auto-scroll */}
      <div id="hero-end"></div>

      {/* ✅ Main Grid */}
      <div className="max-w-[1024px] mx-auto grid md:grid-cols-5 gap-12 items-start px-5 py-12 pb-36">
        {/* Left Preview */}
        <div className="md:col-span-3">
          <DicePreview currentDice={currentDice} selectedBoost={selectedBoost} />
        </div>

        {/* Right Options */}
        <div className="md:col-span-2 flex flex-col space-y-10">
          {/* Step 1 */}
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Your Current Dice Balance
            </h2>
            <input
              type="number"
              value={currentDice}
              onChange={(e) => setCurrentDice(e.target.value)}
              placeholder="e.g. 2,000"
              className="w-full rounded-xl px-4 py-2 text-[15px] border-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-gray-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>

          {/* Step 2 */}
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Choose Dice Boost Amount
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {boostOptions.map((option) => {
                const finalPrice = getFinalPrice(option.itemPrice, dice);
                const discountPercent =
                  option.originalPrice > 0
                    ? Math.round(
                        ((option.originalPrice - finalPrice) /
                          option.originalPrice) *
                          100
                      )
                    : 0;

                return (
                  <div key={option.id} className="relative">
                    {/* ✅ Discount Badge in front */}
                    {discountPercent > 0 && (
                      <span
                        className={`absolute -top-px -right-px bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 z-10 flex items-center justify-center
                          ${currentDice.trim() === "" ? "opacity-50" : ""}`}
                      >
                        -{discountPercent}%
                      </span>
                    )}

                    <button
                      onClick={() =>
                        setSelectedBoost({ ...option, price: finalPrice })
                      }
                      disabled={currentDice.trim() === ""}
                      className={`w-full border-2 rounded-[8px] p-4 font-medium transition relative
                        ${
                          selectedBoost?.id === option.id
                            ? "border-indigo-600 bg-gray-50"
                            : "border-gray-300 bg-gray-50 hover:border-gray-400"
                        }
                        ${
                          currentDice.trim() === ""
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                    >
                      {option.label}
                      <div className="text-sm text-gray-600 font-mono mt-1">
                        {discountPercent > 0 ? (
                          <>
                            <span className="line-through mr-1">
                              ${option.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-green-600 font-semibold">
                              ${finalPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span>${option.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Additional Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-15 md:pb-0">
              {serviceOptions.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  disabled={!selectedBoost}
                  className={`border-2 rounded-xl p-4 font-medium leading-tight transition 
                    ${
                      selectedService?.id === service.id
                        ? "border-indigo-600 bg-gray-50"
                        : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }
                    ${!selectedBoost ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {service.label}
                  {service.price > 0 && (
                    <div className="text-sm text-gray-600 font-mono">
                      +${service.price.toFixed(2)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Sticky Bottom Bar */}
      <div className="w-full max-w-[1024px] mx-auto px-4 relative z-50">
        <StickyCartBar
          product={formComplete ? product : null}
          cartItem={cartItem}
          quantity={quantity}
          totalPrice={totalPrice}
          handleAddToCart={handleAddToCart}
          bonus={bonus}
        />
      </div>
    </div>
  );
}
