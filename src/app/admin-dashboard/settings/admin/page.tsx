"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit, Trash2, X, ChevronDown } from "lucide-react";

export default function AdminManagementPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [editRole, setEditRole] = useState("Super Admin");

  const admins = [
    {
      name: "Akin Damilola",
      email: "akin.damilola@shopam.com",
      role: "Super Admin",
      dateAdded: "Jan 15, 2024",
      status: "Active",
    },
    {
      name: "Chioma Okafor",
      email: "chioma.okafor@shopam.com",
      role: "Admin",
      dateAdded: "Feb 20, 2024",
      status: "Active",
    },
  ];

  const rolePermissions = {
    Admin: [
      "Manage sellers and buyers",
      "View reports and analytics",
      "Monitor livestreams",
      "Limited settings access",
    ],
    "Super Admin": [
      "Full system access and control",
      "Manage all admins and users",
      "Configure system settings",
      "Access to all reports and analytics",
    ],
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Admin Management</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Back Button and Add Admin */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/admin-dashboard/settings")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Settings</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#E67E22",
              border: "none",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus className="w-4 h-4" />
            Add New Admin
          </button>
        </div>

        {/* Admin Users Card */}
        <div
          style={{
            padding: "24px",
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            background: "#FFF",
          }}
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-black">Admin Users</h2>
            <p className="text-sm text-gray-600">
              Manage admin access and permissions
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Date Added
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {admin.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {admin.email}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          background:
                            admin.role === "Super Admin"
                              ? "#E67E22"
                              : "#6B7280",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {admin.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {admin.dateAdded}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          background: "#10B981",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Admin Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: "500px",
              padding: "24px",
              borderRadius: "18px",
              background: "#FFF",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">
                Add New Admin
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "0.3px solid rgba(0, 0, 0, 0.20)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "0.3px solid rgba(0, 0, 0, 0.20)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Select Admin Role:
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "0.3px solid rgba(0, 0, 0, 0.20)",
                      fontSize: "14px",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Permissions Display */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "#FFF3E6",
                }}
              >
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {selectedRole} Permissions
                </h3>
                <ul className="space-y-1">
                  {rolePermissions[selectedRole].map((permission, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1">•</span>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add Admin Button */}
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#E67E22",
                  border: "none",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <Plus className="w-4 h-4" />
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-50"
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              width: "500px",
              padding: "24px",
              borderRadius: "18px",
              background: "#FFF",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">Edit Admin</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  defaultValue="Akin Damilola"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "0.3px solid rgba(0, 0, 0, 0.20)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  defaultValue="akindamilola@shopam.com"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "0.3px solid rgba(0, 0, 0, 0.20)",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Select Admin Role:
                </label>
                <div className="relative">
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "0.3px solid rgba(0, 0, 0, 0.20)",
                      fontSize: "14px",
                      outline: "none",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Permissions Display */}
              <div
                style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "#FFF3E6",
                }}
              >
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {editRole} Permissions
                </h3>
                <ul className="space-y-1">
                  {rolePermissions[editRole].map((permission, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-1">•</span>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Update Admin Button */}
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#E67E22",
                  border: "none",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                Update Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}