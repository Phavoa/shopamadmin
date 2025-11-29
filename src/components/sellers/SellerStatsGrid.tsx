import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedWrapper } from "@/components/shared/AnimatedWrapper";
import { User } from "@/types/auth";

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

interface SellerStatsGridProps {
  displaySeller: DisplaySeller;
  user?: User | null;
}

interface StatItemProps {
  label: string;
  value: string;
  className?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div className={` border-gray-200 ${className}`}>
      <div className="text-xs md:text-sm text-gray-500 mb-1.5 font-normal whitespace-nowrap">
        {label}
      </div>
      <div className="text-sm md:text-base font-semibold text-gray-900 break-words">
        {value}
      </div>
    </div>
  );
};

const SellerStatsGrid: React.FC<SellerStatsGridProps> = ({
  displaySeller,
  user,
}) => {
  return (
    <AnimatedWrapper animation="fadeIn" delay={0.3}>
      <div className="px-5 md:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            Seller Profile - {displaySeller.shopName || "Unknown Shop"}
          </h1>
          <Avatar className="h-12 w-12 md:h-14 md:w-14">
            <AvatarImage
              src={user?.imageUrl || user?.seller?.logoUrl || ""}
              className="object-contain"
              alt={displaySeller.shopName || "Seller"}
            />
            <AvatarFallback className="bg-gray-700 text-white text-sm font-medium">
              {displaySeller.shopName
                ? displaySeller.shopName.substring(0, 2).toUpperCase()
                : "UN"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-12 gap-1 mt-6">
          <StatItem
            label="Total Sales"
            value={
              displaySeller.totalSales
                ? `₦${parseFloat(displaySeller.totalSales).toLocaleString()}`
                : "N/A"
            }
            className="col-span-2 md:col-span-2"
          />
          <StatItem
            label="Status"
            value={
              displaySeller.status.charAt(0).toUpperCase() +
              displaySeller.status.slice(1)
            }
            className="col-span-2"
          />
          <StatItem
            label="Strikes"
            value={displaySeller.strikes?.toString() || "0"}
            className="col-span-2"
          />
          <StatItem
            label="Category"
            value={displaySeller.businessCategory || "N/A"}
            className="col-span-3"
          />
          <StatItem
            label="Location"
            value={displaySeller.location || "N/A"}
            className="col-span-2 md:col-span-3"
          />
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default SellerStatsGrid;
