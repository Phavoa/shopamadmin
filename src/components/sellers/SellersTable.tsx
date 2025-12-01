import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SellerRow from "./SellerRow";
import TableSkeleton from "./TableSkeleton";

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

interface SellersTableProps {
  sellers: DisplaySeller[];
  fetchingSellers: boolean;
  error: string | null;
  onViewSeller: (seller: DisplaySeller) => void;
  onSuspendSeller: (seller: DisplaySeller) => void;
  onStrikeSeller: (seller: DisplaySeller) => void;
}

const SellersTable: React.FC<SellersTableProps> = ({
  sellers,
  fetchingSellers,
  error,
  onViewSeller,
  onSuspendSeller,
  onStrikeSeller,
}) => {
  // Show skeleton loader when fetching data
  if (fetchingSellers) {
    return <TableSkeleton />;
  }

  return (
    <div className="rounded-md border-t">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left py-4 px-6 text-sm font-medium">
              Seller ID
            </TableHead>
            <TableHead className="text-left py-4 px-6 text-sm font-medium">
              Name
            </TableHead>
            <TableHead className="text-left py-4 px-6 text-sm font-medium">
              Tier
            </TableHead>
            <TableHead className="text-left py-4 px-6 text-sm font-medium">
              Last Live
            </TableHead>
            <TableHead className="text-left py-4 px-6 text-sm font-medium">
              Reliability
            </TableHead>
            <TableHead className="text-left py-4 px-6 text-sm font-medium">
              Strikes
            </TableHead>
            <TableHead className="text-left py-4 px-6 text-sm font-medium">
              Wallet
            </TableHead>
            <TableHead className="text-left py-4 px-6 text-sm font-medium">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-red-600">
                {error}
              </TableCell>
            </TableRow>
          ) : sellers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                No sellers found
              </TableCell>
            </TableRow>
          ) : (
            sellers.map((seller) => (
              <SellerRow
                key={seller.id}
                seller={seller}
                onViewSeller={onViewSeller}
                onSuspendSeller={onSuspendSeller}
                onStrikeSeller={onStrikeSeller}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SellersTable;