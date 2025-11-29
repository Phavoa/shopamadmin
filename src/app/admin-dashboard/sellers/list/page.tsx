"use client";

import React, { useState, useEffect } from "react";
import { getSellers, suspendSeller, SellerProfileVM, SellerListParams } from "@/api/sellerApi";
import { Search, ChevronLeft, ChevronRight, Eye, Ban, Loader2, X, AlertTriangle } from "lucide-react";

const ActionIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.1563 0C8.94976 0 6.79281 0.654302 4.95817 1.88017C3.12354 3.10603 1.69361 4.8484 0.849224 6.88694C0.00483364 8.92548 -0.216097 11.1686 0.214369 13.3327C0.644836 15.4968 1.70737 17.4847 3.26759 19.0449C4.82782 20.6051 6.81568 21.6677 8.97978 22.0981C11.1439 22.5286 13.387 22.3077 15.4256 21.4633C17.4641 20.6189 19.2065 19.189 20.4323 17.3543C21.6582 15.5197 22.3125 13.3627 22.3125 11.1562C22.309 8.19849 21.1325 5.36288 19.0411 3.27143C16.9496 1.17998 14.114 0.00347359 11.1563 0ZM11.1563 21C9.20934 21 7.30616 20.4227 5.68736 19.341C4.06856 18.2594 2.80687 16.722 2.06182 14.9233C1.31677 13.1246 1.12183 11.1453 1.50165 9.23583C1.88147 7.32633 2.819 5.57234 4.19567 4.19567C5.57235 2.81899 7.32633 1.88147 9.23583 1.50164C11.1453 1.12182 13.1246 1.31676 14.9233 2.06181C16.722 2.80686 18.2594 4.06856 19.341 5.68736C20.4227 7.30615 21 9.20934 21 11.1562C20.9971 13.7661 19.9591 16.2682 18.1136 18.1136C16.2682 19.9591 13.7661 20.9971 11.1563 21ZM12.25 6.34375C12.25 6.56007 12.1859 6.77154 12.0657 6.9514C11.9455 7.13127 11.7747 7.27146 11.5748 7.35424C11.375 7.43703 11.155 7.45869 10.9429 7.41648C10.7307 7.37428 10.5358 7.27011 10.3829 7.11715C10.2299 6.96418 10.1257 6.7693 10.0835 6.55713C10.0413 6.34496 10.063 6.12505 10.1458 5.92519C10.2285 5.72533 10.3687 5.55451 10.5486 5.43433C10.7285 5.31415 10.9399 5.25 11.1563 5.25C11.4463 5.25 11.7245 5.36523 11.9297 5.57035C12.1348 5.77547 12.25 6.05367 12.25 6.34375ZM12.25 11.1562C12.25 11.3726 12.1859 11.584 12.0657 11.7639C11.9455 11.9438 11.7747 12.084 11.5748 12.1667C11.375 12.2495 11.155 12.2712 10.9429 12.229C10.7307 12.1868 10.5358 12.0826 10.3829 11.9296C10.2299 11.7767 10.1257 11.5818 10.0835 11.3696C10.0413 11.1575 10.063 10.9375 10.1458 10.7377C10.2285 10.5378 10.3687 10.367 10.5486 10.2468C10.7285 10.1266 10.9399 10.0625 11.1563 10.0625C11.4463 10.0625 11.7245 10.1777 11.9297 10.3829C12.1348 10.588 12.25 10.8662 12.25 11.1562ZM12.25 15.9687C12.25 16.1851 12.1859 16.3965 12.0657 16.5764C11.9455 16.7563 11.7747 16.8965 11.5748 16.9792C11.375 17.062 11.155 17.0837 10.9429 17.0415C10.7307 16.9993 10.5358 16.8951 10.3829 16.7421C10.2299 16.5892 10.1257 16.3943 10.0835 16.1821C10.0413 15.97 10.063 15.75 10.1458 15.5502C10.2285 15.3503 10.3687 15.1795 10.5486 15.0593C10.7285 14.9391 10.9399 14.875 11.1563 14.875C11.4463 14.875 11.7245 14.9902 11.9297 15.1953C12.1348 15.4005 12.25 15.6787 12.25 15.9687Z" fill="black"/>
  </svg>
);

type DisplaySeller = SellerProfileVM

const Page = () => {
  const [sellers, setSellers] = useState<DisplaySeller[]>([]);
  const [fetchingSellers, setFetchingSellers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(null);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [sellerToSuspend, setSellerToSuspend] = useState<DisplaySeller | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [prevCursor, setPrevCursor] = useState<string | undefined>();
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchSellers = async (params: SellerListParams = {}) => {
    try {
      setFetchingSellers(true);
      setError(null);
      
      const response = await getSellers({
        ...params,
        populate: "user",
        limit: 9,
      });

      setSellers(response.data.items);
      setNextCursor(response.data.nextCursor);
      setPrevCursor(response.data.prevCursor);
      setHasNext(response.data.hasNext);
      setHasPrev(response.data.hasPrev);
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

  const handleSearch = () => {
    fetchSellers({ q: searchQuery || undefined });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleActionMenu = (sellerId: string) => {
    setActiveActionMenu(activeActionMenu === sellerId ? null : sellerId);
  };

  const handleViewSeller = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
    setActiveActionMenu(null);
  };

  const openSuspendModal = (seller: DisplaySeller) => {
    setSellerToSuspend(seller);
    setShowSuspendModal(true);
    setActiveActionMenu(null);
  };

  const handleSuspendSeller = async () => {
    if (!sellerToSuspend) return;
    
    try {
      setSuspendingId(sellerToSuspend.userId);
      
      await suspendSeller(sellerToSuspend.userId);
      
      setSellers((prev) =>
        prev.map((s) =>
          s.userId === sellerToSuspend.userId ? { ...s, status: "SUSPENDED" } : s
        )
      );
      
      setShowSuspendModal(false);
      setSellerToSuspend(null);
    } catch (error) {
      console.error("Failed to suspend seller:", error);
    } finally {
      setSuspendingId(null);
    }
  };

  const handleNextPage = () => {
    if (hasNext && nextCursor) {
      fetchSellers({ after: nextCursor, q: searchQuery || undefined });
    }
  };

  const handlePrevPage = () => {
    if (hasPrev && prevCursor) {
      fetchSellers({ before: prevCursor, q: searchQuery || undefined });
    }
  };

  if (selectedSeller) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold">Seller Profile</h1>
        </div>

        <div className="px-6 py-4">
          <button onClick={() => setSelectedSeller(null)} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Sellers List
          </button>
        </div>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div style={{ padding: "24px", borderRadius: "18px", border: "0.3px solid rgba(0, 0, 0, 0.20)", background: "#FFF" }}>
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-semibold">Seller Profile - {selectedSeller.shopName}</h2>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "600", color: "#374151" }}>
                    {selectedSeller.shopName.charAt(0)}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Sales</p>
                    <p className="text-lg font-semibold">₦{parseFloat(selectedSeller.totalSales).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-lg font-semibold capitalize">{selectedSeller.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tier</p>
                    <p className="text-lg font-semibold">{selectedSeller.tier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="text-lg font-semibold">{selectedSeller.businessCategory}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>Shop Name:</strong> {selectedSeller.shopName}</p>
                  <p><strong>Business Name:</strong> {selectedSeller.businessName}</p>
                  <p><strong>Location:</strong> {selectedSeller.locationCity}, {selectedSeller.locationState}</p>
                  <p><strong>Created:</strong> {new Date(selectedSeller.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Seller List</h1>
        <div className="relative flex gap-2">
          <input
            type="text"
            placeholder="Search Seller by Name, ID, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="w-[400px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <button onClick={handleSearch} style={{ padding: "0 20px", borderRadius: "8px", background: "#E67E22", color: "#FFF", fontSize: "14px", fontWeight: 500, border: "none", cursor: "pointer" }}>
            Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Seller ID</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Shop Name</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Tier</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Total Sales</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Location</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetchingSellers ? (
              <tr>
                <td colSpan={7} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#E67E22] mr-2" />
                    <span className="text-gray-600">Loading sellers...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-red-600">{error}</td>
              </tr>
            ) : sellers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">No sellers found</td>
              </tr>
            ) : (
              sellers.map((seller) => (
                <tr key={seller.userId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-black">{seller.userId.substring(0, 10)}...</td>
                  <td className="py-4 px-6 text-sm font-medium text-green-600">{seller.shopName}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {seller.tier}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      seller.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                      seller.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-black">₦{parseFloat(seller.totalSales).toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm text-black">{seller.locationCity}, {seller.locationState}</td>
                  <td className="py-4 px-6 relative">
                    <button onClick={() => toggleActionMenu(seller.userId)} className="hover:opacity-70 transition-opacity" disabled={suspendingId === seller.userId}>
                      {suspendingId === seller.userId ? <Loader2 className="w-5 h-5 animate-spin" /> : <ActionIcon />}
                    </button>

                    {activeActionMenu === seller.userId && (
                      <div className="absolute right-0 top-12 z-20 rounded-xl shadow-lg border border-gray-200" style={{ width: "150px", padding: "4px", background: "#FFF" }}>
                        <button onClick={() => handleViewSeller(seller)} className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-50 rounded">
                          <span>View</span>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openSuspendModal(seller)} className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-50 rounded text-red-600">
                          <span>Suspend</span>
                          <Ban className="w-4 h-4" />
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

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">Showing {sellers.length} sellers</p>
        <div className="flex items-center gap-3">
          <button onClick={handlePrevPage} disabled={!hasPrev} className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed" style={{ width: "40px", height: "40px", borderRadius: "12px", border: "0.2px solid rgba(0,0,0,0.3)", background: "#F4F4F4" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center font-medium text-sm text-white" style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#E67E22" }}>
            1
          </div>
          <button onClick={handleNextPage} disabled={!hasNext} className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed" style={{ width: "40px", height: "40px", borderRadius: "12px", border: "0.2px solid rgba(0,0,0,0.3)", background: "#F4F4F4" }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suspend Confirmation Modal */}
      {showSuspendModal && sellerToSuspend && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] flex items-center justify-center z-50" onClick={() => setShowSuspendModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" style={{ borderRadius: "18px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-black">Suspend Seller</h2>
              </div>
              <button onClick={() => setShowSuspendModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to suspend <strong>{sellerToSuspend.shopName}</strong>? This action will prevent them from accessing their account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={!!suspendingId}
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendSeller}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={!!suspendingId}
              >
                {suspendingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Suspending...
                  </>
                ) : (
                  'Suspend'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;