import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Loader2,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";

// Type for display buyer data
interface DisplayBuyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  totalOrders: number;
  totalSpend: string;
  status: string;
  createdAt: string;
}

interface BuyersTableProps {
  buyers: DisplayBuyer[];
  fetchingBuyers: boolean;
  error: string | null;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSortChange: (newSortBy: string) => void;
}

const BuyersTable: React.FC<BuyersTableProps> = ({
  buyers,
  fetchingBuyers,
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
              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Buyer ID
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Name
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Email/Phone
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Verified
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Total Order
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Total Spend
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Status
              </th>

              <th className="text-left py-3 px-4 text-sm font-medium text-[#4D5650]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchingBuyers ? (
              <tr>
                <td colSpan={8} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading buyers...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : buyers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#9ca3af]">
                  No buyers found
                </td>
              </tr>
            ) : (
              buyers.map((buyer) => (
                <tr
                  key={buyer.id}
                  className="border-b border-[#EAEAEB] hover:bg-[#F9F9F9]"
                >
                  <td className="py-4 px-4">
                    <p className="text-lg text-[#0f1720] truncate">
                      {buyer.id}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-[#008D3F] truncate">
                      {buyer.name}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-[#4D5650]">
                      <p className="truncate">{buyer.email}</p>
                      <p className="text-xs text-gray-500 truncate">
                        / {buyer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {buyer.verified ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-[#4D5650] truncate">
                      {buyer.totalOrders}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-sm text-[#4D5650]">
                    ₦{parseFloat(buyer.totalSpend).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        buyer.status.toLowerCase() === "active"
                          ? "bg-[#D8FED9] text-[#4D5650] border-[#D8FED9]"
                          : buyer.status.toLowerCase() === "review"
                          ? "bg-[#FEF3C7] text-[#92400E] border-[#FEF3C7]"
                          : "bg-[#FEE2E2] text-[#DC2626] border-[#FEE2E2]"
                      }`}
                    >
                      {buyer.status}
                    </Badge>
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
                          <span>Suspend</span>
                          <Ban className="w-4 h-4 mr-2" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center justify-between pb-2 rounded-none">
                          <span>Verify</span>
                          <Shield className="w-4 h-4 mr-2" />
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

export default BuyersTable;
