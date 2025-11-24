"use client";

import React, { useState, useEffect } from "react";
import { getSellers, SellerProfileVM, SellerListParams } from "@/api/sellerApi";
import { Search, ChevronLeft, ChevronRight, Eye, Key, Ban } from "lucide-react";

// SVG Icons
const ActionIcon = () => (
  <svg
    width="23"
    height="23"
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.1563 0C8.94976 0 6.79281 0.654302 4.95817 1.88017C3.12354 3.10603 1.69361 4.8484 0.849224 6.88694C0.00483364 8.92548 -0.216097 11.1686 0.214369 13.3327C0.644836 15.4968 1.70737 17.4847 3.26759 19.0449C4.82782 20.6051 6.81568 21.6677 8.97978 22.0981C11.1439 22.5286 13.387 22.3077 15.4256 21.4633C17.4641 20.6189 19.2065 19.189 20.4323 17.3543C21.6582 15.5197 22.3125 13.3627 22.3125 11.1562C22.309 8.19849 21.1325 5.36288 19.0411 3.27143C16.9496 1.17998 14.114 0.00347359 11.1563 0ZM11.1563 21C9.20934 21 7.30616 20.4227 5.68736 19.341C4.06856 18.2594 2.80687 16.722 2.06182 14.9233C1.31677 13.1246 1.12183 11.1453 1.50165 9.23583C1.88147 7.32633 2.819 5.57234 4.19567 4.19567C5.57235 2.81899 7.32633 1.88147 9.23583 1.50164C11.1453 1.12182 13.1246 1.31676 14.9233 2.06181C16.722 2.80686 18.2594 4.06856 19.341 5.68736C20.4227 7.30615 21 9.20934 21 11.1562C20.9971 13.7661 19.9591 16.2682 18.1136 18.1136C16.2682 19.9591 13.7661 20.9971 11.1563 21ZM12.25 6.34375C12.25 6.56007 12.1859 6.77154 12.0657 6.9514C11.9455 7.13127 11.7747 7.27146 11.5748 7.35424C11.375 7.43703 11.155 7.45869 10.9429 7.41648C10.7307 7.37428 10.5358 7.27011 10.3829 7.11715C10.2299 6.96418 10.1257 6.7693 10.0835 6.55713C10.0413 6.34496 10.063 6.12505 10.1458 5.92519C10.2285 5.72533 10.3687 5.55451 10.5486 5.43433C10.7285 5.31415 10.9399 5.25 11.1563 5.25C11.4463 5.25 11.7245 5.36523 11.9297 5.57035C12.1348 5.77547 12.25 6.05367 12.25 6.34375ZM12.25 11.1562C12.25 11.3726 12.1859 11.584 12.0657 11.7639C11.9455 11.9438 11.7747 12.084 11.5748 12.1667C11.375 12.2495 11.155 12.2712 10.9429 12.229C10.7307 12.1868 10.5358 12.0826 10.3829 11.9296C10.2299 11.7767 10.1257 11.5818 10.0835 11.3696C10.0413 11.1575 10.063 10.9375 10.1458 10.7377C10.2285 10.5378 10.3687 10.367 10.5486 10.2468C10.7285 10.1266 10.9399 10.0625 11.1563 10.0625C11.4463 10.0625 11.7245 10.1777 11.9297 10.3829C12.1348 10.588 12.25 10.8662 12.25 11.1562ZM12.25 15.9687C12.25 16.1851 12.1859 16.3965 12.0657 16.5764C11.9455 16.7563 11.7747 16.8965 11.5748 16.9792C11.375 17.062 11.155 17.0837 10.9429 17.0415C10.7307 16.9993 10.5358 16.8951 10.3829 16.7421C10.2299 16.5892 10.1257 16.3943 10.0835 16.1821C10.0413 15.97 10.063 15.75 10.1458 15.5502C10.2285 15.3503 10.3687 15.1795 10.5486 15.0593C10.7285 14.9391 10.9399 14.875 11.1563 14.875C11.4463 14.875 11.7245 14.9902 11.9297 15.1953C12.1348 15.4005 12.25 15.6787 12.25 15.9687Z"
      fill="black"
    />
  </svg>
);

// Type for display seller data
interface DisplaySeller {
  id: string;
  name: string;
  email: string;
  status: string;
  tier: string;
  shopName: string;
  businessCategory: string;
  location: string;
  totalSales: string;
  createdAt: string;
  reliability?: string;
  strikes?: number;
  lastLive?: string;
  walletBalance?: string;
  totalOrders?: number;
  completedOrders?: number;
  activeListings?: number;
  nextSlot?: string;
}

const Page = () => {
  const [sellers, setSellers] = useState<DisplaySeller[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSellers, setFetchingSellers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTier, setSelectedTier] = useState("Bronze");
  const sellersPerPage = 9;

  // Fetch sellers
  const fetchSellers = async (params: SellerListParams = {}) => {
    try {
      setFetchingSellers(true);
      setError(null);
      const response = await getSellers({
        ...params,
        limit: 50,
      });
      const displaySellers: DisplaySeller[] = response.data.items.map(
        (seller: SellerProfileVM) => ({
          id: seller.userId,
          name: `${seller.userFirstName} ${seller.userLastName}`,
          email: seller.userEmail,
          status: seller.status.toLowerCase(),
          tier: seller.tier,
          shopName: seller.shopName,
          businessCategory: seller.businessCategory,
          location: `${seller.locationCity}, ${seller.locationState}`,
          totalSales: seller.totalSales,
          createdAt: seller.createdAt,
          reliability: "95%",
          strikes: 0,
          lastLive: "Aug 30 (Bronze, 210 viewers)",
          walletBalance: "₦340,000",
          totalOrders: 452,
          completedOrders: 400,
          activeListings: 35,
          nextSlot: "Sep 6, 2025 14:00 (Bronze)",
        })
      );
      setSellers(displaySellers);
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
      setError("Failed to load sellers. Please try again.");
    } finally {
      setFetchingSellers(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const toggleActionMenu = (sellerId: string) => {
    setActiveActionMenu(activeActionMenu === sellerId ? null : sellerId);
  };

  const handleViewSeller = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
    setActiveActionMenu(null);
  };

  // Pagination
  const totalPages = Math.ceil(sellers.length / sellersPerPage);
  const indexOfLastSeller = currentPage * sellersPerPage;
  const indexOfFirstSeller = indexOfLastSeller - sellersPerPage;
  const currentSellers = sellers.slice(indexOfFirstSeller, indexOfLastSeller);

  // If seller is selected, show profile view
  if (selectedSeller) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold">Seller Profile</h1>
        </div>

        {/* Back Button */}
        <div className="px-6 py-4">
          <button
            onClick={() => setSelectedSeller(null)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Sellers List
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Side - Seller Profile */}
            <div className="col-span-8">
              <div
                style={{
                  padding: "24px",
                  borderRadius: "18px",
                  border: "0.3px solid rgba(0, 0, 0, 0.20)",
                  background: "#FFF",
                }}
              >
                {/* Header with Profile Image */}
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Seller Profile - {selectedSeller.shopName}
                  </h2>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "#D1D5DB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    {selectedSeller.shopName.charAt(0)}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Sales</p>
                    <p className="text-lg font-semibold">
                      ₦{parseFloat(selectedSeller.totalSales).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Reliability</p>
                    <p className="text-lg font-semibold text-green-600">
                      {selectedSeller.reliability}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Strikes</p>
                    <p className="text-lg font-semibold">
                      {selectedSeller.strikes}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="text-lg font-semibold">
                      {selectedSeller.businessCategory}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-lg font-semibold">
                      {selectedSeller.location}
                    </p>
                  </div>
                </div>

                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-3">Overview</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Total Orders: {selectedSeller.totalOrders}</li>
                    <li>
                      • Completed Orders: {selectedSeller.completedOrders} (89%)
                    </li>
                    <li>• Active Listings: {selectedSeller.activeListings}</li>
                    <li>• Last Live: {selectedSeller.lastLive}</li>
                    <li>• Next Slot: {selectedSeller.nextSlot}</li>
                    <li>• Wallet Balance: {selectedSeller.walletBalance}</li>
                  </ul>
                </div>

                {/* Activity Log */}
                <div>
                  <h3 className="text-base font-semibold mb-3">
                    Activity Log (Last 30 Days)
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Aug 2 - Order #7582020 completed - ₦125,000</li>
                    <li>
                      • Aug 30 - Livestream (Bronze) - 210 viewers - ₦620,000
                      sales
                    </li>
                    <li>• Aug 26 - Order #7583510 refunded - ₦45,000</li>
                    <li>• Aug 21 - Slot booked for Aug 30, 14:00 (Bronze)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side - Tier Management */}
            <div className="col-span-4">
              <div
                style={{
                  padding: "24px",
                  borderRadius: "18px",
                  border: "0.3px solid rgba(0, 0, 0, 0.20)",
                  background: "#FFF",
                }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Livestream Tier Management
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Current Tier:{" "}
                      <span className="font-semibold text-black">
                        Bronze (Scenario B)
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Auto-eligibility: Unlocked after ₦5,000,000 sales
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Viewer Cap: 150</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration: 70 mins</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Manual Override
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTier("Beginner")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        background:
                          selectedTier === "Beginner" ? "#E67E22" : "#FFF",
                        color: selectedTier === "Beginner" ? "#FFF" : "#000",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Beginner
                    </button>
                    <button
                      onClick={() => setSelectedTier("Bronze")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        background:
                          selectedTier === "Bronze" ? "#E67E22" : "#FFF",
                        color: selectedTier === "Bronze" ? "#FFF" : "#000",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Bronze
                    </button>
                    <button
                      onClick={() => setSelectedTier("Gold")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        background:
                          selectedTier === "Gold" ? "#E67E22" : "#FFF",
                        color: selectedTier === "Gold" ? "#FFF" : "#000",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      Gold
                    </button>
                  </div>
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#E67E22",
                    color: "#FFF",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "12px",
                  }}
                >
                  Apply Override
                </button>

                <textarea
                  placeholder="Write the reason for override...e.g. High Reliability."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "0.3px solid rgba(0, 0, 0, 0.20)",
                    fontSize: "14px",
                    resize: "none",
                    marginBottom: "12px",
                    minHeight: "80px",
                  }}
                />

                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "#FFF",
                    color: "#E67E22",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "1px solid #E67E22",
                    cursor: "pointer",
                  }}
                >
                  Reset to Auto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sellers List View
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Seller List</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Seller by Name, ID, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[400px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">
                Seller ID
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">
                Name
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">
                Tier
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">
                Last Live
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">
                Reliability
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">
                Strikes
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">
                Wallet
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchingSellers ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  Loading sellers...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : currentSellers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No sellers found
                </td>
              </tr>
            ) : (
              currentSellers.map((seller) => (
                <tr key={seller.id} className="border-b border-gray-100">
                  <td className="py-4 px-6 text-sm text-black">
                    {seller.id.substring(0, 8)}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-green-600">
                    {seller.shopName}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Bronze
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-black">
                    {seller.lastLive}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-green-600">
                    {seller.reliability}
                  </td>
                  <td className="py-4 px-6 text-sm text-black">
                    {seller.strikes}
                  </td>
                  <td className="py-4 px-6 text-sm text-black">
                    ₦{parseFloat(seller.totalSales).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 relative">
                    <button
                      onClick={() => toggleActionMenu(seller.id)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <ActionIcon />
                    </button>

                    {activeActionMenu === seller.id && (
                      <div
                        className="absolute left-15 top-0 z-20 rounded-xl shadow-lg border border-gray-200"
                        style={{
                          width: "150px",
                          padding: "2px 8px",
                          background: "#FFF",
                          borderRadius: "8px",
                          // height: 10,
                        }}
                      >
                        <button
                          onClick={() => handleViewSeller(seller)}
                          className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50 border-b border-gray-100"
                        >
                          <span>View</span>
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              border: "0.2px solid rgba(0,0,0,0.3)",
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </div>
                        </button>
                        <button className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50 border-b border-gray-100">
                          <span>Override</span>
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              border: "0.2px solid rgba(0,0,0,0.3)",
                              background: "#F4F4F4",
                            }}
                          >
                            <Key className="w-4 h-4" />
                          </div>
                        </button>
                        <button className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50">
                          <span>Suspend</span>
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              border: "0.2px solid rgba(0,0,0,0.3)",
                              background: "#F4F4F4",
                            }}
                          >
                            <Ban className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {indexOfFirstSeller + 1} to{" "}
          {Math.min(indexOfLastSeller, sellers.length)} of {sellers.length}{" "}
          sellers
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center disabled:opacity-40"
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
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="flex items-center justify-center disabled:opacity-40"
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
  );
};

export default Page;
