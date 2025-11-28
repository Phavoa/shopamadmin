// src/components/logistics/DeliveriesTable.tsx

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageIcon } from "./LogisticsIcons";
import { ErrorFallback } from "@/components/ui/error-boundary";
import { OrdersEmptyState } from "@/components/ui/empty-state";

interface Order {
  id: string;
  orderCode?: string;
  trackingId?: string;
  seller?: string;
  buyer?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  phone: string;
  status: string;
  shipment?: {
    status: string;
    hubId?: string;
    assignedRiderId?: string | null;
  };
}

interface DeliveriesTableProps {
  deliveries: Order[];
  onAssignRider: (orderId: string) => void;
  onTrackOrder: () => void;
  onShowAssignedMessage: (orderId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const statusColor = (status: string) => {
  switch (status) {
    case "AWAITING_SELLER_SHIPMENT":
      return {
        color: "#E67E22",
        bg: "#FFE0C5",
        text: "Awaiting Seller Shipment",
      };

    case "IN_TRANSIT":
      return {
        color: "#F813AB",
        bg: "#FFD6EF",
        text: "In Transit",
      };

    case "AT_SHOPAM_HUB":
      return {
        color: "#E67E22",
        bg: "#FFE8D4",
        text: "At ShopAm Hub",
      };

    case "OUT_FOR_DELIVERY":
      return {
        color: "#0915FF",
        bg: "#DDE0FF",
        text: "Out For Delivery",
      };

    case "DELIVERED":
      return {
        color: "#02B753",
        bg: "#D1FFE3",
        text: "Delivered",
      };

    default:
      return {
        color: "#d6f813ff",
        bg: "#F5FFBD",
        text: "Awaiting Seller Shipment",
      };
  }
};

export default function DeliveriesTable({
  deliveries,
  onAssignRider,
  onTrackOrder,
  onShowAssignedMessage,
  isLoading = false,
  error = null,
  onRefresh,
}: DeliveriesTableProps) {
  const router = useRouter();

  const handleOrderClick = (orderId: string) => {
    router.push(`/logistics/track-order?id=${orderId}`);
  };

  // Handle error state
  if (error) {
    return (
      <Card className="mb-6">
        <ErrorFallback
          error={new Error(error)}
          onRetry={onRefresh}
          title="Failed to load deliveries"
          description="There was an error loading the deliveries. Please try again."
        />
      </Card>
    );
  }

  // Handle empty state
  if (!isLoading && deliveries.length === 0) {
    return (
      <Card className="mb-6">
        <OrdersEmptyState
          onRefresh={onRefresh || (() => {})}
          isLoading={isLoading}
        />
      </Card>
    );
  }

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
                Tracking ID
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
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleOrderClick(order.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {order.orderCode || order.id}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm font-mono text-xs">
                  {order.trackingId || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">{order.buyer}</td>
                <td className="px-4 py-3 text-sm">{order.deliveryAddress}</td>
                <td className="px-4 py-3 text-sm">{order.phone}</td>
                <td className="px-4 py-3">
                  <Badge
                    className="text-white"
                    style={{
                      backgroundColor: statusColor(order.status).bg,
                      color: statusColor(order.status).color,
                    }}
                  >
                    {statusColor(order.status).text}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        order.shipment?.assignedRiderId
                          ? onShowAssignedMessage(order.id)
                          : onAssignRider(order.id)
                      }
                      disabled={!!order.shipment?.assignedRiderId}
                      className={`${
                        order.shipment?.assignedRiderId
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {order.shipment?.assignedRiderId
                        ? "Rider Assigned"
                        : "Assign Rider"}
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
