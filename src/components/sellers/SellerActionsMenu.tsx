import React from "react";
import { TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle, Ban } from "lucide-react";
import ActionIcon from "./ActionIcon";

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

interface SellerActionsMenuProps {
  seller: DisplaySeller;
  onViewSeller: (seller: DisplaySeller) => void;
  onSuspendSeller: (seller: DisplaySeller) => void;
  onStrikeSeller: (seller: DisplaySeller) => void;
}

const SellerActionsMenu: React.FC<SellerActionsMenuProps> = ({
  seller,
  onViewSeller,
  onSuspendSeller,
  onStrikeSeller,
}) => {
  return (
    <TableCell className="py-4 px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ActionIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => onViewSeller(seller)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>View</span>
            <Eye className="w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStrikeSeller(seller)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>Strike</span>
            <AlertTriangle className="w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSuspendSeller(seller)}
            className="flex items-center justify-between cursor-pointer text-red-600"
          >
            <span>Suspend</span>
            <Ban className="w-4 h-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  );
};

export default SellerActionsMenu;