"use client";

import { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

type CartCheckoutFormProps = {
  cart: any[];
  totalItems: number;
};

export default function CartCheckoutForm({ cart, totalItems }: CartCheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [notes, setNotes] = useState("");
  const [fbPassword, setFbPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ detect if cart contains boost
  const hasBoost = cart.some((item) => item.name.toLowerCase().includes("boost"));
  // ✅ detect if cart is only boost
  const onlyBoost = hasBoost && cart.every((item) => item.name.toLowerCase().includes("boost"));
  // ✅ Invite link shows if not only boost
  const showInviteLink = !onlyBoost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/start-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          email,
          username,
          inviteLink: showInviteLink ? inviteLink : undefined,
          notes,
          fbPassword: hasBoost ? fbPassword : undefined,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <div className="sticky top-18">
      {/* ✅ form for validation */}
      <form
        id="checkout-form"
        className="border-2 border-gray-200 rounded-lg px-5 py-4 bg-gray-100 space-y-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-[20px] font-semibold mb-5">
          Shopping Cart ({totalItems})
        </h2>

        {/* ✅ Email (changes label if boost) */}
        <div>
          <label className="block text-[15px] font-semibold">
            {hasBoost ? "Facebook login email (boost)" : "Email"}
          </label>
          <input
            type="email"
            required
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 
                      focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={hasBoost ? "your_facebook@email.com" : "amy@gmail.com"}
          />
        </div>

        {/* ✅ Facebook password field only if boost */}
        {hasBoost && (
          <div>
            <label className="block text-[15px] font-semibold">
              Facebook login password (boost)
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 pr-10 bg-gray-50 
                          focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
                value={fbPassword}
                onChange={(e) => setFbPassword(e.target.value)}
                placeholder="••••••••"
              />
              {/* 👁 toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="text-[12.5px] leading-tight text-gray-500 mt-1">
              Your password is only used to fulfill boost orders.
            </p>
          </div>
        )}

        {/* ✅ Username (always required) */}
        <div>
          <label className="block text-[15px] font-semibold">In-game username</label>
          <input
            type="text"
            required
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 
                      focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Amy"
          />
          <p className="text-[12.5px] leading-tight text-gray-500 mt-1">
            We need your username to ensure the items are sent to the correct account.
          </p>
        </div>

        {/* ✅ Invite link (show unless cart is ONLY boost items) */}
        {showInviteLink && (
          <div>
            <label className="block text-[15px] font-semibold">
              Invite link / Friend code
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 
                        focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
              placeholder="Invite link is preferred!"
            />
            <p className="text-[12.5px] leading-tight text-gray-500 mt-1">
              Having trouble finding your invite link? Check this guide
            </p>
          </div>
        )}

        {/* ✅ Notes (optional) */}
        <div>
          <label className="block text-[15px] font-semibold">Notes (Optional)</label>
          <textarea
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 
                      focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Remarks, comments, etc."
          />
        </div>
      </form>

      {/* ✅ Button outside gray box */}
      <button
        type="submit"
        form="checkout-form"
        className="w-full bg-green-500 text-white py-2 rounded-md border-2 border-green-600 font-semibold text-[16px] hover:bg-green-600 active:scale-103 transition-transform duration-150 mt-4 flex items-center justify-center"
      >
        <LockKeyhole className="w-5 h-5 mr-2" strokeWidth={3} />
        Continue to Checkout
      </button>

      <p className="text-xs text-center text-gray-500 mt-2 flex items-center justify-center">
        Powered by{" "}
        <img
          src="https://msukfjwrrzjnkpznwnrm.supabase.co/storage/v1/object/public/Site%20Image/stripe.svg"
          alt="Stripe logo"
          className="h-5 ml-1"
        />
      </p>
    </div>
  );
}
