import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton: React.FC = () => {
  // Generate 5 skeleton rows for loading state
  const skeletonRows = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div className="rounded-md border">
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
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              <TableCell className="py-4 px-6">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="py-4 px-6">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="py-4 px-6">
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell className="py-4 px-6">
                <Skeleton className="h-4 w-40" />
              </TableCell>
              <TableCell className="py-4 px-6">
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className="py-4 px-6">
                <Skeleton className="h-4 w-8" />
              </TableCell>
              <TableCell className="py-4 px-6">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="py-4 px-6">
                <Skeleton className="h-8 w-8 rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
