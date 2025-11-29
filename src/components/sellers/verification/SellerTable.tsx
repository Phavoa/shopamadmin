import React from "react";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "./StatusBadge";
import { DisplaySeller, formatTimeAgo } from "./verification-utils";

interface SellerTableProps {
  sellers: DisplaySeller[];
  fetchingSellers: boolean;
  error: string | null;
  selectedSeller: DisplaySeller | null;
  onSellerSelect: (seller: DisplaySeller) => void;
}

const SellerTable: React.FC<SellerTableProps> = ({
  sellers,
  fetchingSellers,
  error,
  selectedSeller,
  onSellerSelect,
}) => {
  return (
    <div
      style={{
        borderRadius: "18px",
        border: "0.3px solid rgba(0, 0, 0, 0.20)",
        background: "#FFF",
      }}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-left py-4 px-6 text-sm font-medium text-black">
                Seller Name
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-sm font-medium text-black">
                Status
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-sm font-medium text-black">
                Submitted
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-sm font-medium text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchingSellers ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#E67E22] mr-2" />
                    <span className="text-gray-600">Loading sellers...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-red-600"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : sellers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-gray-500"
                >
                  No sellers to review
                </TableCell>
              </TableRow>
            ) : (
              sellers.map((seller) => (
                <TableRow
                  key={seller.userId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="py-4 px-6 text-sm text-black">
                    {seller.shopName}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <StatusBadge status={seller.status} />
                  </TableCell>
                  <TableCell className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    {formatTimeAgo(seller.createdAt)}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <button
                      onClick={() => onSellerSelect(seller)}
                      style={{
                        padding: "6px 20px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        background:
                          selectedSeller?.userId === seller.userId
                            ? "#E67E22"
                            : "#FFF",
                        color:
                          selectedSeller?.userId === seller.userId
                            ? "#FFF"
                            : "#000",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                    >
                      {selectedSeller?.userId === seller.userId
                        ? "Review"
                        : "View"}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SellerTable;
