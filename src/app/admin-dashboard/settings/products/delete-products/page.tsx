"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  seller: string;
  category: string;
  dateAdded: string;
}

export default function DeleteProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - Replace with API call
  const products: Product[] = Array(7)
    .fill(null)
    .map((_, i) => ({
      id: `prod-${i + 1}`,
      name: "iPhone 15 Pro",
      seller: "Max Gadgets",
      category: "Gadgets",
      dateAdded: "2024-01-15",
    }));

  const handleDelete = (productId: string) => {
    // Add delete logic here - API call
    console.log("Deleting product:", productId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Delete Product</h1>

        {/* Search Bar */}
        <div className="relative" style={{ width: "400px" }}>
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Product by Product Name, Seller, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              borderRadius: "8px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Back to Settings Button */}
      <div className="px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => router.push("/admin-dashboard/settings/products")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>

      {/* Products Table */}
      <div className="p-6">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Product Name
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Seller
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Category
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Date Added
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter(
                (product) =>
                  product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  product.category.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((product, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-black">
                    {product.name}
                  </td>
                  <td className="py-4 px-4 text-sm text-black">
                    {product.seller}
                  </td>
                  <td className="py-4 px-4 text-sm text-black">
                    {product.category}
                  </td>
                  <td className="py-4 px-4 text-sm text-black">
                    {product.dateAdded}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        padding: "8px 24px",
                        borderRadius: "8px",
                        background: "#EF4444",
                        color: "#FFF",
                        fontSize: "14px",
                        fontWeight: 500,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* No Results */}
        {products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}