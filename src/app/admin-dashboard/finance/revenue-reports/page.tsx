"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download, Loader2, AlertCircle } from "lucide-react";
import {
  useGetRevenueReportsQuery,
  exportRevenueReportCsv,
  type ReportPeriod,
  type RevenueReportParams,
} from "@/api/revenueReportsApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtKobo = (kobo: string | number) => {
  const n = typeof kobo === "string" ? parseInt(kobo, 10) : kobo;
  if (isNaN(n)) return "₦0";
  const naira = n / 100;
  if (naira >= 1_000_000) return `₦${(naira / 1_000_000).toFixed(1)}M`;
  if (naira >= 1_000) return `₦${(naira / 1_000).toFixed(0)}K`;
  return `₦${naira.toLocaleString("en-NG")}`;
};

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.5625 15.75C18.561 16.8933 18.1062 17.9893 17.2978 18.7978C16.4893 19.6062 15.3933 20.061 14.25 20.0625H12.5625V21.75C12.5625 21.8992 12.5032 22.0423 12.3977 22.1477C12.2923 22.2532 12.1492 22.3125 12 22.3125C11.8508 22.3125 11.7077 22.2532 11.6023 22.1477C11.4968 22.0423 11.4375 21.8992 11.4375 21.75V20.0625H9.75C8.60671 20.061 7.51067 19.6062 6.70225 18.7978C5.89382 17.9893 5.43899 16.8933 5.4375 15.75C5.4375 15.6008 5.49676 15.4577 5.60225 15.3523C5.70774 15.2468 5.85082 15.1875 6 15.1875C6.14918 15.1875 6.29226 15.2468 6.39775 15.3523C6.50324 15.4577 6.5625 15.6008 6.5625 15.75C6.5625 16.5954 6.89832 17.4061 7.4961 18.0039C8.09387 18.6017 8.90462 18.9375 9.75 18.9375H14.25C15.0954 18.9375 15.9061 18.6017 16.5039 18.0039C17.1017 17.4061 17.4375 16.5954 17.4375 15.75C17.4375 14.9046 17.1017 14.0939 16.5039 13.4961C15.9061 12.8983 15.0954 12.5625 14.25 12.5625H10.5C9.35625 12.5625 8.25935 12.1081 7.4506 11.2994C6.64185 10.4906 6.1875 9.39375 6.1875 8.25C6.1875 7.10625 6.64185 6.00935 7.4506 5.2006C8.25935 4.39185 9.35625 3.9375 10.5 3.9375H11.4375V2.25C11.4375 2.10082 11.4968 1.95774 11.6023 1.85225C11.7077 1.74676 11.8508 1.6875 12 1.6875C12.1492 1.6875 12.2923 1.74676 12.3977 1.85225C12.5032 1.95774 12.5625 2.10082 12.5625 2.25V3.9375H13.5C14.6433 3.93899 15.7393 4.39382 16.5478 5.20225C17.3562 6.01067 17.811 7.10671 17.8125 8.25C17.8125 8.39918 17.7532 8.54226 17.6477 8.64775C17.5423 8.75324 17.3992 8.8125 17.25 8.8125C17.1008 8.8125 16.9577 8.75324 16.8523 8.64775C16.7468 8.54226 16.6875 8.39918 16.6875 8.25C16.6875 7.40462 16.3517 6.59387 15.7539 5.9961C15.1561 5.39832 14.3454 5.0625 13.5 5.0625H10.5C9.65462 5.0625 8.84387 5.39832 8.2461 5.9961C7.64832 6.59387 7.3125 7.40462 7.3125 8.25C7.3125 9.09538 7.64832 9.90613 8.2461 10.5039C8.84387 11.1017 9.65462 11.4375 10.5 11.4375H14.25C15.3933 11.439 16.4893 11.8938 17.2978 12.7022C18.1062 13.5107 18.561 14.6067 18.5625 15.75Z" fill="#E67E22" />
  </svg>
);

const PERIOD_OPTIONS: { label: string; value: ReportPeriod }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Quarter", value: "quarter" },
  { label: "This Year", value: "year" },
];

const CARD_STYLE = {
  display: "flex",
  width: "100%",
  padding: "20px",
  flexDirection: "column" as const,
  alignItems: "flex-start" as const,
  gap: "18px",
  borderRadius: "18px",
  border: "0.3px solid rgba(0, 0, 0, 0.20)",
  background: "#FFF",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RevenueReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("week");
  const [searchSeller, setSearchSeller] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exportingCsv, setExportingCsv] = useState(false);
  const LIMIT = 20;

  const queryParams: RevenueReportParams = {
    period,
    page: currentPage,
    limit: LIMIT,
    ...(searchSeller ? { sellerId: searchSeller } : {}),
  };

  const { data, isLoading, error, isFetching } = useGetRevenueReportsQuery(queryParams);

  const summary = data?.data?.summary;
  const items = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // ── CSV export ──────────────────────────────────────────────────────────────
  const handleExportCsv = async () => {
    setExportingCsv(true);
    try {
      await exportRevenueReportCsv({ period });
    } catch {
      alert("CSV export failed. Please try again.");
    } finally {
      setExportingCsv(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Revenue Reports</h1>
        <div className="flex items-center gap-3">
          {/* Period filter */}
          <select
            value={period}
            onChange={(e) => { setPeriod(e.target.value as ReportPeriod); setCurrentPage(1); }}
            className="h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {/* Search by seller name placeholder */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search seller"
              value={searchSeller}
              onChange={(e) => { setSearchSeller(e.target.value); setCurrentPage(1); }}
              className="w-[220px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            {
              label: "Total GMV",
              value: summary ? fmtKobo(summary.totalGmvKobo) : "—",
              sub: `${summary?.blendedCommissionRate ?? 0}% blended rate`,
            },
            {
              label: "Total Commission",
              value: summary ? fmtKobo(summary.totalCommissionKobo) : "—",
              sub: "Platform earnings",
            },
            {
              label: "Total Refunds",
              value: summary ? fmtKobo(summary.totalRefundsKobo) : "—",
              sub: "All sellers",
            },
            {
              label: "Net ShopAM Revenue",
              value: summary ? fmtKobo(summary.netShopamRevenueKobo) : "—",
              sub: "After refunds",
            },
          ].map(({ label, value, sub }) => (
            <div key={label} style={CARD_STYLE}>
              <div className="flex items-start justify-between w-full">
                <p className="text-sm text-gray-700">{label}</p>
                <DollarSignIcon />
              </div>
              <div>
                {isLoading ? (
                  <div className="h-9 w-24 bg-gray-100 animate-pulse rounded" />
                ) : (
                  <h3 className="text-3xl font-bold text-black mb-1">{value}</h3>
                )}
                <p className="text-xs text-gray-600">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handleExportCsv}
            disabled={exportingCsv || isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-opacity"
          >
            {exportingCsv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export CSV
          </button>
          <button
            disabled
            title="Download CSV first, then convert client-side"
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg opacity-50 cursor-not-allowed"
          >
            XLSX
          </button>
          <button
            disabled
            title="Download CSV first, then convert client-side"
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg opacity-50 cursor-not-allowed"
          >
            PDF
          </button>
        </div>

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex items-center gap-2 text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Failed to load revenue reports. Please try again.</p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                {["Report ID", "Seller", "Orders", "GMV", "Comm %", "Commission", "Refunds", "Net Revenue", "Period"].map((h) => (
                  <th key={h} className="text-left py-4 px-6 text-sm font-medium text-black whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                Array(6).fill(null).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {Array(9).fill(null).map((__, j) => (
                      <td key={j} className="py-4 px-6">
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-gray-400 text-sm">
                    No revenue report data for this period.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.reportId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-black font-mono">{r.reportId}</td>
                    <td className="py-4 px-6 text-sm text-black">
                      <div className="font-medium">{r.sellerName}</div>
                      <div className="text-xs text-gray-400">{r.shopName}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-black">{r.totalOrders}</td>
                    <td className="py-4 px-6 text-sm text-black">{fmtKobo(r.gmvKobo)}</td>
                    <td className="py-4 px-6 text-sm text-black">{r.commissionRate}%</td>
                    <td className="py-4 px-6 text-sm text-black">{fmtKobo(r.commissionKobo)}</td>
                    <td className="py-4 px-6 text-sm text-red-500">{fmtKobo(r.refundsKobo)}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-green-700">{fmtKobo(r.netRevenueKobo)}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{r.period}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && total > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * LIMIT + 1}–{Math.min(currentPage * LIMIT, total)} of {total} reports
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
                style={{ width: 40, height: 40, borderRadius: 12, border: "0.2px solid rgba(0,0,0,0.3)", background: "#F4F4F4" }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="flex items-center justify-center font-medium text-sm text-white"
                style={{ width: 40, height: 40, borderRadius: 12, background: "#E67E22" }}
              >
                {currentPage}
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
                style={{ width: 40, height: 40, borderRadius: 12, border: "0.2px solid rgba(0,0,0,0.3)", background: "#F4F4F4" }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
