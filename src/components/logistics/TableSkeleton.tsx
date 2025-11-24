// src/components/logistics/TableSkeleton.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function PickupRequestsTableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <Card className="mb-6">
      <div className="p-4 border-b flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="w-48 h-6" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-24 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-32 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-16 h-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">
                  <Skeleton className="w-20 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-32 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-24 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-40 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-20 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-16 h-6" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-8" />
                    <Skeleton className="w-16 h-8" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function DeliveriesTableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <Card className="mb-6">
      <div className="p-4 border-b flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="w-32 h-6" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-24 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-40 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                <Skeleton className="w-16 h-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">
                  <Skeleton className="w-20 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-32 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-24 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-40 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-20 h-4" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="w-16 h-6" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-8" />
                    <Skeleton className="w-16 h-8" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
