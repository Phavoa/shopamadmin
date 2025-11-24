"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, CreditCard, File } from "lucide-react";
import {
  approveSeller,
  suspendSeller,
  getSellers,
  SellerProfileVM,
} from "@/api/sellerApi";

// Type for display seller data
interface DisplaySeller {
  id: string;
  name: string;
  email: string;
  status: string;
  submittedDate: string;
  documents: string[];
}

const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
    case "active":
      return "bg-[#D1FAE5] text-[#065F46] border-[#D1FAE5]";
    case "rejected":
    case "suspended":
    case "denied":
      return "bg-[#FEE2E2] text-[#991B1B] border-[#FEE2E2]";
    case "pending":
    default:
      return "bg-[#FED7AA] text-[#9A3412] border-[#FED7AA]";
  }
};

// Helper function to format date
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

const Page = () => {
  const [sellers, setSellers] = useState<DisplaySeller[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [fetchingSellers, setFetchingSellers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleReview = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
  };

  // Fetch sellers on component mount
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setFetchingSellers(true);
        setError(null);
        const response = await getSellers({ limit: 50 });
        const displaySellers: DisplaySeller[] = response.data.items.map(
          (seller: SellerProfileVM) => ({
            id: seller.userId,
            name: `${seller.userFirstName} ${seller.userLastName}`,
            email: seller.userEmail,
            status: seller.status.toLowerCase(),
            submittedDate: seller.createdAt,
            documents: [
              seller.govIdUrl ? "Government ID" : null,
              seller.businessDocUrl ? "Business Document" : null,
            ].filter(Boolean) as string[],
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

    fetchSellers();
  }, []);

  const handleApprove = async () => {
    if (selectedSeller) {
      setLoading(true);
      try {
        await approveSeller(selectedSeller.id);
        // Update local state to reflect the change
        setSellers((prev) =>
          prev.map((seller) =>
            seller.id === selectedSeller.id
              ? { ...seller, status: "active" }
              : seller
          )
        );
        setSelectedSeller(null);
      } catch (error) {
        console.error("Failed to approve seller:", error);
        // Handle error (e.g., show toast notification)
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReject = async () => {
    if (selectedSeller) {
      setLoading(true);
      try {
        await suspendSeller(selectedSeller.id);
        // Update local state to reflect the change
        setSellers((prev) =>
          prev.map((seller) =>
            seller.id === selectedSeller.id
              ? { ...seller, status: "suspended" }
              : seller
          )
        );
        setSelectedSeller(null);
      } catch (error) {
        console.error("Failed to reject seller:", error);
        // Handle error (e.g., show toast notification)
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">
          Seller Document Verification
        </h1>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Sellers Table */}
          <div className="col-span-7">
            <div
              style={{
                borderRadius: "18px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                background: "#FFF",
              }}
            >
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 text-sm font-medium text-black">
                        Seller Name
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-black">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-black">
                        Submitted
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-black">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchingSellers ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center">
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-[#E67E22] mr-2" />
                            <span className="text-gray-600">Loading sellers...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-red-600">
                          {error}
                        </td>
                      </tr>
                    ) : sellers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          No pending sellers to review
                        </td>
                      </tr>
                    ) : (
                      sellers.map((seller) => (
                        <tr
                          key={seller.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-6 text-sm text-black">
                            {seller.name}
                          </td>
                          <td className="py-4 px-6">
                            <Badge
                              className={`rounded-full px-3 py-1 text-xs font-medium border ${getStatusBadgeStyles(
                                seller.status
                              )}`}
                            >
                              {seller.status.charAt(0).toUpperCase() +
                                seller.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {formatTimeAgo(seller.submittedDate)}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleReview(seller)}
                              style={{
                                padding: "6px 20px",
                                borderRadius: "8px",
                                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                                background: "#FFF",
                                color: "#000",
                                fontSize: "14px",
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                            >
                              {selectedSeller?.id === seller.id ? "Review" : "View"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side - Details Panel */}
          <div className="col-span-5">
            <div
              style={{
                padding: "24px",
                borderRadius: "18px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                background: "#FFF",
              }}
            >
              {selectedSeller ? (
                <>
                  <h2 className="text-lg font-semibold text-black mb-6">
                    Details - {selectedSeller.name}
                  </h2>

                  {/* Documents List */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: "#FFF",
                          border: "0.3px solid rgba(0, 0, 0, 0.10)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CreditCard className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">Personal ID</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          background: "#FFF",
                          border: "0.3px solid rgba(0, 0, 0, 0.10)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <File className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">Utility Bill</span>
                    </div>
                  </div>

                  {/* Document Image Preview */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-black mb-3">
                      Document Image
                    </h3>
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        border: "2px dashed #E5E7EB",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#FAFAFA",
                      }}
                    >
                      <div className="text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Documents Image Preview
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        background: "#E67E22",
                        color: "#FFF",
                        fontSize: "14px",
                        fontWeight: 500,
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      {loading ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        background: "#FFF",
                        color: "#EF4444",
                        fontSize: "14px",
                        fontWeight: 500,
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      {loading ? "Rejecting..." : "Reject"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-black mb-6">
                    Details
                  </h2>

                  {/* Empty State */}
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      border: "2px dashed #E5E7EB",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#FAFAFA",
                      marginBottom: "24px",
                    }}
                  >
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Select a seller to review documents
                      </p>
                    </div>
                  </div>

                  {/* Disabled Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      disabled
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        background: "#E5E7EB",
                        color: "#9CA3AF",
                        fontSize: "14px",
                        fontWeight: 500,
                        border: "none",
                        cursor: "not-allowed",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      disabled
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        background: "#FFF",
                        color: "#9CA3AF",
                        fontSize: "14px",
                        fontWeight: 500,
                        border: "0.3px solid #E5E7EB",
                        cursor: "not-allowed",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;