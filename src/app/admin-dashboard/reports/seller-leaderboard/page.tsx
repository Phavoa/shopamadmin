"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import {
  useGetSellerLeaderboardQuery,
  useGetFinancialStatsQuery,
  FinanceOverviewPeriod,
  exportSellerLeaderboardCsv,
} from "@/api/adminDashboardApi";

// Trophy Icon
const TrophyIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M21.75 6.1875H19.3125V4.5C19.3125 4.35082 19.2532 4.20774 19.1477 4.10225C19.0423 3.99676 18.8992 3.9375 18.75 3.9375H5.25C5.10082 3.9375 4.95774 3.99676 4.85225 4.10225C4.74676 4.20774 4.6875 4.35082 4.6875 4.5V6.1875H2.25C1.9019 6.1875 1.56806 6.32578 1.32192 6.57192C1.07578 6.81806 0.9375 7.1519 0.9375 7.5V9C0.9375 9.94483 1.31283 10.851 1.98093 11.5191C2.64903 12.1872 3.55517 12.5625 4.5 12.5625H4.98187C5.40072 13.9857 6.24254 15.2478 7.39557 16.1813C8.5486 17.1149 9.9583 17.6756 11.4375 17.7891V20.4375H9C8.85082 20.4375 8.70774 20.4968 8.60225 20.6023C8.49676 20.7077 8.4375 20.8508 8.4375 21C8.4375 21.1492 8.49676 21.2923 8.60225 21.3977C8.70774 21.5032 8.85082 21.5625 9 21.5625H15C15.1492 21.5625 15.2923 21.5032 15.3977 21.3977C15.5032 21.2923 15.5625 21.1492 15.5625 21C15.5625 20.8508 15.5032 20.7077 15.3977 20.6023C15.2923 20.4968 15.1492 20.4375 15 20.4375H12.5625V17.7891C15.6038 17.5528 18.1341 15.4172 18.9956 12.5625H19.5C20.4448 12.5625 21.351 12.1872 22.0191 11.5191C22.6872 10.851 23.0625 9.94483 23.0625 9V7.5C23.0625 7.1519 22.9242 6.81806 22.6781 6.57192C22.4319 6.32578 22.0981 6.1875 21.75 6.1875ZM4.5 11.4375C3.85353 11.4375 3.23355 11.1807 2.77643 10.7236C2.31931 10.2665 2.0625 9.64647 2.0625 9V7.5C2.0625 7.45027 2.08225 7.40258 2.11742 7.36742C2.15258 7.33225 2.20027 7.3125 2.25 7.3125H4.6875V10.5C4.68841 10.8135 4.70876 11.1266 4.74844 11.4375H4.5ZM18.1875 10.4156C18.1875 13.8488 15.4331 16.6622 12.0469 16.6875C11.2304 16.6937 10.4207 16.5382 9.66462 16.23C8.9085 15.9218 8.22085 15.4671 7.64132 14.8919C7.06178 14.3167 6.60182 13.6325 6.28794 12.8787C5.97406 12.125 5.81248 11.3165 5.8125 10.5V5.0625H18.1875V10.4156ZM21.9375 9C21.9375 9.64647 21.6807 10.2665 21.2236 10.7236C20.7665 11.1807 20.1465 11.4375 19.5 11.4375H19.2403C19.2881 11.099 19.3122 10.7575 19.3125 10.4156V7.3125H21.75C21.7997 7.3125 21.8474 7.33225 21.8826 7.36742C21.9177 7.40258 21.9375 7.45027 21.9375 7.5V9Z" fill="#E67E22"/>
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

const PERIOD_OPTIONS: { label: string; value: FinanceOverviewPeriod }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

export default function SellerLeaderboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<FinanceOverviewPeriod>("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const LIMIT = 10;

  const { data, isLoading, error, isFetching } = useGetSellerLeaderboardQuery({
    period: selectedPeriod,
    page: currentPage,
    limit: LIMIT,
  });

  const { data: kpiData, isLoading: kpiLoading } = useGetFinancialStatsQuery();
  const stats = kpiData?.data;

  const leaderboardResponse = data?.data;
  const items = leaderboardResponse?.items ?? [];
  const top3 = leaderboardResponse?.top3 ?? [];
  const totalItems = leaderboardResponse?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / LIMIT));

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { background: "#E67E22", color: "#FFF" };
    if (rank === 2) return { background: "#374151", color: "#FFF" };
    if (rank === 3) return { background: "#6B7280", color: "#FFF" };
    return { background: "#F3F4F6", color: "#374151" };
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await exportSellerLeaderboardCsv({
        period: selectedPeriod,
      });
    } catch {
      alert("Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Combine top3 and items if top3 is not empty, but ensure no duplicates
  // Typically top3 are just the first 3 of the items or a subset
  // If items contains everyone including top3, just use items.

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Seller Leaderboard (Admin Reports)</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Seller"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[320px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Top Seller GMV */}
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
              <p className="text-sm text-gray-700">Top Seller GMV</p>
              <TrophyIcon />
            </div>
            <div>
              {isLoading || kpiLoading ? (
                <div className="h-9 w-24 bg-gray-100 animate-pulse rounded" />
              ) : (
                <h3 className="text-3xl font-bold text-black mb-1">
                  {top3[0] ? fmtKobo(top3[0].gmvKobo) : "—"}
                </h3>
              )}
              <p className="text-xs text-gray-600">{top3[0]?.shopName || "—"}</p>
            </div>
          </div>

          {/* Total Sellers Ranked */}
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
              <p className="text-sm text-gray-700">Total Sellers Ranked</p>
              <TrophyIcon />
            </div>
            <div>
              {isLoading ? (
                <div className="h-9 w-24 bg-gray-100 animate-pulse rounded" />
              ) : (
                <h3 className="text-3xl font-bold text-black mb-1">{totalItems.toLocaleString()}</h3>
              )}
              <p className="text-xs text-gray-600">Across all categories</p>
            </div>
          </div>

          {/* Avg Orders per Top Seller */}
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
              <p className="text-sm text-gray-700">Avg Top Seller Orders</p>
              <TrophyIcon />
            </div>
            <div>
              {isLoading ? (
                <div className="h-9 w-24 bg-gray-100 animate-pulse rounded" />
              ) : (
                <h3 className="text-3xl font-bold text-black mb-1">
                  {top3.length > 0
                    ? Math.round(top3.reduce((acc, s) => acc + s.totalOrders, 0) / top3.length)
                    : "—"}
                </h3>
              )}
              <p className="text-xs text-gray-600">Average of Top 3</p>
            </div>
          </div>

          {/* ShopAM Revenue (Total) */}
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
              <p className="text-sm text-gray-700">ShopAM Revenue</p>
              <TrophyIcon />
            </div>
            <div>
              {kpiLoading ? (
                <div className="h-9 w-24 bg-gray-100 animate-pulse rounded" />
              ) : (
                <h3 className="text-3xl font-bold text-black mb-1">
                  {stats ? fmtKobo(stats?.shopamRevenue?.total) : "—"}
                </h3>
              )}
              <p className="text-xs text-gray-600">Total platform earnings</p>
            </div>
          </div>
        </div>

        {/* Filter and Export Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => {
                setSelectedPeriod(e.target.value as FinanceOverviewPeriod);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportCsv}
              disabled={isExporting || isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-opacity"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Export: CSV"}
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 opacity-50 cursor-not-allowed" disabled>
              XLSX
            </button>
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 opacity-50 cursor-not-allowed" disabled>
              PDF
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">Failed to load leaderboard. Please try again.</p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Rank</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Seller</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Orders</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">GMV</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Rating</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching ? (
                Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {Array(7)
                        .fill(null)
                        .map((__, j) => (
                          <td key={j} className="py-4 px-6">
                            <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
                          </td>
                        ))}
                    </tr>
                  ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
                    No sellers found in the leaderboard for this period.
                  </td>
                </tr>
              ) : (
                items.map((seller, index) => (
                  <tr key={seller.sellerId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div
                        className="flex items-center justify-center font-semibold text-sm"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          ...getRankStyle(seller.rank),
                        }}
                      >
                        {seller.rank}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-black">
                      <div className="font-medium">{seller.shopName}</div>
                      <div className="text-xs text-gray-400">{seller.sellerId}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-black">{seller.totalOrders.toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-black">{fmtKobo(seller.gmvKobo)}</td>
                    <td className="py-4 px-6 text-sm text-black">{seller.ratingAverage.toFixed(1)} / 5</td>
                    <td className="py-4 px-6 text-sm text-black">{seller.businessCategory}</td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          seller.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {seller.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalItems > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * LIMIT + 1} to {Math.min(currentPage * LIMIT, totalItems)} of{" "}
              {totalItems} sellers
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  border: "0.2px solid rgba(0,0,0,0.3)",
                  background: "#F4F4F4",
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="flex items-center justify-center font-medium text-sm text-white"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "#E67E22",
                }}
              >
                {currentPage}
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  border: "0.2px solid rgba(0,0,0,0.3)",
                  background: "#F4F4F4",
                }}
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
