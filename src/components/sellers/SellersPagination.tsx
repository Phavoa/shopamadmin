import React from "react";
import PremiumPagination from "@/components/shared/PremiumPagination";

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

interface SellersPaginationProps {
  sellers: DisplaySeller[];
  hasNext: boolean;
  hasPrev: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  currentPage?: number;
  onGoToFirst?: () => void;
}

const SellersPagination: React.FC<SellersPaginationProps> = ({
  sellers,
  hasNext,
  hasPrev,
  onNextPage,
  onPrevPage,
  currentPage = 1,
  onGoToFirst = () => {},
}) => {
  return (
    <PremiumPagination
      currentPage={currentPage}
      hasNext={hasNext}
      hasPrev={hasPrev}
      isLoading={false}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onGoToFirst={onGoToFirst}
      count={sellers.length}
      entityName="sellers"
    />
  );
};

export default SellersPagination;
