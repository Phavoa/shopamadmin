"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// Dollar Sign SVG Icon
const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.5625 15.75C18.561 16.8933 18.1062 17.9893 17.2978 18.7978C16.4893 19.6062 15.3933 20.061 14.25 20.0625H12.5625V21.75C12.5625 21.8992 12.5032 22.0423 12.3977 22.1477C12.2923 22.2532 12.1492 22.3125 12 22.3125C11.8508 22.3125 11.7077 22.2532 11.6023 22.1477C11.4968 22.0423 11.4375 21.8992 11.4375 21.75V20.0625H9.75C8.60671 20.061 7.51067 19.6062 6.70225 18.7978C5.89382 17.9893 5.43899 16.8933 5.4375 15.75C5.4375 15.6008 5.49676 15.4577 5.60225 15.3523C5.70774 15.2468 5.85082 15.1875 6 15.1875C6.14918 15.1875 6.29226 15.2468 6.39775 15.3523C6.50324 15.4577 6.5625 15.6008 6.5625 15.75C6.5625 16.5954 6.89832 17.4061 7.4961 18.0039C8.09387 18.6017 8.90462 18.9375 9.75 18.9375H14.25C15.0954 18.9375 15.9061 18.6017 16.5039 18.0039C17.1017 17.4061 17.4375 16.5954 17.4375 15.75C17.4375 14.9046 17.1017 14.0939 16.5039 13.4961C15.9061 12.8983 15.0954 12.5625 14.25 12.5625H10.5C9.35625 12.5625 8.25935 12.1081 7.4506 11.2994C6.64185 10.4906 6.1875 9.39375 6.1875 8.25C6.1875 7.10625 6.64185 6.00935 7.4506 5.2006C8.25935 4.39185 9.35625 3.9375 10.5 3.9375H11.4375V2.25C11.4375 2.10082 11.4968 1.95774 11.6023 1.85225C11.7077 1.74676 11.8508 1.6875 12 1.6875C12.1492 1.6875 12.2923 1.74676 12.3977 1.85225C12.5032 1.95774 12.5625 2.10082 12.5625 2.25V3.9375H13.5C14.6433 3.93899 15.7393 4.39382 16.5478 5.20225C17.3562 6.01067 17.811 7.10671 17.8125 8.25C17.8125 8.39918 17.7532 8.54226 17.6477 8.64775C17.5423 8.75324 17.3992 8.8125 17.25 8.8125C17.1008 8.8125 16.9577 8.75324 16.8523 8.64775C16.7468 8.54226 16.6875 8.39918 16.6875 8.25C16.6875 7.40462 16.3517 6.59387 15.7539 5.9961C15.1561 5.39832 14.3454 5.0625 13.5 5.0625H10.5C9.65462 5.0625 8.84387 5.39832 8.2461 5.9961C7.64832 6.59387 7.3125 7.40462 7.3125 8.25C7.3125 9.09538 7.64832 9.90613 8.2461 10.5039C8.84387 11.1017 9.65462 11.4375 10.5 11.4375H14.25C15.3933 11.439 16.4893 11.8938 17.2978 12.7022C18.1062 13.5107 18.561 14.6067 18.5625 15.75Z" fill="#E67E22"/>
  </svg>
);

interface Report {
  id: string;
  seller: string;
  orders: number;
  gmv: string;
  commPercent: string;
  commission: string;
  refunds: string;
  netRevenue: string;
  period: string;
}

export default function RevenueReportsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 8;

  // Mock data
  const allReports: Report[] = Array(8).fill(null).map((_, i) => ({
    id: "RPT-2101",
    seller: "Next Gadgets",
    orders: 86,
    gmv: "₦3.2M",
    commPercent: "5%",
    commission: "₦160K",
    refunds: "₦40K",
    netRevenue: "₦210K",
    period: "Sept W1",
  }));

  const totalReports = allReports.length;
  const totalPages = Math.ceil(totalReports / reportsPerPage);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = allReports.slice(indexOfFirstReport, indexOfLastReport);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Revenue Reports</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-[320px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {/* Total GMV */}
          <div
            style={{
              display: "flex",
              width: "100%",
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
              <p className="text-sm text-gray-700">Total GMV</p>
              <DollarSignIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">₦9.3M</h3>
              <p className="text-xs text-green-600">+15% vs prev week</p>
            </div>
          </div>

          {/* Total Commission */}
          <div
            style={{
              display: "flex",
              width: "100%",
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
              <p className="text-sm text-gray-700">Total Commission</p>
              <DollarSignIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">₦284K</h3>
              <p className="text-xs text-gray-600">5% blended rate</p>
            </div>
          </div>

          {/* Total Refunds */}
          <div
            style={{
              display: "flex",
              width: "100%",
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
              <p className="text-sm text-gray-700">Total Refunds</p>
              <DollarSignIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">₦50K</h3>
              <p className="text-xs text-gray-600">All sellers</p>
            </div>
          </div>

          {/* Net ShopAM Revenue */}
          <div
            style={{
              display: "flex",
              width: "100%",
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
              <p className="text-sm text-gray-700">Net ShopAM Revenue</p>
              <DollarSignIcon />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-black mb-1">₦440K</h3>
              <p className="text-xs text-gray-600">After refunds</p>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end gap-3 mb-4">
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  Report ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  Seller
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  Orders
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  GMV
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  Comm %
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  Commission
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  Refunds
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  Net Revenue
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-black">
                  Period
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-6 text-sm text-black">{report.id}</td>
                  <td className="py-4 px-6 text-sm text-black">{report.seller}</td>
                  <td className="py-4 px-6 text-sm text-black">{report.orders}</td>
                  <td className="py-4 px-6 text-sm text-black">{report.gmv}</td>
                  <td className="py-4 px-6 text-sm text-black">{report.commPercent}</td>
                  <td className="py-4 px-6 text-sm text-black">{report.commission}</td>
                  <td className="py-4 px-6 text-sm text-black">{report.refunds}</td>
                  <td className="py-4 px-6 text-sm text-black">{report.netRevenue}</td>
                  <td className="py-4 px-6 text-sm text-black">{report.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, totalReports)} of {totalReports} reports
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