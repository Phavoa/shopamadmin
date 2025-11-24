// src/components/logistics/ExceptionsTable.tsx

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Exception {
  order: string;
  customer: string;
  issue: string;
  address: string;
  phone: string;
  status: string;
}

interface ExceptionsTableProps {
  exceptions: Exception[];
  onInvestigate: (orderId: string) => void;
}

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    Pending: "bg-gray-200 text-gray-800",
    "Awaiting Seller Shipment": "bg-orange-200",
    "In Transit to Shopam": "bg-green-200 text-green-800",
    "At Hub": "bg-blue-200",
    "Assigned (Rider A)": "bg-orange-200",
    Delivered: "bg-green-200 text-green-800",
    Exception: "bg-red-200 text-red-500",
  };
  return statusMap[status] || "bg-gray-200";
};

export default function ExceptionsTable({
  exceptions,
  onInvestigate,
}: ExceptionsTableProps) {
  return (
    <Card>
      <div className="p-4 border-b flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h2 className="font-semibold text-lg">Exceptions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Order
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Issue
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {exceptions.map((exception, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{exception.order}</td>
                <td className="px-4 py-3 text-sm">{exception.customer}</td>
                <td className="px-4 py-3 text-sm">{exception.issue}</td>
                <td className="px-4 py-3 text-sm">{exception.address}</td>
                <td className="px-4 py-3 text-sm">{exception.phone}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={`${getStatusColor(
                      exception.status
                    )} text-gray-800`}
                  >
                    {exception.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onInvestigate(exception.order)}
                      variant="outline"
                      className="border-green-500 text-white bg-green-700 hover:bg-green-800"
                    >
                      Investigate
                    </Button>
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Manage Issue
                    </Button>
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
