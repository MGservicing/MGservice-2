"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "600", "700"] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Only these emails can access backend
const ADMIN_EMAILS = ["gostickerhub1@gmail.com"]; // replace with your admin email(s)

export default function BackendAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // ⛔ Skip auth check if on the login page
      if (pathname.startsWith("/backendadmin123/login")) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (!user) {
        router.push("/backendadmin123/login");
        return;
      }

      // ✅ Whitelist check
      if (!ADMIN_EMAILS.includes(user.email!)) {
        await supabase.auth.signOut();
        router.push("/backendadmin123/login");
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking access...</p>
      </div>
    );
  }

  return (
    <div className={`${manrope.className} min-h-screen bg-gray-50`}>
      {/* ✅ Admin header */}
      {!pathname.startsWith("/backendadmin123/login") && (
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
            <h1
              className="font-bold text-lg cursor-pointer"
              onClick={() => router.push("/backendadmin123/orders")}
            >
              Backend Dashboard
            </h1>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/backendadmin123/login");
              }}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>
      )}

      <main className="max-w-6xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
