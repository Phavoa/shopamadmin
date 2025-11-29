import React from "react";
import { ChevronLeft } from "lucide-react";
import { getTierDisplayName } from "@/lib/tierUtils";

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

interface SellerProfileViewProps {
  selectedSeller: DisplaySeller;
  onBack: () => void;
}

const SellerProfileView: React.FC<SellerProfileViewProps> = ({
  selectedSeller,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Seller Profile</h1>
      </div>

      {/* Back Button */}
      <div className="px-6 py-4">
        <button
          onClick={onBack}
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
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Sales</p>
                  <p className="text-lg font-semibold">
                    ₦{parseFloat(selectedSeller.totalSales).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-lg font-semibold capitalize">
                    {selectedSeller.status}
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

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {selectedSeller.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedSeller.email}
                </p>
                <p>
                  <strong>Tier:</strong>{" "}
                  {getTierDisplayName(selectedSeller.tier)}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedSeller.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="col-span-4">
            <div
              style={{
                padding: "24px",
                borderRadius: "18px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                background: "#FFF",
              }}
            >
              <h3 className="text-lg font-semibold mb-4">Seller Actions</h3>
              <p className="text-sm text-gray-600">
                Additional actions can be added here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfileView;
