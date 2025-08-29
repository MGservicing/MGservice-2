"use client";
import React, { useEffect, useState } from "react";
import { BoostOption } from "@/types/boost"; // ✅ use shared type

type DicePreviewProps = {
  currentDice: string;
  selectedBoost: BoostOption | null;
};

// helper to extract number from "+5,000 🎲"
function parseBoostValue(label: string): number {
  const digits = label.replace(/[^0-9]/g, ""); // remove everything except numbers
  return parseInt(digits, 10) || 0;
}

function getFontSize(width: number): string {
  if (width >= 300 && width <= 324) return "12px";
  if (width >= 325 && width <= 349) return "13px";
  if (width >= 350 && width <= 374) return "14px";
  if (width >= 375 && width <= 399) return "15px";
  if (width >= 400 && width <= 424) return "16px";
  if (width >= 425 && width <= 449) return "17px";
  if (width >= 450 && width <= 474) return "18px";
  if (width >= 475 && width <= 499) return "19px";
  if (width >= 500 && width <= 549) return "20px";
  if (width >= 550 && width <= 599) return "22px";
  if (width >= 600 && width <= 639) return "23px";
  if (width >= 640 && width <= 679) return "25px";
  if (width >= 680 && width <= 719) return "28px";
  if (width >= 720 && width <= 767) return "30px";
  if (width >= 768 && width <= 779) return "19.75px";
  if (width >= 780 && width <= 799) return "20px";
  if (width >= 800 && width <= 879) return "21px";
  if (width >= 880 && width <= 899) return "21.25px";
  if (width >= 900 && width <= 959) return "22px";
  if (width >= 960 && width <= 999) return "22.5px";
  if (width >= 1000) return "22.75px";
  return "16px";
}

export default function DicePreview({
  currentDice,
  selectedBoost,
}: DicePreviewProps) {
  const [fontSize, setFontSize] = useState("16px");

  useEffect(() => {
    function updateSize() {
      setFontSize(getFontSize(window.innerWidth));
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // calculate boosted dice value
  const baseDice = parseInt(currentDice) || 0;
  const boostAmount = selectedBoost ? parseBoostValue(selectedBoost.label) : 0;
  const boostedDice = baseDice + boostAmount;

  return (
    <div className="relative w-full">
      {/* Base Preview Image */}
      <img
        src="https://msukfjwrrzjnkpznwnrm.supabase.co/storage/v1/object/public/Site%20Image/Dice_preview.png"
        alt="Dice Preview"
        className="w-full h-auto object-contain"
      />

      {/* Current Dice Balance (left pill) */}
      {currentDice && (
        <div
          className="absolute bottom-[8.5%] left-[26.5%] -translate-x-1/2 text-center text-white font-bold"
          style={{ fontSize }}
        >
          {baseDice} 🎲
        </div>
      )}

      {/* Boosted Dice Balance (right pill) */}
      {selectedBoost && (
        <div
          className="absolute bottom-[8.5%] right-[23.5%] translate-x-1/2 text-center text-white font-bold"
          style={{ fontSize }}
        >
          {boostedDice} 🎲
        </div>
      )}
    </div>
  );
}
