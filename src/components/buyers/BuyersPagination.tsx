import React from "react";
import PremiumPagination from "@/components/shared/PremiumPagination";

interface BuyersPaginationProps {
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  isLoading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToFirst?: () => void;
  count: number;
}

const BuyersPagination: React.FC<BuyersPaginationProps> = ({
  currentPage,
  hasNext,
  hasPrev,
  isLoading,
  onNextPage,
  onPrevPage,
  onGoToFirst = () => {},
  count,
}) => {
  return (
    <PremiumPagination
      currentPage={currentPage}
      hasNext={hasNext}
      hasPrev={hasPrev}
      isLoading={isLoading}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onGoToFirst={onGoToFirst}
      count={count}
      entityName="buyers"
    />
  );
};

export default BuyersPagination;
