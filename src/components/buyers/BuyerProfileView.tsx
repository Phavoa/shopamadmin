"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import type { User } from "@/types/auth";
import type { Buyer } from "@/types/buyer";

interface BuyerProfileViewProps {
  selectedBuyer: Buyer;
  onBack: () => void;
}

const BuyerProfileView: React.FC<BuyerProfileViewProps> = ({
  selectedBuyer,
  onBack,
}) => {
  // Get location from defaultAddress if available
  const getLocation = (user: User) => {
    if (user.defaultAddress) {
      return `${user.defaultAddress.city}, ${user.defaultAddress.state}`;
    }
    return "Not specified";
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <button
          onClick={onBack}
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
                  ID: {selectedBuyer.id.substring(0, 16)}...
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
                {selectedBuyer.firstName[0]}
                {selectedBuyer.lastName[0]}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 pb-6 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 mb-2">Total Spend</p>
                <p className="text-xl font-semibold text-black">
                  {selectedBuyer.totalSpend}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Social</p>
                <p className="text-base font-semibold text-black">
                  {selectedBuyer.followersCount || 0} followers
                </p>
                <p className="text-xs text-gray-500">
                  {selectedBuyer.followingCount || 0} following
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Verified</p>
                <span
                  className="inline-flex px-3 py-1.5 rounded-xl text-xs font-normal"
                  style={{
                    background: selectedBuyer.isVerified
                      ? "#D7FDD9"
                      : "#FEE2E2",
                    color: selectedBuyer.isVerified ? "#008D3F" : "#DC3545",
                  }}
                >
                  {selectedBuyer.isVerified ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Seller Status</p>
                {selectedBuyer.seller ? (
                  <span
                    className="inline-flex px-3 py-1.5 rounded-xl text-xs font-normal"
                    style={{
                      background:
                        selectedBuyer.seller.status === "ACTIVE"
                          ? "#D7FDD9"
                          : "#FFE9D5",
                      color:
                        selectedBuyer.seller.status === "ACTIVE"
                          ? "#008D3F"
                          : "#E67E22",
                    }}
                  >
                    {selectedBuyer.seller.status}
                  </span>
                ) : (
                  <span className="text-gray-500 text-xs">Not a seller</span>
                )}
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
                  <p className="text-black font-medium">{selectedBuyer.id}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="text-black font-medium">
                    {selectedBuyer.email}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Phone</p>
                  <p className="text-black font-medium">
                    {selectedBuyer.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Location</p>
                  <p className="text-black font-medium">
                    {getLocation(selectedBuyer)}
                  </p>
                </div>
                {selectedBuyer.seller && (
                  <>
                    <div>
                      <p className="text-gray-500 mb-1">Shop Name</p>
                      <p className="text-black font-medium">
                        {selectedBuyer.seller.shopName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Business Category</p>
                      <p className="text-black font-medium">
                        {selectedBuyer.seller.businessCategory}
                      </p>
                    </div>
                  </>
                )}
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
                  {selectedBuyer.defaultAddress?.state || "Not specified"}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1.5">City</p>
                <p className="text-base font-semibold text-black">
                  {selectedBuyer.defaultAddress?.city || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfileView;
