import React from "react";
import { AnimatedWrapper } from "@/components/shared/AnimatedWrapper";
import InfoItem from "./InfoItem";

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

interface SellerProfile {
  userId: string;
  status: string;
  tier: string;
  shopName: string;
  businessCategory: string;
  locationCity: string;
  locationState: string;
  totalSales: string;
  createdAt: string;
  updatedAt?: string;
  businessName?: string;
}

interface SellerActivityLogProps {
  displaySeller: DisplaySeller;
  seller?: SellerProfile | null;
}

const SellerActivityLog: React.FC<SellerActivityLogProps> = ({
  displaySeller,
  seller,
}) => {
  return (
    <AnimatedWrapper animation="fadeIn" delay={0.5}>
      <div className="px-5 md:px-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
          Activity Log (Last 30 Days)
        </h2>
        <div className="space-y-2.5">
          <InfoItem
            text={`Profile created: ${new Date(
              displaySeller.createdAt
            ).toLocaleDateString()}`}
          />
          <InfoItem
            text={`Last updated: ${
              seller?.updatedAt
                ? new Date(seller.updatedAt).toLocaleDateString()
                : "N/A"
            }`}
          />
          {displaySeller.totalSales && (
            <InfoItem
              text={`Total sales recorded: ₦${parseFloat(
                displaySeller.totalSales
              ).toLocaleString()}`}
            />
          )}
          <InfoItem text={`Current status: ${displaySeller.status}`} />
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default SellerActivityLog;
