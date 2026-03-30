import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTierBadgeStyles } from "@/lib/tierUtils";
import SellerActionsMenu from "./SellerActionsMenu";

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
  effectiveTierName?: string;
}

interface SellerRowProps {
  seller: DisplaySeller;
  onViewSeller: (seller: DisplaySeller) => void;
  onSuspendSeller: (seller: DisplaySeller) => void;
  onStrikeSeller: (seller: DisplaySeller) => void;
}

const SellerRow: React.FC<SellerRowProps> = ({
  seller,
  onViewSeller,
  onSuspendSeller,
  onStrikeSeller,
}) => {
  return (
    <TableRow>
      <TableCell className="py-4 px-6 text-sm text-black">
        {seller.id.substring(0, 8)}
      </TableCell>
      <TableCell className="py-4 px-6 text-sm font-medium text-green-600">
        {seller.shopName}
      </TableCell>
      <TableCell className="py-4 px-6">
        {seller.effectiveTierName && (
          <div className="text-sm text-gray-700 mt-0.5 ml-1">
            {seller.effectiveTierName}
          </div>
        )}
      </TableCell>
      <TableCell className="py-4 px-6 text-sm text-black">
        {seller.lastLive}
      </TableCell>
      <TableCell className="py-4 px-6 text-sm font-medium text-green-600">
        {seller.reliability}
      </TableCell>
      <TableCell className="py-4 px-6 text-sm text-black">
        {seller.strikes && seller.strikes > 0
          ? `Strike(${seller.strikes}/3)`
          : "0"}
      </TableCell>
      <TableCell className="py-4 px-6 text-sm text-black">
        ₦{parseFloat(seller.totalSales).toLocaleString()}
      </TableCell>
      <SellerActionsMenu
        seller={seller}
        onViewSeller={onViewSeller}
        onSuspendSeller={onSuspendSeller}
        onStrikeSeller={onStrikeSeller}
      />
    </TableRow>
  );
};

export default SellerRow;
