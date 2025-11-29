import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
}

const SellersPagination: React.FC<SellersPaginationProps> = ({
  sellers,
  hasNext,
  hasPrev,
  onNextPage,
  onPrevPage,
  currentPage = 1,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      {/* Results count */}
      <p className="text-sm text-gray-600">Showing {sellers.length} sellers</p>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevPage}
          disabled={!hasPrev}
          className="h-9 w-9 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex items-center px-3 py-1.5 text-sm font-medium bg-[#E67E22] text-white rounded-md">
          {currentPage}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!hasNext}
          className="h-9 w-9 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SellersPagination;
