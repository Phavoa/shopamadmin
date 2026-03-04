"use client";

import React, { useState } from "react";
import { Download, Loader2, AlertCircle } from "lucide-react";
import {
  useGetWeeklySummaryQuery,
  exportWeeklySummaryCsv,
  type WeeklySummaryPeriod,
} from "@/api/weeklySummaryApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtKobo = (kobo: string | number | undefined) => {
  if (kobo === undefined || kobo === null) return "₦0";
  const n = typeof kobo === "string" ? parseInt(kobo, 10) : kobo;
  if (isNaN(n)) return "₦0";
  const naira = n / 100;
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
  if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(0)}K`;
  return `₦${naira.toLocaleString("en-NG")}`;
};

const TrendingIcon = () => (
  <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.125 15.5625C19.125 15.7117 19.0657 15.8548 18.9602 15.9602C18.8548 16.0657 18.7117 16.125 18.5625 16.125H0.5625C0.413316 16.125 0.270242 16.0657 0.164752 15.9602C0.0592632 15.8548 0 15.7117 0 15.5625V0.5625C0 0.413316 0.0592632 0.270242 0.164752 0.164752C0.270242 0.0592632 0.413316 0 0.5625 0C0.711684 0 0.854758 0.0592632 0.960248 0.164752C1.06574 0.270242 1.125 0.413316 1.125 0.5625V11.205L6.165 6.165C6.27047 6.05966 6.41344 6.00049 6.5625 6.00049C6.71156 6.00049 6.85453 6.05966 6.96 6.165L9.5625 8.76656L14.955 3.375H12.5625C12.4133 3.375 12.2702 3.31574 12.1648 3.21025C12.0593 3.10476 12 2.96168 12 2.8125C12 2.66332 12.0593 2.52024 12.1648 2.41475C12.2702 2.30926 12.4133 2.25 12.5625 2.25H16.3125C16.4617 2.25 16.6048 2.30926 16.7102 2.41475C16.8157 2.52024 16.875 2.66332 16.875 2.8125V6.5625C16.875 6.71168 16.8157 6.85476 16.7102 6.96025C16.6048 7.06574 16.4617 7.125 16.3125 7.125C16.1633 7.125 16.0202 7.06574 15.9148 6.96025C15.8093 6.85476 15.75 6.71168 15.75 6.5625V4.17L9.96 9.96C9.85453 10.0653 9.71156 10.1245 9.5625 10.1245C9.41344 10.1245 9.27047 10.0653 9.165 9.96L6.5625 7.35844L1.125 12.7959V15H18.5625C18.7117 15 18.8548 15.0593 18.9602 15.1648C19.0657 15.2702 19.125 15.4133 19.125 15.5625Z" fill="#E67E22" />
  </svg>
);

const CARD_STYLE = {
  display: "flex",
  padding: "20px",
  flexDirection: "column" as const,
  alignItems: "flex-start" as const,
  gap: "18px",
  borderRadius: "18px",
  border: "0.3px solid rgba(0, 0, 0, 0.20)",
  background: "#FFF",
};

const SECTION_STYLE = {
  padding: "20px",
  borderRadius: "18px",
  border: "0.3px solid rgba(0, 0, 0, 0.20)",
  background: "#FFF",
};

const PERIOD_OPTIONS: { label: string; value: WeeklySummaryPeriod }[] = [
  { label: "This week", value: "week" },
  { label: "Today", value: "today" },
  { label: "This month", value: "month" },
  { label: "This quarter", value: "quarter" },
  { label: "This year", value: "year" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WeeklyReportsPage() {
  const [period, setPeriod] = useState<WeeklySummaryPeriod>("week");
  const [exportingCsv, setExportingCsv] = useState(false);

  const { data, isLoading, error } = useGetWeeklySummaryQuery({ period });
  const summary = data?.data;
  const kpi = summary?.kpi;
  const livestream = summary?.livestream;
  const shopping = summary?.shopping;

  const handleExportCsv = async () => {
    setExportingCsv(true);
    try {
      await exportWeeklySummaryCsv({ period });
    } catch {
      alert("CSV export failed. Please try again.");
    } finally {
      setExportingCsv(false);
    }
  };

  // Skeleton cell
  const Skel = ({ w = "w-20" }: { w?: string }) => (
    <div className={`h-4 ${w} bg-gray-100 animate-pulse rounded`} />
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-black">Weekly Reports (Admin Summary)</h1>
          {summary?.period && (
            <p className="text-sm text-gray-500 mt-0.5">{summary.period}</p>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Error state */}
        {error && !isLoading && (
          <div className="flex items-center gap-2 text-red-500 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Failed to load weekly summary. Please try again.</p>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          {[
            {
              label: "Weekly GMV",
              value: isLoading ? null : fmtKobo(kpi?.weeklyGmvKobo),
              sub: kpi ? `${kpi.weeklyGmvChangePercent >= 0 ? "+" : ""}${kpi.weeklyGmvChangePercent}% vs last week` : "",
              subColor: (kpi?.weeklyGmvChangePercent ?? 0) >= 0 ? "text-green-600" : "text-red-500",
            },
            {
              label: "Weekly Orders",
              value: isLoading ? null : (kpi?.weeklyOrders?.toLocaleString() ?? "—"),
              sub: kpi ? `${kpi.weeklyOrdersChangePercent >= 0 ? "+" : ""}${kpi.weeklyOrdersChangePercent}% vs last week` : "",
              subColor: (kpi?.weeklyOrdersChangePercent ?? 0) >= 0 ? "text-green-600" : "text-red-500",
            },
            {
              label: "Active Sellers",
              value: isLoading ? null : (kpi?.activeSellers?.toLocaleString() ?? "—"),
              sub: "This period",
              subColor: "text-gray-600",
            },
            {
              label: "Net Revenue",
              value: isLoading ? null : fmtKobo(kpi?.netRevenueKobo),
              sub: "After refunds",
              subColor: "text-gray-600",
            },
          ].map(({ label, value, sub, subColor }) => (
            <div key={label} style={CARD_STYLE}>
              <div className="flex items-start justify-between w-full">
                <p className="text-sm text-gray-700">{label}</p>
                <TrendingIcon />
              </div>
              <div>
                {value === null ? (
                  <div className="h-9 w-28 bg-gray-100 animate-pulse rounded mb-1" />
                ) : (
                  <h3 className="text-3xl font-bold text-black mb-1">{value}</h3>
                )}
                <p className={`text-xs ${subColor}`}>{isLoading ? <Skel w="w-32" /> : sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter and Export Row */}
        <div className="flex items-center justify-between">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as WeeklySummaryPeriod)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none"
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              onClick={handleExportCsv}
              disabled={exportingCsv || isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-opacity"
            >
              {exportingCsv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export CSV
            </button>
            <button disabled className="px-4 py-2 text-sm border border-gray-300 rounded-lg opacity-50 cursor-not-allowed">XLSX</button>
            <button disabled className="px-4 py-2 text-sm border border-gray-300 rounded-lg opacity-50 cursor-not-allowed">PDF</button>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Livestream Performance */}
          <div style={SECTION_STYLE}>
            <h2 className="text-lg font-semibold text-black mb-6">Livestream Performance</h2>

            <div className="space-y-4 mb-6">
              {[
                { label: "Total Hours", value: isLoading ? null : `${livestream?.totalHours ?? "—"} hrs` },
                { label: "Avg Viewers", value: isLoading ? null : (livestream?.avgViewers ?? 0).toLocaleString() },
                { label: "Items Sold", value: isLoading ? null : (livestream?.itemsSold ?? 0).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{label}</span>
                  {value === null ? <Skel /> : <span className="text-sm font-medium text-black">{value}</span>}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black mb-3">Top 3 Sellers:</h3>
              <div className="space-y-2">
                {isLoading ? (
                  Array(3).fill(null).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skel w="w-28" /><Skel w="w-16" />
                    </div>
                  ))
                ) : (livestream?.top3Sellers ?? []).length > 0 ? (
                  livestream!.top3Sellers.map((s) => (
                    <div key={s.sellerId} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{s.shopName}</span>
                      <span className="text-sm font-medium text-black">{fmtKobo(s.revenueKobo)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No data</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-black mb-3">Logistics</h3>
              <div className="space-y-2">
                {[
                  { label: "Shipments", value: isLoading ? null : (livestream?.shipments ?? 0).toLocaleString() },
                  { label: "On-time Delivery", value: isLoading ? null : `${livestream?.onTimeDeliveryPct ?? 0}%` },
                  { label: "Avg Delivery Time", value: isLoading ? null : `${livestream?.avgDeliveryTimeDays ?? 0} days` },
                  { label: "Active Riders", value: isLoading ? null : (livestream?.activeRiders ?? 0).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{label}</span>
                    {value === null ? <Skel /> : <span className="text-sm font-medium text-black">{value}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shopping Performance */}
          <div style={SECTION_STYLE}>
            <h2 className="text-lg font-semibold text-black mb-6">Shopping Performance</h2>

            <div className="space-y-4 mb-6">
              {[
                { label: "GMV", value: isLoading ? null : fmtKobo(shopping?.gmvKobo) },
                { label: "Orders", value: isLoading ? null : (shopping?.orders ?? 0).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{label}</span>
                  {value === null ? <Skel /> : <span className="text-sm font-medium text-black">{value}</span>}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-black mb-3">Top 3 Sellers:</h3>
              <div className="space-y-2">
                {isLoading ? (
                  Array(3).fill(null).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skel w="w-28" /><Skel w="w-16" />
                    </div>
                  ))
                ) : (shopping?.top3Sellers ?? []).length > 0 ? (
                  shopping!.top3Sellers.map((s) => (
                    <div key={s.sellerId} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{s.shopName}</span>
                      <span className="text-sm font-medium text-black">{fmtKobo(s.revenueKobo)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No data</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-black mb-3">Disputes</h3>
              <div className="space-y-2">
                {[
                  { label: "Opened", value: isLoading ? null : (shopping?.disputes?.opened ?? 0).toString() },
                  { label: "Resolved %", value: isLoading ? null : `${shopping?.disputes?.resolvedPct ?? 0}%` },
                  { label: "Pending", value: isLoading ? null : (shopping?.disputes?.pending ?? 0).toString() },
                  { label: "Avg Resolution", value: isLoading ? null : `${shopping?.disputes?.avgResolutionDays ?? 0} days` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{label}</span>
                    {value === null ? <Skel /> : <span className="text-sm font-medium text-black">{value}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}