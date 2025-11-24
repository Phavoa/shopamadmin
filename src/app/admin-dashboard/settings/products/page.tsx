"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string;
  products: number;
}

export default function ProductCategoriesPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");

  // Mock data
  const categories: Category[] = Array(7)
    .fill(null)
    .map((_, i) => ({
      id: `cat-${i + 1}`,
      name: "Fashion",
      image: "/placeholder.png",
      products: 239,
    }));

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setCategoryName("");
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">
          Product Categories
        </h1>
      </div>

      {/* Back Button and Add Button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => router.push("/admin-dashboard/settings")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>

        <button
          onClick={handleAdd}
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            background: "#E67E22",
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="p-6">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Category Name
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Category Image
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Products
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 px-4 text-sm text-black">
                  {category.name}
                </td>
                <td className="py-4 px-4">
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span className="text-2xl">👕</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-black">
                  {category.products}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      style={{
                        padding: "6px 20px",
                        borderRadius: "8px",
                        background: "#E67E22",
                        color: "#FFF",
                        fontSize: "14px",
                        fontWeight: 500,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        router.push(
                          "/admin-dashboard/settings/products/delete-products"
                        )
                      }
                      style={{
                        padding: "6px 20px",
                        borderRadius: "8px",
                        background: "#FFF",
                        color: "#DC3545",
                        fontSize: "14px",
                        fontWeight: 500,
                        border: "1px solid #FEE2E2",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: "500px",
              background: "#FFF",
              borderRadius: "12px",
              padding: "24px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-xl font-semibold text-black mb-6">
              Add Product Category
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload Category Image
                </label>
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    border: "2px dashed #E5E7EB",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <span className="text-sm text-gray-500">Click to upload</span>
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  background: "#E67E22",
                  color: "#FFF",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              width: "500px",
              background: "#FFF",
              borderRadius: "12px",
              padding: "24px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-xl font-semibold text-black mb-6">
              Edit Product Category
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload a New Category Image
                </label>
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    border: "2px dashed #E5E7EB",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <span className="text-sm text-gray-500">Click to upload</span>
                </div>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  background: "#E67E22",
                  color: "#FFF",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
