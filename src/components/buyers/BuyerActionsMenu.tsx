"use client";
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
import type { Buyer } from "@/types/buyer";

// Import your ActionIcon if you want to keep it
import { ActionIcon } from "@/components/buyers/BuyersIcons";

interface BuyerActionsMenuProps {
  buyer: Buyer;
  onViewBuyer: (buyer: Buyer) => void;
  onSuspendBuyer: (buyer: Buyer) => void;
  onStrikeBuyer: (buyer: Buyer) => void;
}

const BuyerActionsMenu: React.FC<BuyerActionsMenuProps> = ({
  buyer,
  onViewBuyer,
  onSuspendBuyer,
  onStrikeBuyer,
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
            onClick={() => onViewBuyer(buyer)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>View</span>
            <Eye className="w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStrikeBuyer(buyer)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>Strike</span>
            <AlertTriangle className="w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSuspendBuyer(buyer)}
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

export default BuyerActionsMenu;