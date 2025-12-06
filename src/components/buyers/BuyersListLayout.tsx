"use client";
import React from "react";
import type { Buyer } from "@/types/buyer";
import BuyersTable from "./BuyersTable";
import BuyersPagination from "./BuyersPagination";

interface BuyersListLayoutProps {
  buyers: Buyer[];
  currentPage: number;
  hasNext: boolean;
  isLoading: boolean;
  onViewBuyer: (buyer: Buyer) => void;
  onSuspendBuyer: (buyer: Buyer) => void;
  onStrikeBuyer: (buyer: Buyer) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const BuyersListLayout: React.FC<BuyersListLayoutProps> = ({
  buyers,
  currentPage,
  hasNext,
  isLoading,
  onViewBuyer,
  onSuspendBuyer,
  onStrikeBuyer,
  onNextPage,
  onPrevPage,
}) => {
  return (
    <div className="min-h-screen border-t rounded-md mt-8">
      <BuyersTable
        buyers={buyers}
        onViewBuyer={onViewBuyer}
        onSuspendBuyer={onSuspendBuyer}
        onStrikeBuyer={onStrikeBuyer}
      />
      <BuyersPagination
        currentPage={currentPage}
        hasNext={hasNext}
        isLoading={isLoading}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </div>
  );
};

export default BuyersListLayout;