import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getStatusBadgeStyles, getTierBadgeStyles } from "@/lib/sellerUtils";

// Type for display seller data
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
}

interface SellerRowProps {
  seller: DisplaySeller;
}

const SellerRow: React.FC<SellerRowProps> = ({ seller }) => {
  return (
    <tr className="border-b border-[#EAEAEB] hover:bg-[#F9F9F9]">
      <td className="py-4 px-4">
        <p className="font-medium text-[#0f1720] truncate">{seller.shopName}</p>
      </td>
      <td className="py-4 px-4">
        <p className="text-[#0f1720] truncate">{seller.name}</p>
        <p className="text-sm text-[#9ca3af] truncate">{seller.email}</p>
      </td>
      <td className="py-4 px-4">
        <Badge
          className={`rounded-full px-3 py-1 text-xs font-semibold border ${getStatusBadgeStyles(
            seller.status
          )}`}
        >
          {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <Badge
          className={`rounded-full px-3 py-1 text-xs font-semibold border ${getTierBadgeStyles(
            seller.tier
          )}`}
        >
          {seller.tier}
        </Badge>
      </td>
      <td className="py-4 px-4 text-sm text-[#4D5650] truncate">
        {seller.businessCategory}
      </td>
      <td className="py-4 px-4 text-sm text-[#4D5650] truncate">
        {seller.location}
      </td>
      <td className="py-4 px-4 text-sm text-[#4D5650]">
        ₦{parseFloat(seller.totalSales).toLocaleString()}
      </td>
      <td className="py-4 px-4 text-sm text-[#4D5650]">
        {formatDistanceToNow(new Date(seller.createdAt), {
          addSuffix: true,
        })}
      </td>
      <td className="py-4 px-4">
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
};

export default SellerRow;
