"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// Trophy Icon
const TrophyIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M21.75 6.1875H19.3125V4.5C19.3125 4.35082 19.2532 4.20774 19.1477 4.10225C19.0423 3.99676 18.8992 3.9375 18.75 3.9375H5.25C5.10082 3.9375 4.95774 3.99676 4.85225 4.10225C4.74676 4.20774 4.6875 4.35082 4.6875 4.5V6.1875H2.25C1.9019 6.1875 1.56806 6.32578 1.32192 6.57192C1.07578 6.81806 0.9375 7.1519 0.9375 7.5V9C0.9375 9.94483 1.31283 10.851 1.98093 11.5191C2.64903 12.1872 3.55517 12.5625 4.5 12.5625H4.98187C5.40072 13.9857 6.24254 15.2478 7.39557 16.1813C8.5486 17.1149 9.9583 17.6756 11.4375 17.7891V20.4375H9C8.85082 20.4375 8.70774 20.4968 8.60225 20.6023C8.49676 20.7077 8.4375 20.8508 8.4375 21C8.4375 21.1492 8.49676 21.2923 8.60225 21.3977C8.70774 21.5032 8.85082 21.5625 9 21.5625H15C15.1492 21.5625 15.2923 21.5032 15.3977 21.3977C15.5032 21.2923 15.5625 21.1492 15.5625 21C15.5625 20.8508 15.5032 20.7077 15.3977 20.6023C15.2923 20.4968 15.1492 20.4375 15 20.4375H12.5625V17.7891C15.6038 17.5528 18.1341 15.4172 18.9956 12.5625H19.5C20.4448 12.5625 21.351 12.1872 22.0191 11.5191C22.6872 10.851 23.0625 9.94483 23.0625 9V7.5C23.0625 7.1519 22.9242 6.81806 22.6781 6.57192C22.4319 6.32578 22.0981 6.1875 21.75 6.1875ZM4.5 11.4375C3.85353 11.4375 3.23355 11.1807 2.77643 10.7236C2.31931 10.2665 2.0625 9.64647 2.0625 9V7.5C2.0625 7.45027 2.08225 7.40258 2.11742 7.36742C2.15258 7.33225 2.20027 7.3125 2.25 7.3125H4.6875V10.5C4.68841 10.8135 4.70876 11.1266 4.74844 11.4375H4.5ZM18.1875 10.4156C18.1875 13.8488 15.4331 16.6622 12.0469 16.6875C11.2304 16.6937 10.4207 16.5382 9.66462 16.23C8.9085 15.9218 8.22085 15.4671 7.64132 14.8919C7.06178 14.3167 6.60182 13.6325 6.28794 12.8787C5.97406 12.125 5.81248 11.3165 5.8125 10.5V5.0625H18.1875V10.4156ZM21.9375 9C21.9375 9.64647 21.6807 10.2665 21.2236 10.7236C20.7665 11.1807 20.1465 11.4375 19.5 11.4375H19.2403C19.2881 11.099 19.3122 10.7575 19.3125 10.4156V7.3125H21.75C21.7997 7.3125 21.8474 7.33225 21.8826 7.36742C21.9177 7.40258 21.9375 7.45027 21.9375 7.5V9Z" fill="#E67E22"/>
</svg>
);

interface Seller {
  rank: number;
  name: string;
  orders: number;
  gmv: string;
  commission: string;
  revenue: string;
  category: string;
}

export default function SellerLeaderboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState("This month");
  const sellersPerPage = 7;

  // Mock data
  const allSellers: Seller[] = Array(7).fill(null).map((_, i) => ({
    rank: i + 1,
    name: "Next Gadgets",
    orders: 420,
    gmv: "₦12.4M",
    commission: "5%",
    revenue: "₦620K",
    category: "Electronics",
  }));

  const totalSellers = allSellers.length;
  const totalPages = Math.ceil(totalSellers / sellersPerPage);

  const indexOfLastSeller = currentPage * sellersPerPage;
  const indexOfFirstSeller = indexOfLastSeller - sellersPerPage;
  const currentSellers = allSellers.slice(indexOfFirstSeller, indexOfLastSeller);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Seller Leaderboard (Admin Reports)</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Seller"
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
              <h3 className="text-3xl font-bold text-black mb-1">₦12.4M</h3>
              <p className="text-xs text-gray-600">Next Gadgets</p>
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
              <h3 className="text-3xl font-bold text-black mb-1">1,240</h3>
              <p className="text-xs text-gray-600">This month</p>
            </div>
          </div>

          {/* Avg Seller GMV */}
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
              <p className="text-sm text-gray-700">Avg Seller GMV</p>
              <TrophyIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">₦1.2M</h3>
              <p className="text-xs text-gray-600">Across all sellers</p>
            </div>
          </div>

          {/* ShopAM Revenue */}
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
              <h3 className="text-3xl font-bold text-black mb-1">₦3.2M</h3>
              <p className="text-xs text-gray-600">From sellers</p>
            </div>
          </div>
        </div>

        {/* Filter and Export Row */}
        <div className="flex items-center justify-between mb-4">
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Rank</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Seller</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Orders</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">GMV</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Commission %</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">Category</th>
              </tr>
            </thead>
            <tbody>
              {currentSellers.map((seller, index) => (
                <tr key={index} className="border-b border-gray-100">
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
                  <td className="py-4 px-6 text-sm text-black">{seller.name}</td>
                  <td className="py-4 px-6 text-sm text-black">{seller.orders}</td>
                  <td className="py-4 px-6 text-sm text-black">{seller.gmv}</td>
                  <td className="py-4 px-6 text-sm text-black">{seller.commission}</td>
                  <td className="py-4 px-6 text-sm text-black">{seller.revenue}</td>
                  <td className="py-4 px-6 text-sm text-black">{seller.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstSeller + 1} to {Math.min(indexOfLastSeller, totalSellers)} of {totalSellers} sellers
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
      </div>
    </div>
  );
}