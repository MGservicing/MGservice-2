"use client";

import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data) setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 flex flex-col items-center text-center shadow hover:shadow-lg transition">
          <h3 className="text-lg font-bold mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2">${product.price}</p>
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
              })
            }
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-auto"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}