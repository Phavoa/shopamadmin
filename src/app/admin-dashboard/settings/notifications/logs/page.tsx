"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Download } from "lucide-react";

export default function NotificationLogsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample notification logs data
  const logs = [
    {
      id: "NL001",
      recipient: "john.doe@example.com",
      type: "Email",
      template: "Order Confirmation",
      status: "Delivered",
      sentAt: "2024-01-15 10:30 AM",
      deliveredAt: "2024-01-15 10:31 AM",
    },
    {
      id: "NL002",
      recipient: "+234 801 234 5678",
      type: "SMS",
      template: "Order Shipped",
      status: "Delivered",
      sentAt: "2024-01-15 11:45 AM",
      deliveredAt: "2024-01-15 11:46 AM",
    },
    {
      id: "NL003",
      recipient: "jane.smith@example.com",
      type: "Email",
      template: "Payment Success",
      status: "Failed",
      sentAt: "2024-01-15 12:00 PM",
      deliveredAt: "-",
    },
    {
      id: "NL004",
      recipient: "User #12345",
      type: "Push",
      template: "Livestream Starting",
      status: "Delivered",
      sentAt: "2024-01-15 01:15 PM",
      deliveredAt: "2024-01-15 01:15 PM",
    },
    {
      id: "NL005",
      recipient: "seller@example.com",
      type: "Email",
      template: "Seller Payout",
      status: "Pending",
      sentAt: "2024-01-15 02:30 PM",
      deliveredAt: "-",
    },
    {
      id: "NL006",
      recipient: "+234 802 345 6789",
      type: "SMS",
      template: "Delivery Confirmation",
      status: "Delivered",
      sentAt: "2024-01-15 03:00 PM",
      deliveredAt: "2024-01-15 03:01 PM",
    },
    {
      id: "NL007",
      recipient: "buyer@example.com",
      type: "Email",
      template: "Order Confirmation",
      status: "Failed",
      sentAt: "2024-01-15 04:00 PM",
      deliveredAt: "-",
    },
    {
      id: "NL008",
      recipient: "User #67890",
      type: "Push",
      template: "Price Drop Alert",
      status: "Delivered",
      sentAt: "2024-01-15 05:00 PM",
      deliveredAt: "2024-01-15 05:00 PM",
    },
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-[#D1FAE5] text-[#065F46]";
      case "Pending":
        return "bg-[#FFF1E5] text-[#E67E22]";
      case "Failed":
        return "bg-[#FEE2E2] text-[#991B1B]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleExport = (format: string) => {
    console.log(`Exporting logs as ${format}...`);
    alert(`Exporting logs as ${format}...`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-6">
      <main className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin-dashboard/settings/notifications")}
              className="flex items-center gap-2 text-[#E67E22] hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Notifications</span>
            </button>
            <h1 className="text-2xl font-semibold text-[rgba(0,0,0,0.9)]">
              Notification Logs
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport("CSV")}
              className="px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => handleExport("XLSX")}
              className="px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              XLSX
            </button>
            <button
              onClick={() => handleExport("PDF")}
              className="px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[rgba(0,0,0,0.4)]" />
          <input
            type="text"
            placeholder="Search by recipient, log ID, or template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
          />
        </div>

        {/* Logs Table */}
        <div
          className="bg-white overflow-hidden"
          style={{
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(0,0,0,0.1)]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[rgba(0,0,0,0.7)]">
                    Log ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[rgba(0,0,0,0.7)]">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[rgba(0,0,0,0.7)]">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[rgba(0,0,0,0.7)]">
                    Template
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[rgba(0,0,0,0.7)]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[rgba(0,0,0,0.7)]">
                    Sent At
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[rgba(0,0,0,0.7)]">
                    Delivered At
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr
                    key={log.id}
                    className={`${
                      index !== logs.length - 1
                        ? "border-b border-[rgba(0,0,0,0.1)]"
                        : ""
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-6 py-4 text-sm text-[rgba(0,0,0,0.9)]">
                      {log.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-[rgba(0,0,0,0.9)]">
                      {log.recipient}
                    </td>
                    <td className="px-6 py-4 text-sm text-[rgba(0,0,0,0.9)]">
                      {log.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-[rgba(0,0,0,0.9)]">
                      {log.template}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[rgba(0,0,0,0.7)]">
                      {log.sentAt}
                    </td>
                    <td className="px-6 py-4 text-sm text-[rgba(0,0,0,0.7)]">
                      {log.deliveredAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between">
            <p className="text-sm text-[rgba(0,0,0,0.7)]">
              Showing 1 to 8 of 8 logs
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg text-sm font-medium text-[rgba(0,0,0,0.4)] cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-4 py-2 bg-[#E67E22] text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button
                disabled
                className="px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg text-sm font-medium text-[rgba(0,0,0,0.4)] cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}