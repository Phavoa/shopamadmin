import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Loader2, Eye, Key, Ban } from "lucide-react";
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

interface SellersTableProps {
  sellers: DisplaySeller[];
  fetchingSellers: boolean;
  error: string | null;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSortChange: (newSortBy: string) => void;
}

const SellersTable: React.FC<SellersTableProps> = ({
  sellers,
  fetchingSellers,
  error,
  sortBy,
  sortDir,
  onSortChange,
}) => {
  return (
    <div className="px-6 pb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EAEAEB]">
              <th
                className="text-left py-3 px-4 text-sm font-medium text-[#4D5650] cursor-pointer hover:text-[#0f1720]"
                onClick={() => onSortChange("shopName")}
              >
                Seller ID
                {sortBy === "shopName" && (sortDir === "desc" ? "↓" : "↑")}
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Name
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Tier
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Last Live
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Reliability
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Strikes
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-medium text-[#4D5650] cursor-pointer hover:text-[#0f1720]"
                onClick={() => onSortChange("totalSales")}
              >
                Wallet{" "}
                {sortBy === "totalSales" && (sortDir === "desc" ? "↓" : "↑")}
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchingSellers ? (
              <tr>
                <td colSpan={9} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading sellers...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : sellers.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[#9ca3af]">
                  No sellers found
                </td>
              </tr>
            ) : (
              sellers.map((seller) => (
                <tr
                  key={seller.id}
                  className="border-b border-[#EAEAEB] hover:bg-[#F9F9F9]"
                >
                  <td className="py-4 px-4">
                    <p className="text-lg text-[#0f1720] truncate">
                      {seller.id}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-[#008D3F] truncate">
                      {seller.shopName}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={`rounded-full px-3 py-1 text-xs font-semibold border bg-[#D8FED9] text-[#4D5650] border-[#D8FED9]`}
                    >
                      Beginner
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-black truncate">
                      {formatDistanceToNow(new Date(seller.createdAt), {
                        addSuffix: true,
                      })}{" "}
                      (Bronze, 210 viewers)
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-[#008D3F] truncate">96%</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-[#4D5650] truncate">
                    0
                  </td>

                  <td className="py-4 px-4 text-sm text-[#4D5650]">
                    ₦{parseFloat(seller.totalSales).toLocaleString()}
                  </td>

                  <td className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="border border-gray-400 rounded-full w-8 h-8"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center justify-between border-b pb-2 rounded-none">
                          <span>View</span>
                          <Eye className="w-4 h-4 mr-2" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center justify-between border-b pb-2 rounded-none">
                          <span> Override</span>
                          <Key className="w-4 h-4 mr-2" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center justify-between pb-2 rounded-none">
                          <span> Suspend</span>
                          <Ban className="w-4 h-4 mr-2" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellersTable;
