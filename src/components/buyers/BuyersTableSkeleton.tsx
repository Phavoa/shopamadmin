"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BuyersTableSkeleton: React.FC = () => {
  // Generate skeleton rows (typically 5-10 rows for loading state)
  const skeletonRows = Array.from({ length: 8 }, (_, index) => index);

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
          {skeletonRows.map((index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </TableCell>
              <TableCell>
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </TableCell>
              <TableCell>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </TableCell>
              <TableCell>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
              </TableCell>
              <TableCell>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BuyersTableSkeleton;
