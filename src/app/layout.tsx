// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Monopoly GO Servicing",   // ✅ new site name
  description: "Buy stickers and boosting services",
};

// ✅ Correct way in Next.js 13+
export const viewport: Viewport = {
  themeColor: "#ffffff",   // keeps browser UI light
  colorScheme: "light",    // forces Safari/Chrome to stay light mode
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* fallback if viewport doesn’t cover all browsers */}
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-gray-50 flex justify-center" suppressHydrationWarning>
        <CartProvider>
          {/* Wrapper caps entire site */}
          <div className="w-full">
            <Header />

            {/* Page content */}
            <main className="pt-14 px-0">{children}</main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
