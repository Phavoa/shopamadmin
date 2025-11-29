/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, CreditCard, File, X, ZoomIn } from "lucide-react";
import {
  approveSeller,
  suspendSeller,
  getSellers,
  SellerProfileVM,
} from "@/api/sellerApi";
import { useNotifications } from "@/hooks/useNotifications";

// Type for display seller data
interface DisplaySeller {
  id: string;
  name: string;
  email: string;
  status: string;
  submittedDate: string;
  documents: string[];
  govIdUrl?: string;
  businessDocUrl?: string;
  businessName?: string;
  businessCategory?: string;
  locationState?: string;
  locationCity?: string;
  shopName?: string;
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
    case "underreview":
    case "under_review":
      return "bg-[#FED7AA] text-[#9A3412] border-[#FED7AA]";
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
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
  }>({ isOpen: false, imageUrl: "", title: "" });
  const { showSuccess, showError } = useNotifications();

  const handleReview = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
  };

  const handleOpenDocument = (imageUrl: string, title: string) => {
    setDocumentModal({ isOpen: true, imageUrl, title });
  };

  const handleCloseDocument = () => {
    setDocumentModal({ isOpen: false, imageUrl: "", title: "" });
  };

  // Fetch sellers on component mount
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setFetchingSellers(true);
        setError(null);
        const response = await getSellers({
          limit: 50,
          // status: "UNDER_REVIEW",
        });
        const sellersData = response.data.items;

        const displaySellers: DisplaySeller[] = sellersData.map(
          (seller: SellerProfileVM) => {
            // Normalize status to lowercase for consistent display
            const normalizedStatus = seller.status
              .toLowerCase()
              .replace("_", "");

            return {
              id: seller.userId,
              name: `${seller.userFirstName} ${seller.userLastName}`,
              email: seller.userEmail,
              status: normalizedStatus,
              submittedDate: seller.createdAt,
              documents: [
                seller.govIdUrl ? "Government ID" : null,
                seller.businessDocUrl ? "Business Document" : null,
              ].filter(Boolean) as string[],
              govIdUrl: seller.govIdUrl,
              businessDocUrl: seller.businessDocUrl,
              businessName: seller.businessName,
              businessCategory: seller.businessCategory,
              locationState: seller.locationState,
              locationCity: seller.locationCity,
              shopName: seller.shopName,
            };
          }
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
        showSuccess(
          `Seller ${selectedSeller.name} has been approved successfully`
        );
        setSelectedSeller(null);
      } catch (error) {
        console.error("Failed to approve seller:", error);
        showError("Failed to approve seller. Please try again.");
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
        showSuccess(`Seller ${selectedSeller.name} has been rejected`);
        setSelectedSeller(null);
      } catch (error) {
        console.error("Failed to reject seller:", error);
        showError("Failed to reject seller. Please try again.");
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
                            <span className="text-gray-600">
                              Loading sellers...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-red-600"
                        >
                          {error}
                        </td>
                      </tr>
                    ) : sellers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-gray-500"
                        >
                          No sellers under review at the moment
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
                              {seller.status === "underreview"
                                ? "Under Review"
                                : seller.status.charAt(0).toUpperCase() +
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
                              {selectedSeller?.id === seller.id
                                ? "Review"
                                : "View"}
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

                  {/* Seller Information */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-black mb-2">
                        Business Information
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Shop:</span>{" "}
                          {selectedSeller.shopName || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Business:</span>{" "}
                          {selectedSeller.businessName || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Category:</span>{" "}
                          {selectedSeller.businessCategory || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {selectedSeller.locationCity &&
                          selectedSeller.locationState
                            ? `${selectedSeller.locationCity}, ${selectedSeller.locationState}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="space-y-3 mb-6">
                    {selectedSeller.govIdUrl && (
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
                        <span className="text-sm text-gray-700">
                          Government ID
                        </span>
                      </div>
                    )}

                    {selectedSeller.businessDocUrl && (
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
                        <span className="text-sm text-gray-700">
                          Business Document
                        </span>
                      </div>
                    )}

                    {!selectedSeller.govIdUrl &&
                      !selectedSeller.businessDocUrl && (
                        <div className="text-center text-gray-500 text-sm py-4">
                          No documents available
                        </div>
                      )}
                  </div>

                  {/* Document Image Preview */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-black mb-3">
                      Document Preview
                    </h3>
                    {selectedSeller.govIdUrl ||
                    selectedSeller.businessDocUrl ? (
                      <div className="grid grid-cols-1 gap-4">
                        {selectedSeller.govIdUrl && (
                          <div>
                            <p className="text-xs text-gray-600 mb-2">
                              Government ID
                            </p>
                            <div
                              style={{
                                width: "100%",
                                height: "150px",
                                border: "1px solid #E5E7EB",
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#FAFAFA",
                                cursor: "pointer",
                                position: "relative",
                              }}
                              className="hover:border-[#E67E22] hover:shadow-md transition-all duration-200"
                              onClick={() =>
                                handleOpenDocument(
                                  selectedSeller.govIdUrl!,
                                  "Government ID"
                                )
                              }
                            >
                              <img
                                src={selectedSeller.govIdUrl}
                                alt="Government ID"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.parentElement!.innerHTML = `
                                    <div class="flex items-center justify-center h-full text-gray-500">
                                      <div class="text-center">
                                        <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p class="text-xs">Image unavailable</p>
                                      </div>
                                    </div>
                                  `;
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all duration-200">
                                <ZoomIn className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedSeller.businessDocUrl && (
                          <div>
                            <p className="text-xs text-gray-600 mb-2">
                              Business Document
                            </p>
                            <div
                              style={{
                                width: "100%",
                                height: "150px",
                                border: "1px solid #E5E7EB",
                                borderRadius: "8px",
                                overflow: "hidden",
                                background: "#FAFAFA",
                                cursor: "pointer",
                                position: "relative",
                              }}
                              className="hover:border-[#E67E22] hover:shadow-md transition-all duration-200"
                              onClick={() =>
                                handleOpenDocument(
                                  selectedSeller.businessDocUrl!,
                                  "Business Document"
                                )
                              }
                            >
                              <img
                                src={selectedSeller.businessDocUrl}
                                alt="Business Document"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  target.parentElement!.innerHTML = `
                                    <div class="flex items-center justify-center h-full text-gray-500">
                                      <div class="text-center">
                                        <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <p class="text-xs">Image unavailable</p>
                                      </div>
                                    </div>
                                  `;
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all duration-200">
                                <ZoomIn className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
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
                            No documents to preview
                          </p>
                        </div>
                      </div>
                    )}
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

      {/* Document Modal */}
      {documentModal.isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={handleCloseDocument}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {documentModal.title}
              </h3>
              <button
                onClick={handleCloseDocument}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 flex items-center justify-center max-h-[calc(90vh-80px)] overflow-hidden">
              <img
                src={documentModal.imageUrl}
                alt={documentModal.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = `
                    <div class="flex items-center justify-center h-64 text-gray-500">
                      <div class="text-center">
                        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p class="text-sm">Failed to load image</p>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
