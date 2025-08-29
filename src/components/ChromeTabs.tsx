"use client";

import { usePathname } from "next/navigation";

export default function ChromeTabs() {
  const pathname = usePathname();

  const tabBase =
    "flex-1 text-center px-5 py-2 text-[14px] sm:text-[16px] font-medium transition-colors rounded-t-xl -mb-px";

  const activeTab =
    "bg-white text-gray-900 border-x border-t border-gray-300 border-b-0 z-10";
  const inactiveTab =
    "text-gray-600 border-b-2 border-transparent hover:bg-blue-100 hover:text-gray-900";

  return (
    <div className="w-full bg-[#eaf1fb] border-b border-gray-300 relative pt-2">
      <div className="max-w-[700px] mx-auto flex px-1 sm:px-3 gap-2">
        {/* Stickers / Events Tab */}
        <a
          href="/stickers-shop"
          className={`${tabBase} ${
            pathname === "/stickers-shop" ? activeTab : inactiveTab
          }`}
        >
          🏷️ Stickers & Events
        </a>

        {/* Dice Boosting Tab */}
        <a
          href="/dice-boosting"
          className={`${tabBase} ${
            pathname === "/dice-boosting" ? activeTab : inactiveTab
          }`}
        >
          🎲 Dice Boosting
        </a>
      </div>
    </div>
  );
}
