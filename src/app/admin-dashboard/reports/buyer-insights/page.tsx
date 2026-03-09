"use client";

import React, { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { useGetBuyerInsightsQuery } from "@/api/adminDashboardApi";

// Bar Chart Icon
const ChartIcon = () => (
  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.375 0.5625V12.5625C12.375 12.7117 12.3157 12.8548 12.2102 12.9602C12.1048 13.0657 11.9617 13.125 11.8125 13.125C11.6633 13.125 11.5202 13.0657 11.4148 12.9602C11.3093 12.8548 11.25 12.7117 11.25 12.5625V0.5625C11.25 0.413316 11.3093 0.270242 11.4148 0.164753C11.5202 0.0592635 11.6633 0 11.8125 0C11.9617 0 12.1048 0.0592635 12.2102 0.164753C12.3157 0.270242 12.375 0.413316 12.375 0.5625ZM8.0625 3.75C7.91332 3.75 7.77024 3.80926 7.66475 3.91475C7.55926 4.02024 7.5 4.16332 7.5 4.3125V12.5625C7.5 12.7117 7.55926 12.8548 7.66475 12.9602C7.77024 13.0657 7.91332 13.125 8.0625 13.125C8.21168 13.125 8.35476 13.0657 8.46025 12.9602C8.56574 12.8548 8.625 12.7117 8.625 12.5625V4.3125C8.625 4.16332 8.56574 4.02024 8.46025 3.91475C8.35476 3.80926 8.21168 3.75 8.0625 3.75ZM4.3125 7.5C4.16332 7.5 4.02024 7.55926 3.91475 7.66475C3.80926 7.77024 3.75 7.91332 3.75 8.0625V12.5625C3.75 12.7117 3.80926 12.8548 3.91475 12.9602C4.02024 13.0657 4.16332 13.125 4.3125 13.125C4.46168 13.125 4.60476 13.0657 4.71025 12.9602C4.81574 12.8548 4.875 12.7117 4.875 12.5625V8.0625C4.875 7.91332 4.81574 7.77024 4.71025 7.66475C4.60476 7.55926 4.46168 7.5 4.3125 7.5ZM0.5625 11.25C0.413316 11.25 0.270242 11.3093 0.164752 11.4148C0.0592632 11.5202 0 11.6633 0 11.8125V12.5625C0 12.7117 0.0592632 12.8548 0.164752 12.9602C0.270242 13.0657 0.413316 13.125 0.5625 13.125C0.711684 13.125 0.854758 13.0657 0.960248 12.9602C1.06574 12.8548 1.125 12.7117 1.125 12.5625V11.8125C1.125 11.6633 1.06574 11.5202 0.960248 11.4148C0.854758 11.3093 0.711684 11.25 0.5625 11.25Z" fill="#E67E22"/>
  </svg>
);

const fmtKobo = (kobo: string | number | undefined) => {
  if (kobo === undefined) return "—";
  const n = typeof kobo === "string" ? parseInt(kobo, 10) : kobo;
  if (isNaN(n)) return "₦0";
  const naira = n / 100;
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
  if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(0)}K`;
  return `₦${naira.toLocaleString("en-NG")}`;
};

type PeriodValue = "today" | "week" | "month" | "quarter" | "year";
const PERIOD_OPTIONS: { label: string; value: PeriodValue }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Quarter", value: "quarter" },
  { label: "This Year", value: "year" },
];

export default function BuyerInsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodValue>("month");

  const { data, isLoading, error } = useGetBuyerInsightsQuery({
    period: selectedPeriod,
  });

  const insights = data?.data;

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
              <h3 className="text-3xl font-bold text-black mb-1">
                {isLoading ? "..." : (insights?.totalBuyers.toLocaleString() || "0")}
              </h3>
              <p className="text-xs text-green-600">Registered accounts</p>
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
              <h3 className="text-3xl font-bold text-black mb-1">
                {isLoading ? "..." : (insights?.activeBuyers.toLocaleString() || "0")}
              </h3>
              <p className="text-xs text-gray-600">Active in period</p>
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
              <h3 className="text-3xl font-bold text-black mb-1">
                {isLoading ? "..." : fmtKobo(insights?.avgSpendPerBuyerKobo)}
              </h3>
              <p className="text-xs text-gray-600">This period</p>
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
              <h3 className="text-3xl font-bold text-black mb-1">
                {isLoading ? "..." : (insights?.regionsCovered || "0")}
              </h3>
              <p className="text-xs text-gray-600">Major cities/states</p>
            </div>
          </div>
        </div>

        {/* Filter and Export Row */}
        <div className="flex items-center justify-between">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as PeriodValue)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
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
              <span className="text-sm font-medium text-black">
                {isLoading ? "..." : (insights?.activity.activeBuyers.toLocaleString() || "0")}
              </span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-700">Inactive Buyers</span>
              <span className="text-sm font-medium text-black">
                {isLoading ? "..." : (insights?.activity.inactiveBuyers.toLocaleString() || "0")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">New Buyers</span>
              <span className="text-sm font-medium text-black">
                {isLoading ? "..." : (insights?.activity.newBuyers.toLocaleString() || "0")}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-base font-semibold text-black mb-4">Top Buyer Regions</h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-sm text-gray-400">Loading regions...</div>
              ) : (insights?.topRegions.length === 0 ? (
                <div className="text-sm text-gray-400">No regions found</div>
              ) : (
                insights?.topRegions.map((region, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{region.name}</span>
                    <span className="text-sm font-medium text-black">{region.buyerCount.toLocaleString()} buyers</span>
                  </div>
                ))
              ))}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400">Loading insights...</td>
                  </tr>
                ) : (insights?.segments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400">No segment data available</td>
                  </tr>
                ) : (
                  insights?.segments.map((seg, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-4 px-4 text-sm text-gray-700">{seg.segment}</td>
                      <td className="py-4 px-4 text-sm text-black">{seg.avgOrders}</td>
                      <td className="py-4 px-4 text-sm text-black">{fmtKobo(seg.avgGmvKobo)}</td>
                      <td className="py-4 px-4 text-sm text-black">{fmtKobo(seg.avgSpendKobo)}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
