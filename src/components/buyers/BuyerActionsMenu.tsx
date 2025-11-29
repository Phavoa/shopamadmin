"use client";

import React from "react";
import type { Buyer } from "@/types/buyer";
import {
  ActionIcon,
  EyeIcon,
  BanIcon,
  StrikeIcon,
} from "@/components/buyers/BuyersIcons";

interface BuyerActionsMenuProps {
  buyer: Buyer;
  activeActionMenu: string | null;
  onToggleMenu: (buyerId: string) => void;
  onViewBuyer: (buyer: Buyer) => void;
  onSuspendBuyer: (buyer: Buyer) => void;
  onStrikeBuyer: (buyer: Buyer) => void;
}

const BuyerActionsMenu: React.FC<BuyerActionsMenuProps> = ({
  buyer,
  activeActionMenu,
  onToggleMenu,
  onViewBuyer,
  onSuspendBuyer,
  onStrikeBuyer,
}) => {
  return (
    <td className="py-4 px-6 relative">
      <button
        onClick={() => onToggleMenu(buyer.id)}
        className="hover:opacity-70 transition-opacity"
      >
        <ActionIcon />
      </button>

      {activeActionMenu === buyer.id && (
        <div
          className="absolute right-12 top-12 z-20 rounded-xl shadow-lg border border-gray-200"
          style={{
            width: "187px",
            padding: "4px 8px",
            background: "#FFF",
          }}
        >
          <button
            onClick={() => onViewBuyer(buyer)}
            className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50 border-b border-gray-100"
          >
            <span>View</span>
            <div
              className="flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                border: "0.2px solid rgba(0,0,0,0.3)",
              }}
            >
              <EyeIcon />
            </div>
          </button>
          <button
            onClick={() => onSuspendBuyer(buyer)}
            className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50 border-b border-gray-100"
          >
            <span>Suspend</span>
            <div
              className="flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                border: "0.2px solid rgba(0,0,0,0.3)",
                background: "#F4F4F4",
              }}
            >
              <BanIcon />
            </div>
          </button>
          <button
            onClick={() => onStrikeBuyer(buyer)}
            className="flex items-center justify-between w-full px-2 py-2 text-sm hover:bg-gray-50 rounded-lg"
          >
            <span>Strike</span>
            <div
              className="flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                border: "0.2px solid rgba(0,0,0,0.3)",
                background: "#F4F4F4",
              }}
            >
              <StrikeIcon />
            </div>
          </button>
        </div>
      )}
    </td>
  );
};

export default BuyerActionsMenu;
