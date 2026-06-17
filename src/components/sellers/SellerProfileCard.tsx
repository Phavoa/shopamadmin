import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { OrderStatistics } from "@/api/ordersApi";
import { User } from "@/types/auth";
import { getTierDisplayName } from "@/lib/tierUtils";
import SellerStatsGrid from "./SellerStatsGrid";
import SellerOverview from "./SellerOverview";
import SellerActivityLog from "./SellerActivityLog";
import SellerAddressSection from "./SellerAddressSection";
import EditUserModal from "@/components/shared/EditUserModal";

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
  productsError: string | Error | null | undefined;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="min-h-screen col-span-7">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-transparent py-4 rounded-2xl shadow-none border border-gray-200 overflow-hidden relative">
          {/* Edit Button */}
          <div className="flex justify-end px-5 md:px-6 mb-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:border-orange-500 hover:text-orange-600 bg-white text-gray-700 shadow-sm transition-all"
            >
              Edit Details
            </button>
          </div>

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
            user={user}
            lastLive={displaySeller.lastLive}
            nextSlot={displaySeller.nextSlot}
            walletBalance={displaySeller.walletBalance}
          />

          {/* Activity Log Section */}
          <SellerActivityLog displaySeller={displaySeller} seller={seller} />

          {/* Address Section */}
          <SellerAddressSection user={user} />
        </Card>
      </div>

      {user && (
        <EditUserModal
          isOpen={isEditModalOpen}
          userId={user.id}
          currentUserData={{
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone || undefined,
            imageUrl: user.imageUrl || undefined,
            defaultAddress: user.defaultAddress,
          }}
          onOpenChange={setIsEditModalOpen}
        />
      )}
    </div>
  );
};

export default SellerProfileCard;

