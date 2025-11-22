"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

// Bar Chart Icon
const ChartIcon = () => (
  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.375 0.5625V12.5625C12.375 12.7117 12.3157 12.8548 12.2102 12.9602C12.1048 13.0657 11.9617 13.125 11.8125 13.125C11.6633 13.125 11.5202 13.0657 11.4148 12.9602C11.3093 12.8548 11.25 12.7117 11.25 12.5625V0.5625C11.25 0.413316 11.3093 0.270242 11.4148 0.164753C11.5202 0.0592635 11.6633 0 11.8125 0C11.9617 0 12.1048 0.0592635 12.2102 0.164753C12.3157 0.270242 12.375 0.413316 12.375 0.5625ZM8.0625 3.75C7.91332 3.75 7.77024 3.80926 7.66475 3.91475C7.55926 4.02024 7.5 4.16332 7.5 4.3125V12.5625C7.5 12.7117 7.55926 12.8548 7.66475 12.9602C7.77024 13.0657 7.91332 13.125 8.0625 13.125C8.21168 13.125 8.35476 13.0657 8.46025 12.9602C8.56574 12.8548 8.625 12.7117 8.625 12.5625V4.3125C8.625 4.16332 8.56574 4.02024 8.46025 3.91475C8.35476 3.80926 8.21168 3.75 8.0625 3.75ZM4.3125 7.5C4.16332 7.5 4.02024 7.55926 3.91475 7.66475C3.80926 7.77024 3.75 7.91332 3.75 8.0625V12.5625C3.75 12.7117 3.80926 12.8548 3.91475 12.9602C4.02024 13.0657 4.16332 13.125 4.3125 13.125C4.46168 13.125 4.60476 13.0657 4.71025 12.9602C4.81574 12.8548 4.875 12.7117 4.875 12.5625V8.0625C4.875 7.91332 4.81574 7.77024 4.71025 7.66475C4.60476 7.55926 4.46168 7.5 4.3125 7.5ZM0.5625 11.25C0.413316 11.25 0.270242 11.3093 0.164752 11.4148C0.0592632 11.5202 0 11.6633 0 11.8125V12.5625C0 12.7117 0.0592632 12.8548 0.164752 12.9602C0.270242 13.0657 0.413316 13.125 0.5625 13.125C0.711684 13.125 0.854758 13.0657 0.960248 12.9602C1.06574 12.8548 1.125 12.7117 1.125 12.5625V11.8125C1.125 11.6633 1.06574 11.5202 0.960248 11.4148C0.854758 11.3093 0.711684 11.25 0.5625 11.25Z" fill="#E67E22"/>
  </svg>
);

export default function BuyerInsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This month");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Buyer Insights (Admin Reports)</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Buyer or Region"
            className="w-[320px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          {/* Total Buyers */}
          <div
            style={{
              display: "flex",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "18px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <div className="flex items-start justify-between w-full">
              <p className="text-sm text-gray-700">Total Buyers</p>
              <ChartIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">18,200</h3>
              <p className="text-xs text-green-600">+10% vs last month</p>
            </div>
          </div>

          {/* Active Buyers */}
          <div
            style={{
              display: "flex",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "18px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <div className="flex items-start justify-between w-full">
              <p className="text-sm text-gray-700">Active Buyers</p>
              <ChartIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">12,400</h3>
              <p className="text-xs text-gray-600">Logged in last 30 days</p>
            </div>
          </div>

          {/* Avg Spend per Buyer */}
          <div
            style={{
              display: "flex",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "18px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <div className="flex items-start justify-between w-full">
              <p className="text-sm text-gray-700">Avg Spend per Buyer</p>
              <ChartIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">₦48,000</h3>
              <p className="text-xs text-gray-600">This month</p>
            </div>
          </div>

          {/* Regions Covered */}
          <div
            style={{
              display: "flex",
              padding: "20px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "18px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <div className="flex items-start justify-between w-full">
              <p className="text-sm text-gray-700">Regions Covered</p>
              <ChartIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">36 States</h3>
              <p className="text-xs text-gray-600">Nigeria</p>
            </div>
          </div>
        </div>

        {/* Filter and Export Row */}
        <div className="flex items-center justify-between">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option>This month</option>
            <option>Last month</option>
            <option>Last 3 months</option>
            <option>This year</option>
          </select>

          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Export: CSV
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              XLSX
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              PDF
            </button>
          </div>
        </div>

        {/* Buyer Activity Card */}
        <div
          style={{
            padding: "20px",
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            background: "#FFF",
          }}
        >
          <h2 className="text-lg font-semibold text-black mb-6">Buyer Activity</h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-700">Active Buyers</span>
              <span className="text-sm font-medium text-black">12,400</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-700">Inactive Buyers</span>
              <span className="text-sm font-medium text-black">5,800</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">New Buyers</span>
              <span className="text-sm font-medium text-black">3,200</span>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-base font-semibold text-black mb-4">Top Buyer Regions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Lagos</span>
                <span className="text-sm font-medium text-black">6,200 buyers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Abuja</span>
                <span className="text-sm font-medium text-black">2,800 buyers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Port Harcourt</span>
                <span className="text-sm font-medium text-black">1,300 buyers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Ibadan</span>
                <span className="text-sm font-medium text-black">1,500 buyers</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Benin City</span>
                <span className="text-sm font-medium text-black">1,200 buyers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Insights Card */}
        <div
          style={{
            padding: "20px",
            borderRadius: "18px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            background: "#FFF",
          }}
        >
          <h2 className="text-lg font-semibold text-black mb-6">Spending Insights</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-medium text-black">
                    Buyer Segment
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-black">
                    Average Orders
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-black">
                    Average GMV
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-black">
                    Average Spend
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-700">Top 10% Buyers</td>
                  <td className="py-4 px-4 text-sm text-black">12</td>
                  <td className="py-4 px-4 text-sm text-black">₦1,200,000</td>
                  <td className="py-4 px-4 text-sm text-black">₦120,000</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-sm text-gray-700">Mid 40% Buyers</td>
                  <td className="py-4 px-4 text-sm text-black">12</td>
                  <td className="py-4 px-4 text-sm text-black">₦1,200,000</td>
                  <td className="py-4 px-4 text-sm text-black">₦120,000</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-700">Bottom 50% Buyers</td>
                  <td className="py-4 px-4 text-sm text-black">12</td>
                  <td className="py-4 px-4 text-sm text-black">₦1,200,000</td>
                  <td className="py-4 px-4 text-sm text-black">₦120,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}