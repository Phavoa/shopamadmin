import React from "react";
import { Card } from "@/components/ui/card";
import { OrderStatistics } from "@/api/ordersApi";
import { User } from "@/types/auth";
import { getTierDisplayName } from "@/lib/tierUtils";
import SellerStatsGrid from "./SellerStatsGrid";
import SellerOverview from "./SellerOverview";
import SellerActivityLog from "./SellerActivityLog";
import SellerAddressSection from "./SellerAddressSection";

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

interface SellerProfileCardProps {
  displaySeller: DisplaySeller;
  user?: User | null;
  seller?: SellerProfile | null;
  orderStatistics: OrderStatistics | null;
  orderStatsLoading: boolean;
  orderStatsError: string | null;
  activeListingsCount: number;
  productsLoading: boolean;
  productsError: unknown;
}

const SellerProfileCard: React.FC<SellerProfileCardProps> = ({
  displaySeller,
  user,
  seller,
  orderStatistics,
  orderStatsLoading,
  orderStatsError,
  activeListingsCount,
  productsLoading,
  productsError,
}) => {
  return (
    <div className="min-h-screen col-span-7">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-transparent py-4 rounded-2xl shadow-none border border-gray-200 overflow-hidden">
          {/* Header Section with Stats Grid */}
          <SellerStatsGrid displaySeller={displaySeller} user={user} />

          {/* Overview Section */}
          <SellerOverview
            orderStatistics={orderStatistics}
            orderStatsLoading={orderStatsLoading}
            orderStatsError={orderStatsError}
            activeListingsCount={activeListingsCount}
            productsLoading={productsLoading}
            productsError={productsError}
          />

          {/* Activity Log Section */}
          <SellerActivityLog displaySeller={displaySeller} seller={seller} />

          {/* Address Section */}
          <SellerAddressSection user={user} />
        </Card>
      </div>
    </div>
  );
};

export default SellerProfileCard;
