"use client";

import React from "react";
import type { Buyer } from "@/types/buyer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircleIcon } from "@/components/buyers/BuyersIcons";
import BuyerActionsMenu from "./BuyerActionsMenu";

interface BuyersTableProps {
  buyers: Buyer[];
  onViewBuyer: (buyer: Buyer) => void;
  onSuspendBuyer: (buyer: Buyer) => void;
  onStrikeBuyer: (buyer: Buyer) => void;
}

const BuyersTable: React.FC<BuyersTableProps> = ({
  buyers,
  onViewBuyer,
  onSuspendBuyer,
  onStrikeBuyer,
}) => {
  // Format currency
  const formatCurrency = (amount: string) => {
    const numAmount = parseInt(amount) / 100;
    return `₦${numAmount.toLocaleString()}`;
  };

  // Format random currency for display
  const formatRandomAmount = () => {
    return (Math.floor(Math.random() * 500000) + 10000).toLocaleString();
  };

  // Format random orders for display
  const formatRandomOrders = () => {
    return Math.floor(Math.random() * 50) + 1;
  };

  const getBuyerName = (buyer: Buyer) => {
    return buyer.name || `${buyer.firstName} ${buyer.lastName}`;
  };

  const getStatus = (buyer: Buyer) => {
    return !buyer.seller || buyer.seller.status === "ACTIVE"
      ? "ACTIVE"
      : buyer.seller.status;
  };

  const getStatusStyle = (buyer: Buyer) => {
    const status = getStatus(buyer);
    const isActive = !buyer.seller || buyer.seller.status === "ACTIVE";

    return {
      background: isActive ? "#D7FDD9" : "#FFE9D5",
      color: isActive ? "#008D3F" : "#E67E22",
    };
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buyer ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email/Phone</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buyers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="py-8 text-center text-gray-500">
                No buyers found
              </TableCell>
            </TableRow>
          ) : (
            buyers.map((buyer) => (
              <TableRow key={buyer.id}>
                <TableCell className="text-sm text-black">
                  {buyer.id.substring(0, 8)}
                </TableCell>
                <TableCell className="text-sm text-black">
                  {getBuyerName(buyer)}
                </TableCell>
                <TableCell className="text-sm text-black">
                  {buyer.email}
                  <br />
                  {buyer.phone || "Not provided"}
                </TableCell>
                <TableCell>
                  <CheckCircleIcon />
                </TableCell>
                <TableCell className="text-sm text-black">
                  {formatRandomOrders()}
                </TableCell>
                <TableCell className="text-sm font-medium text-black">
                  ₦{formatRandomAmount()}
                </TableCell>
                <TableCell className="text-sm text-black">
                  {buyer.lastActivity}
                </TableCell>
                <TableCell>
                  <div
                    className="inline-flex justify-center items-center rounded-xl"
                    style={{
                      padding: "5px 8px",
                      ...getStatusStyle(buyer),
                    }}
                  >
                    <span
                      style={{
                        textAlign: "center",
                        fontSize: "10px",
                        fontWeight: 600,
                      }}
                    >
                      {getStatus(buyer)}
                    </span>
                  </div>
                </TableCell>
                <BuyerActionsMenu
                  buyer={buyer}
                  onViewBuyer={onViewBuyer}
                  onSuspendBuyer={onSuspendBuyer}
                  onStrikeBuyer={onStrikeBuyer}
                />
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BuyersTable;
