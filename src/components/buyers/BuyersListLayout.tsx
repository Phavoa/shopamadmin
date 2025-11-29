"use client";

import React from "react";
import type { Buyer } from "@/types/buyer";
import BuyersTable from "./BuyersTable";
import BuyersPagination from "./BuyersPagination";

interface BuyersListLayoutProps {
  buyers: Buyer[];
  activeActionMenu: string | null;
  currentPage: number;
  hasNext: boolean;
  isLoading: boolean;
  onToggleActionMenu: (buyerId: string) => void;
  onViewBuyer: (buyer: Buyer) => void;
  onSuspendBuyer: (buyer: Buyer) => void;
  onStrikeBuyer: (buyer: Buyer) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const BuyersListLayout: React.FC<BuyersListLayoutProps> = ({
  buyers,
  activeActionMenu,
  currentPage,
  hasNext,
  isLoading,
  onToggleActionMenu,
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
        activeActionMenu={activeActionMenu}
        onToggleActionMenu={onToggleActionMenu}
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
