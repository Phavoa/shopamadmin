"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

// Trending Icon
const TrendingIcon = () => (
  <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.125 15.5625C19.125 15.7117 19.0657 15.8548 18.9602 15.9602C18.8548 16.0657 18.7117 16.125 18.5625 16.125H0.5625C0.413316 16.125 0.270242 16.0657 0.164752 15.9602C0.0592632 15.8548 0 15.7117 0 15.5625V0.5625C0 0.413316 0.0592632 0.270242 0.164752 0.164752C0.270242 0.0592632 0.413316 0 0.5625 0C0.711684 0 0.854758 0.0592632 0.960248 0.164752C1.06574 0.270242 1.125 0.413316 1.125 0.5625V11.205L6.165 6.165C6.27047 6.05966 6.41344 6.00049 6.5625 6.00049C6.71156 6.00049 6.85453 6.05966 6.96 6.165L9.5625 8.76656L14.955 3.375H12.5625C12.4133 3.375 12.2702 3.31574 12.1648 3.21025C12.0593 3.10476 12 2.96168 12 2.8125C12 2.66332 12.0593 2.52024 12.1648 2.41475C12.2702 2.30926 12.4133 2.25 12.5625 2.25H16.3125C16.4617 2.25 16.6048 2.30926 16.7102 2.41475C16.8157 2.52024 16.875 2.66332 16.875 2.8125V6.5625C16.875 6.71168 16.8157 6.85476 16.7102 6.96025C16.6048 7.06574 16.4617 7.125 16.3125 7.125C16.1633 7.125 16.0202 7.06574 15.9148 6.96025C15.8093 6.85476 15.75 6.71168 15.75 6.5625V4.17L9.96 9.96C9.85453 10.0653 9.71156 10.1245 9.5625 10.1245C9.41344 10.1245 9.27047 10.0653 9.165 9.96L6.5625 7.35844L1.125 12.7959V15H18.5625C18.7117 15 18.8548 15.0593 18.9602 15.1648C19.0657 15.2702 19.125 15.4133 19.125 15.5625Z" fill="#E67E22"/>
  </svg>
);

export default function WeeklyReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("This week");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Weekly Reports (Admin Summary)</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Week, seller, or category"
            className="w-[320px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          {/* Weekly GMV */}
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
              <p className="text-sm text-gray-700">Weekly GMV</p>
              <TrendingIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">₦14.2M</h3>
              <p className="text-xs text-green-600">+12% vs last week</p>
            </div>
          </div>

          {/* Weekly Orders */}
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
              <p className="text-sm text-gray-700">Weekly Orders</p>
              <TrendingIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">3,120</h3>
              <p className="text-xs text-green-600">+8% vs last week</p>
            </div>
          </div>

          {/* Active Sellers */}
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
              <p className="text-sm text-gray-700">Active Sellers</p>
              <TrendingIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">620</h3>
              <p className="text-xs text-gray-600">This week</p>
            </div>
          </div>

          {/* Net Revenue */}
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
              <p className="text-sm text-gray-700">Net Revenue</p>
              <TrendingIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">₦720K</h3>
              <p className="text-xs text-gray-600">After refunds</p>
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
            <option>This week</option>
            <option>Last week</option>
            <option>Last 2 weeks</option>
            <option>Last month</option>
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

        {/* Performance Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Livestream Performance */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-6">
              Livestream Performance
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total Hours</span>
                <span className="text-sm font-medium text-black">210 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Avg Viewers</span>
                <span className="text-sm font-medium text-black">160</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Items Sold</span>
                <span className="text-sm font-medium text-black">2,400</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black mb-3">Top 3 Sellers:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Next Gadgets</span>
                  <span className="text-sm font-medium text-black">₦3.8M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">TechHub</span>
                  <span className="text-sm font-medium text-black">₦2.5M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Mary K Stores</span>
                  <span className="text-sm font-medium text-black">₦2.4M</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-black mb-3">Logistics</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Shipments</span>
                  <span className="text-sm font-medium text-black">2,980</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">On-time Delivery</span>
                  <span className="text-sm font-medium text-black">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Avg Delivery Time</span>
                  <span className="text-sm font-medium text-black">2.4 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Active Riders</span>
                  <span className="text-sm font-medium text-black">320</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shopping Performance */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-6">
              Shopping Performance
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">GMV</span>
                <span className="text-sm font-medium text-black">₦6.5M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Orders</span>
                <span className="text-sm font-medium text-black">1,540</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black mb-3">Top 3 Sellers:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Phone City</span>
                  <span className="text-sm font-medium text-black">₦3.8M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Gadget Palace</span>
                  <span className="text-sm font-medium text-black">₦2.5M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Mary K Stores</span>
                  <span className="text-sm font-medium text-black">₦2.4M</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-black mb-3">Disputes</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Opened</span>
                  <span className="text-sm font-medium text-black">120</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Resolved %</span>
                  <span className="text-sm font-medium text-black">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Pending</span>
                  <span className="text-sm font-medium text-black">26</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Avg Resolution</span>
                  <span className="text-sm font-medium text-black">2.8 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}