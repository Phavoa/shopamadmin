/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, Loader2, CreditCard, File, X, CheckCircle, XCircle, ZoomIn } from "lucide-react";
import {
  approveSeller,
  suspendSeller,
  getSellers,
  SellerProfileVM,
} from "@/api/sellerApi";

type DisplaySeller = SellerProfileVM

const getStatusBadgeStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-[#D1FAE5] text-[#065F46] border-[#D1FAE5]";
    case "SUSPENDED":
      return "bg-[#FEE2E2] text-[#991B1B] border-[#FEE2E2]";
    case "PENDING":
    case "UNDER_REVIEW":
    default:
      return "bg-[#FED7AA] text-[#9A3412] border-[#FED7AA]";
  }
};

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
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSellers, setFetchingSellers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setFetchingSellers(true);
        setError(null);
        
        const response = await getSellers({ 
          limit: 50,
          populate: "user"
        });
        
        setSellers(response.data.items);
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
    if (!selectedSeller) return;
    
    setLoading(true);
    try {
      await approveSeller(selectedSeller.userId);
      
      setSellers((prev) =>
        prev.map((seller) =>
          seller.userId === selectedSeller.userId
            ? { ...seller, status: "ACTIVE" }
            : seller
        )
      );
      
      setShowApproveModal(false);
      setSelectedSeller(null);
    } catch (error) {
      console.error("Failed to approve seller:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSeller) return;
    
    setLoading(true);
    try {
      await suspendSeller(selectedSeller.userId);
      
      setSellers((prev) =>
        prev.map((seller) =>
          seller.userId === selectedSeller.userId
            ? { ...seller, status: "SUSPENDED" }
            : seller
        )
      );
      
      setShowRejectModal(false);
      setSelectedSeller(null);
    } catch (error) {
      console.error("Failed to reject seller:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDocumentModal = (url: string, title: string) => {
    setSelectedDocument({ url, title });
    setShowDocumentModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Seller Document Verification</h1>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            <div style={{ borderRadius: "18px", border: "0.3px solid rgba(0, 0, 0, 0.20)", background: "#FFF" }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 text-sm font-medium text-black">Seller Name</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-black">Status</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-black">Submitted</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-black">Actions</th>
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
                        <td colSpan={4} className="py-8 text-center text-red-600">{error}</td>
                      </tr>
                    ) : sellers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">No sellers to review</td>
                      </tr>
                    ) : (
                      sellers.map((seller) => (
                        <tr key={seller.userId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm text-black">{seller.shopName}</td>
                          <td className="py-4 px-6">
                            <Badge className={`rounded-full px-3 py-1 text-xs font-medium border ${getStatusBadgeStyles(seller.status)}`}>
                              {seller.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">{formatTimeAgo(seller.createdAt)}</td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => setSelectedSeller(seller)}
                              style={{
                                padding: "6px 20px",
                                borderRadius: "8px",
                                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                                background: selectedSeller?.userId === seller.userId ? "#E67E22" : "#FFF",
                                color: selectedSeller?.userId === seller.userId ? "#FFF" : "#000",
                                fontSize: "14px",
                                fontWeight: 500,
                                cursor: "pointer",
                              }}
                            >
                              {selectedSeller?.userId === seller.userId ? "Reviewing" : "View"}
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

          <div className="col-span-5">
            <div style={{ padding: "24px", borderRadius: "18px", border: "0.3px solid rgba(0, 0, 0, 0.20)", background: "#FFF" }}>
              {selectedSeller ? (
                <>
                  <h2 className="text-lg font-semibold text-black mb-6">Details - {selectedSeller.shopName}</h2>

                  <div className="mb-6 space-y-2 text-sm">
                    <p><strong>Business Name:</strong> {selectedSeller.businessName || "N/A"}</p>
                    <p><strong>Category:</strong> {selectedSeller.businessCategory || "N/A"}</p>
                    <p><strong>Location:</strong> {selectedSeller.locationCity}, {selectedSeller.locationState}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {selectedSeller.govIdUrl && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => openDocumentModal(selectedSeller.govIdUrl, "Government ID")}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FFF", border: "0.3px solid rgba(0, 0, 0, 0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <CreditCard className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-gray-700">Government ID</span>
                          <p className="text-xs text-blue-600">Click to preview</p>
                        </div>
                        <ZoomIn className="w-4 h-4 text-gray-400" />
                      </div>
                    )}

                    {selectedSeller.businessDocUrl && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => openDocumentModal(selectedSeller.businessDocUrl, "Business Document")}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FFF", border: "0.3px solid rgba(0, 0, 0, 0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <File className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-gray-700">Business Document</span>
                          <p className="text-xs text-blue-600">Click to preview</p>
                        </div>
                        <ZoomIn className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-black mb-3">Document Preview</h3>
                    <div style={{ width: "100%", height: "200px", border: "2px dashed #E5E7EB", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA", cursor: selectedSeller.govIdUrl ? "pointer" : "default" }} onClick={() => selectedSeller.govIdUrl && openDocumentModal(selectedSeller.govIdUrl, "Government ID")}>
                      {selectedSeller.govIdUrl ? (
                        <img src={selectedSeller.govIdUrl} alt="Government ID" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-center">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No document uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowApproveModal(true)}
                      disabled={loading}
                      style={{ flex: 1, padding: "12px", borderRadius: "8px", background: "#E67E22", color: "#FFF", fontSize: "14px", fontWeight: 500, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={loading}
                      style={{ flex: 1, padding: "12px", borderRadius: "8px", background: "#FFF", color: "#EF4444", fontSize: "14px", fontWeight: 500, border: "0.3px solid rgba(0, 0, 0, 0.20)", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                    >
                      Reject
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-black mb-6">Details</h2>
                  <div style={{ width: "100%", height: "300px", border: "2px dashed #E5E7EB", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA", marginBottom: "24px" }}>
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Select a seller to review documents</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button disabled style={{ flex: 1, padding: "12px", borderRadius: "8px", background: "#E5E7EB", color: "#9CA3AF", fontSize: "14px", fontWeight: 500, border: "none", cursor: "not-allowed" }}>
                      Approve
                    </button>
                    <button disabled style={{ flex: 1, padding: "12px", borderRadius: "8px", background: "#FFF", color: "#9CA3AF", fontSize: "14px", fontWeight: 500, border: "0.3px solid #E5E7EB", cursor: "not-allowed" }}>
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] flex items-center justify-center z-50" onClick={() => setShowApproveModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" style={{ borderRadius: "18px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-black">Approve Seller</h2>
              </div>
              <button onClick={() => setShowApproveModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to approve <strong>{selectedSeller.shopName}</strong>? They will gain full access to sell on the platform.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  'Approve'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[3px] flex items-center justify-center z-50" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" style={{ borderRadius: "18px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-black">Reject Seller</h2>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to reject <strong>{selectedSeller.shopName}</strong>? Their application will be denied and they won&apos;t be able to sell on the platform.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  'Reject'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDocumentModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto" style={{ borderRadius: "18px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">{selectedDocument.title}</h2>
              <button onClick={() => setShowDocumentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
              <img src={selectedDocument.url} alt={selectedDocument.title} className="max-w-full max-h-[70vh] object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;