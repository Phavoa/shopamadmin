import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReferralsPaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const ReferralsPagination: React.FC<ReferralsPaginationProps> = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onNextPage,
  onPrevPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      {/* Results count */}
      <p className="text-sm text-gray-600">
        Showing {startIndex + 1}-{endIndex} of {totalItems} referrals
      </p>

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

export default ReferralsPagination;
