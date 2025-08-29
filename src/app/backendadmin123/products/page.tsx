"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "600", "700"] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  type?: "boost" | "sticker";
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // For adding a product
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    type: "sticker",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products") // ✅ make sure your table is called "products"
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }

  async function addProduct() {
    if (!newProduct.name || !newProduct.price) return;

    await supabase.from("products").insert([newProduct]);
    setNewProduct({ name: "", description: "", price: 0, type: "sticker", image_url: "" });
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className={`${manrope.className}`}>
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* Add new product */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price || ""}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Type (boost or sticker)"
            value={newProduct.type}
            onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value as "boost" | "sticker" })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image_url}
            onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="px-3 py-2 border rounded col-span-1 md:col-span-2"
          />
        </div>
        <button
          onClick={addProduct}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Product list */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Product List</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products yet.</p>
        ) : (
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2">{p.type}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
