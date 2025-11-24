// src/components/logistics/DeliveriesTable.tsx

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageIcon } from "./LogisticsIcons";

interface Order {
  id: string;
  seller?: string;
  buyer?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  phone: string;
  status: string;
}

interface DeliveriesTableProps {
  deliveries: Order[];
  onAssignRider: (orderId: string) => void;
  onTrackOrder: () => void;
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

export default function DeliveriesTable({
  deliveries,
  onAssignRider,
  onTrackOrder,
}: DeliveriesTableProps) {
  return (
    <Card className="mb-6">
      <div className="p-4 border-b flex items-center gap-2">
        <PackageIcon className="w-5 h-5 text-green-600" />
        <h2 className="font-semibold text-lg">Deliveries (Hub → Buyer)</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Order
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Buyer
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Delivery Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{order.id}</td>
                <td className="px-4 py-3 text-sm">{order.buyer}</td>
                <td className="px-4 py-3 text-sm">{order.deliveryAddress}</td>
                <td className="px-4 py-3 text-sm">{order.phone}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={`${getStatusColor(order.status)} text-gray-800`}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAssignRider(order.id)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Assign Rider
                    </Button>
                    <Button
                      size="sm"
                      onClick={onTrackOrder}
                      variant="outline"
                      className="border-green-500 text-white bg-green-700 hover:bg-green-800"
                    >
                      Track
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
