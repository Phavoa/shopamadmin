"use client";

import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getBuyers, BuyerProfileVM } from "@/api/buyerApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircleIcon, XCircleIcon, ActionIcon, EyeIcon, BanIcon, StrikeIcon } from "@/components/buyers/BuyersIcons";

interface Buyer extends BuyerProfileVM {
  name?: string;
  totalOrders?: number;
  totalSpend?: string;
  lastActivity?: string;
  strikes?: number;
}

interface StrikeData {
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  reason: string;
  duration: string;
  strikeCount: number;
  status: string;
  date: string;
}

const BuyersListPage = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasNext, setHasNext] = useState(false);
  
  // Modals state
  const [suspendModal, setSuspendModal] = useState(false);
  const [strikeModal, setStrikeModal] = useState(false);
  const [selectedBuyerForAction, setSelectedBuyerForAction] = useState<Buyer | null>(null);
  
  // Form state
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const buyersPerPage = 10;

  // Fetch buyers from API
  const fetchBuyers = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        limit: buyersPerPage,
        sortBy: "createdAt" as const,
        sortDir: "desc" as const,
        ...(searchQuery && { q: searchQuery }),
        ...(cursor && { after: cursor }),
      };

      const response = await getBuyers(params);
      
      if (response.success) {
        // Transform data to match UI format
        const transformedBuyers = response.data.items.map(buyer => ({
          ...buyer,
          name: `${buyer.userFirstName} ${buyer.userLastName}`,
          verified: buyer.verified || true,
          totalOrders: 0,
          totalSpend: `₦${(parseInt(buyer.totalPurchases) / 100).toLocaleString()}`,
          lastActivity: new Date(buyer.updatedAt).toLocaleDateString(),
          strikes: 0,
        }));
        
        setBuyers(transformedBuyers);
        setNextCursor(response.data.nextCursor);
        setHasNext(response.data.hasNext);
      }
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setError("Failed to load buyers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBuyers();
  };

  const handleNextPage = () => {
    if (hasNext && nextCursor) {
      setCurrentPage(currentPage + 1);
      fetchBuyers(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchBuyers();
    }
  };

  const toggleActionMenu = (buyerId: string) => {
    setActiveActionMenu(activeActionMenu === buyerId ? null : buyerId);
  };

  const handleViewBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setActiveActionMenu(null);
  };

  // Handle Suspend
  const openSuspendModal = (buyer: Buyer) => {
    setSelectedBuyerForAction(buyer);
    setSuspendModal(true);
    setActiveActionMenu(null);
  };

  const handleSuspend = async () => {
    if (!selectedBuyerForAction || !reason || !duration) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setActionLoading(true);
      
      // Store suspension data (will connect to backend later)
      const suspensionData = {
        buyerId: selectedBuyerForAction.userId,
        buyerName: selectedBuyerForAction.name || `${selectedBuyerForAction.userFirstName} ${selectedBuyerForAction.userLastName}`,
        buyerEmail: selectedBuyerForAction.userEmail,
        reason,
        duration,
        status: "Suspended",
        date: new Date().toISOString(),
      };
      
      console.log("Suspension Data:", suspensionData);
      
      // Store in localStorage for now (will use API later)
      const existingData = JSON.parse(localStorage.getItem("suspensions") || "[]");
      localStorage.setItem("suspensions", JSON.stringify([...existingData, suspensionData]));
      
      setSuspendModal(false);
      setReason("");
      setDuration("");
      alert("Buyer suspended successfully!");
      
    } catch (err) {
      console.error("Error suspending buyer:", err);
      alert("Failed to suspend buyer");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Strike
  const openStrikeModal = (buyer: Buyer) => {
    setSelectedBuyerForAction(buyer);
    setStrikeModal(true);
    setActiveActionMenu(null);
  };

  const handleStrike = async () => {
    if (!selectedBuyerForAction || !reason || !duration) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setActionLoading(true);
      
      // Get existing strikes
      const existingStrikes = JSON.parse(localStorage.getItem("strikes") || "[]");
      const buyerStrikes = existingStrikes.filter(
        (s: StrikeData) => s.buyerId === selectedBuyerForAction.userId
      );
      
      const newStrikeCount = buyerStrikes.length + 1;
      const status = newStrikeCount >= 3 ? "Suspended" : `Strike(${newStrikeCount}/3)`;
      
      const strikeData: StrikeData = {
        buyerId: selectedBuyerForAction.userId,
        buyerName: selectedBuyerForAction.name || `${selectedBuyerForAction.userFirstName} ${selectedBuyerForAction.userLastName}`,
        buyerEmail: selectedBuyerForAction.userEmail,
        reason,
        duration,
        strikeCount: newStrikeCount,
        status,
        date: new Date().toISOString(),
      };
      
      console.log("Strike Data:", strikeData);
      
      // Store strike
      localStorage.setItem("strikes", JSON.stringify([...existingStrikes, strikeData]));
      
      // If 3 strikes, also add to suspensions
      if (newStrikeCount >= 3) {
        const existingSuspensions = JSON.parse(localStorage.getItem("suspensions") || "[]");
        localStorage.setItem("suspensions", JSON.stringify([...existingSuspensions, strikeData]));
      }
      
      setStrikeModal(false);
      setReason("");
      setDuration("");
      alert(`Strike issued! (${newStrikeCount}/3)${newStrikeCount >= 3 ? " - Buyer suspended" : ""}`);
      
    } catch (err) {
      console.error("Error issuing strike:", err);
      alert("Failed to issue strike");
    } finally {
      setActionLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (kobo: string) => {
    const amount = parseInt(kobo) / 100;
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

// Replace your "Buyer Profile View" section with this optimized version

// Buyer Profile View
if (selectedBuyer) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setSelectedBuyer(null)}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Buyers List
        </button>
      </div>


      {/* Content */}
      <div className="p-6">
        <div className="flex gap-6 max-w-[1190px]">
          {/* Left Card - Main Profile */}
          <div
            style={{
              width: "865px",
              padding: "24px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-black mb-1">
                  Buyer Profile - {selectedBuyer.name}
                </h2>
                <p className="text-sm text-gray-500">
                  ID: {selectedBuyer.userId.substring(0, 16)}...
                </p>
              </div>
              <div
                style={{
                  width: "56px",
                  height: "56px",
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
                {selectedBuyer.userFirstName[0]}
                {selectedBuyer.userLastName[0]}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-2">Total Spend</p>
                <p className="text-xl font-semibold text-black">
                  {formatCurrency(selectedBuyer.totalPurchases)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Joined</p>
                <p className="text-base font-semibold text-black">
                  {formatDate(selectedBuyer.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Verified</p>
                <span
                  className="inline-flex px-3 py-1.5 rounded-xl text-xs font-normal"
                  style={{
                    background: selectedBuyer.verified ? "#D7FDD9" : "#FEE2E2",
                    color: selectedBuyer.verified ? "#008D3F" : "#DC3545",
                  }}
                >
                  {selectedBuyer.verified ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Status</p>
                <span
                  className="inline-flex px-3 py-1.5 rounded-xl text-xs font-normal"
                  style={{
                    background: selectedBuyer.status === "ACTIVE" ? "#D7FDD9" : "#FFE9D5",
                    color: selectedBuyer.status === "ACTIVE" ? "#008D3F" : "#E67E22",
                  }}
                >
                  {selectedBuyer.status}
                </span>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="pt-6">
              <h3 className="text-base font-semibold text-black mb-4">
                Buyer Information
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Buyer ID</p>
                  <p className="text-black font-medium">{selectedBuyer.userId}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="text-black font-medium">{selectedBuyer.userEmail}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Phone</p>
                  <p className="text-black font-medium">{selectedBuyer.userPhone}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Location</p>
                  <p className="text-black font-medium">
                    {selectedBuyer.locationCity}, {selectedBuyer.locationState}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Location Details */}
          <div
            style={{
              width: "436px",
              padding: "24px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h3 className="text-base font-semibold text-black mb-4">
              Location Details
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1.5">State</p>
                <p className="text-base font-semibold text-black">
                  {selectedBuyer.locationState}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1.5">City</p>
                <p className="text-base font-semibold text-black">
                  {selectedBuyer.locationCity}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E67E22] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading buyers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchBuyers()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Main Buyers List View
  return (
    <div className="min-h-screen bg-white">
      {/* Suspend Modal */}
      <Dialog open={suspendModal} onOpenChange={setSuspendModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Suspend Buyer</DialogTitle>
            <DialogDescription>
              Suspend {selectedBuyerForAction?.name} from making purchases
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reason">Reason for Suspension</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason..."
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 7"
                value={duration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setSuspendModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSuspend} 
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? "Suspending..." : "Suspend Buyer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Strike Modal */}
      <Dialog open={strikeModal} onOpenChange={setStrikeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Issue Strike</DialogTitle>
            <DialogDescription>
              Issue a strike to {selectedBuyerForAction?.name}. After 3 strikes, buyer will be suspended.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="strike-reason">Reason for Strike</Label>
              <Textarea
                id="strike-reason"
                placeholder="Enter reason..."
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="strike-duration">Cooldown Period (days)</Label>
              <Input
                id="strike-duration"
                type="number"
                placeholder="e.g., 7"
                value={duration}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStrikeModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStrike} 
              disabled={actionLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {actionLoading ? "Issuing Strike..." : "Issue Strike"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Buyer List</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email or phone"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
              className="w-[320px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 h-10 bg-[#E67E22] text-white rounded-lg text-sm font-medium hover:bg-[#d67020]"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Buyer ID</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Name</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Email/Phone</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Location</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Verified</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Total Spend</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Joined</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buyers.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-500">
                  No buyers found
                </td>
              </tr>
            ) : (
              buyers.map((buyer) => (
                <tr key={buyer.userId} className="border-b border-gray-100">
                  <td className="py-4 px-6 text-sm text-black">{buyer.userId.substring(0, 8)}</td>
                  <td className="py-4 px-6 text-sm text-black">{buyer.name}</td>
                  <td className="py-4 px-6 text-sm text-black">
                    {buyer.userEmail}<br />{buyer.userPhone}
                  </td>
                  <td className="py-4 px-6 text-sm text-black">{buyer.locationCity}, {buyer.locationState}</td>
                  <td className="py-4 px-6">
                    {buyer.verified ? <CheckCircleIcon /> : <XCircleIcon />}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-black">{buyer.totalSpend}</td>
                  <td className="py-4 px-6 text-sm text-black">{buyer.lastActivity}</td>
                  <td className="py-4 px-6">
                    <div
                      className="inline-flex justify-center items-center rounded-xl"
                      style={{
                        padding: '7px 10px',
                        background: buyer.status === "ACTIVE" ? "#D7FDD9" : "#FFE9D5"
                      }}
                    >
                      <span
                        style={{
                          color: buyer.status === "ACTIVE" ? "#008D3F" : "#E67E22",
                          textAlign: 'center',
                          fontSize: '12px',
                          fontWeight: 400,
                        }}
                      >
                        {buyer.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 relative">
                    <button
                      onClick={() => toggleActionMenu(buyer.userId)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <ActionIcon />
                    </button>
                    
                    {activeActionMenu === buyer.userId && (
                      <div 
                        className="absolute right-12 top-12 z-20 rounded-xl shadow-lg border border-gray-200"
                        style={{
                          width: '187px',
                          padding: '4px 8px',
                          background: '#FFF',
                        }}
                      >
                        <button 
                          onClick={() => handleViewBuyer(buyer)}
                          className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50 border-b border-gray-100"
                        >
                          <span>View</span>
                          <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '12px', border: '0.2px solid rgba(0,0,0,0.3)' }}>
                            <EyeIcon />
                          </div>
                        </button>
                        <button 
                          onClick={() => openSuspendModal(buyer)}
                          className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50 border-b border-gray-100"
                        >
                          <span>Suspend</span>
                          <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '12px', border: '0.2px solid rgba(0,0,0,0.3)', background: '#F4F4F4' }}>
                            <BanIcon />
                          </div>
                        </button>
                        <button 
                          onClick={() => openStrikeModal(buyer)}
                          className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50 rounded-lg"
                        >
                          <span>Strike</span>
                          <div className="flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '12px', border: '0.2px solid rgba(0,0,0,0.3)', background: '#F4F4F4' }}>
                            <StrikeIcon />
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
          Showing page {currentPage}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
            className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: '0.2px solid rgba(0,0,0,0.3)',
              background: '#F4F4F4'
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="flex items-center justify-center font-medium text-sm text-white"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#E67E22'
            }}
          >
            {currentPage}
          </button>
          <button
            onClick={handleNextPage}
            disabled={!hasNext || loading}
            className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: '0.2px solid rgba(0,0,0,0.3)',
              background: '#F4F4F4'
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyersListPage;