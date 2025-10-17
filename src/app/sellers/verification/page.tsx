"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "approved":
      return "default"; // We'll customize this
    case "rejected":
      return "destructive";
    case "pending":
    default:
      return "secondary";
  }
};

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-[#D8FED9] text-[#4D5650] border-[#D8FED9]";
    case "rejected":
      return "bg-[#FFC5C4] text-[#4D5650] border-[#FFC5C4]";
    case "pending":
    default:
      return "bg-[#E3CBC7] text-[#4D5650] border-[#E3CBC7]";
  }
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
    <div className="flex-1 space-y-6 py-10">
      <div className="flex gap-6">
        {/* Main Table Section */}
        <div className="flex-1 border-t rounded-xl ">
          <div className="border-[#EAEAEB] shadow-[0_1px_2px_rgba(77,86,80,0.06)] rounded-lg">
            <div className="px-6 py-6">
              <div className="text-lg font-semibold text-[#0f1720]">
                Verification Requests
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#EAEAEB]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                        Seller
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                        Submitted
                      </th>

                      <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchingSellers ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center">
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            Loading sellers...
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
                          className="py-8 text-center text-[#9ca3af]"
                        >
                          No pending sellers to review
                        </td>
                      </tr>
                    ) : (
                      sellers.map((seller) => (
                        <tr
                          key={seller.id}
                          className="border-b border-[#EAEAEB] hover:bg-[#F9F9F9]"
                        >
                          <td className="py-4 px-4">
                            <p className=" truncate text-lg text-[#0f1720]">
                              {seller.name}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              className={`rounded-full px-3 py-1 text-xs font-semibold border ${getStatusBadgeStyles(
                                seller.status
                              )}`}
                            >
                              {seller.status.charAt(0).toUpperCase() +
                                seller.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-[#4D5650] truncate">
                            {formatDistanceToNow(
                              new Date(seller.submittedDate),
                              {
                                addSuffix: true,
                              }
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#EAEAEB] text-[#4D5650] hover:text-[#F9F9F9] px-4 py-1 h-8 text-xs"
                                onClick={() => handleReview(seller)}
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview Section */}
        <div className="w-lg border rounded-xl ">
          <div className="border-[#EAEAEB] shadow-[0_1px_2px_rgba(77,86,80,0.06)] rounded-lg">
            <div className="px-6 py-6">
              <div className="text-lg font-semibold text-[#0f1720]">
                Document Preview
              </div>
            </div>
            <div className="px-6 pb-6">
              {selectedSeller ? (
                <>
                  <div className="border-2 border-dashed border-[#EAEAEB] rounded-lg h-[220px] flex items-center justify-center bg-[#EAEAEA]">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-[#9ca3af] mx-auto mb-2" />
                      <p className="text-sm text-[#9ca3af]">
                        Document preview for {selectedSeller.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex mt-4 space-y-2 gap-4">
                    <Button
                      className="flex-1 bg-[#E57D28] hover:bg-[#E57D28]/90 text-white"
                      onClick={handleApprove}
                      disabled={loading}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {loading ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-[#EAEAEB] text-[#4D5650] hover:bg-[#F9F9F9]"
                      onClick={handleReject}
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {loading ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-2 border-dashed border-[#EAEAEB] rounded-lg h-[220px] flex items-center justify-center bg-[#EAEAEA]">
                    <div className="text-center">
                      <FileText className="w-12 h-12 text-[#9ca3af] mx-auto mb-2" />
                      <p className="text-sm text-[#9ca3af]">
                        Select a seller to review
                      </p>
                    </div>
                  </div>
                  <div className="flex mt-4 space-y-2">
                    <Button
                      className="w-full bg-[#E57D28] hover:bg-[#E57D28]/90 text-white"
                      disabled
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[#EAEAEB] text-[#4D5650] hover:bg-[#F9F9F9]"
                      disabled
                    >
                      Reject
                    </Button>
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
