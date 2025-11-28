// src/app/logistics/track-order/page.tsx
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useGetOrderByIdQuery } from "@/api/orderApi";
import { useUpdateShipmentStatusByCodeMutation } from "@/api/shipmentApi";

interface TrackingStep {
  id: string;
  status: string;
  label: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export default function TrackOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useNotifications();

  const [trackingId, setTrackingId] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);

  // Mutation for updating shipment status
  const [updateShipmentStatus, { isLoading: isUpdatingStatus }] =
    useUpdateShipmentStatusByCodeMutation();

  // Get order ID from URL on mount
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setOrderId(idFromUrl);
    }
  }, [searchParams]);

  // Fetch order details using the API
  const {
    data: orderResponse,
    isLoading,
    error,
    refetch,
  } = useGetOrderByIdQuery(
    {
      id: orderId!,
      params: { populate: ["buyer", "seller", "shipment", "items"] },
    },
    { skip: !orderId }
  );

  const orderData = orderResponse?.data;

  // Default tracking steps
  const defaultTrackingSteps: TrackingStep[] = useMemo(
    () => [
      {
        id: "1",
        status: "AWAITING_SELLER_SHIPMENT",
        label: "Order Placed",
        description: "Order has been placed and awaiting seller shipment",
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: "2",
        status: "IN_TRANSIT",
        label: "In Transit to Hub",
        description: "Package is on its way to ShopAm Hub",
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: "3",
        status: "AT_SHOPAM_HUB",
        label: "Received at Hub",
        description: "Package has arrived at ShopAm Hub",
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: "4",
        status: "OUT_FOR_DELIVERY",
        label: "Out for Delivery",
        description: "Package is out for delivery to buyer",
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: "5",
        status: "DELIVERED",
        label: "Delivered",
        description: "Package has been delivered successfully",
        isCompleted: false,
        isCurrent: false,
      },
    ],
    []
  );

  // Calculate tracking steps based on shipment events
  const trackingSteps = useMemo(() => {
    if (!orderData?.shipment?.events) return defaultTrackingSteps;

    const currentStatus = orderData.shipment.status;
    const currentStatusIndex = defaultTrackingSteps.findIndex(
      (step) => step.status === currentStatus
    );

    return defaultTrackingSteps.map((step, index) => {
      const event = orderData.shipment?.events?.find(
        (e) => e.status === step.status
      );

      return {
        ...step,
        isCompleted: index < currentStatusIndex,
        isCurrent: index === currentStatusIndex,
        timestamp: event?.createdAt
          ? new Date(event.createdAt).toLocaleString()
          : undefined,
      };
    });
  }, [orderData, defaultTrackingSteps]);

  const handleSearch = useCallback(async () => {
    if (!trackingId.trim()) {
      showError("Please enter a tracking ID or order code");
      return;
    }

    // Navigate to the page with the tracking ID as a query parameter
    // In a real implementation, you'd search by tracking code first to get the order ID
    router.push(`/logistics/track-order?id=${trackingId}`);
  }, [trackingId, router, showError]);

  const handleUpdateStatus = useCallback(
    async (newStatus: string) => {
      if (!orderData) return;

      try {
        await updateShipmentStatus({
          data: {
            orderCode: orderData.orderCode,
            trackingCode: orderData.trackingCode,
            status: newStatus,
            note: `Status updated to ${newStatus} by admin`,
          },
        }).unwrap();

        showSuccess(`Shipment status updated to ${newStatus} successfully`);

        // Refetch to get updated data
        refetch();
      } catch (error) {
        console.error("Failed to update shipment status:", error);
        showError("Failed to update shipment status. Please try again.");
      }
    },
    [orderData, updateShipmentStatus, showSuccess, showError, refetch]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AWAITING_SELLER_SHIPMENT":
        return { color: "#E67E22", bg: "#FFE0C5", text: "Awaiting Shipment" };
      case "IN_TRANSIT":
        return { color: "#F813AB", bg: "#FFD6EF", text: "In Transit" };
      case "AT_SHOPAM_HUB":
        return { color: "#E67E22", bg: "#FFE8D4", text: "At Hub" };
      case "OUT_FOR_DELIVERY":
        return { color: "#0915FF", bg: "#DDE0FF", text: "Out for Delivery" };
      case "DELIVERED":
        return { color: "#02B753", bg: "#D1FFE3", text: "Delivered" };
      default:
        return { color: "#6B7280", bg: "#F3F4F6", text: status || "Unknown" };
    }
  };

  // Format price from kobo to naira
  const formatPrice = (kobo: string) => {
    const naira = parseInt(kobo) / 100;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(naira);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Track Order</h1>
              <p className="text-gray-600 mt-1">
                Enter an order ID or tracking code to view order status and
                update delivery progress
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-6 p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter Order ID or Tracking Code (e.g., cmi24lpa7002ues34sq4zwtj4)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isLoading ? "Searching..." : "Track Order"}
            </Button>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading Order Details...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch the order information.
            </p>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="p-12 text-center border-red-200 bg-red-50">
            <Package className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">
              Order Not Found
            </h3>
            <p className="text-red-600 max-w-md mx-auto mb-4">
              We couldn&apos;t find an order with that ID. Please check the ID
              and try again.
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-red-300"
            >
              Try Again
            </Button>
          </Card>
        )}

        {/* Order Details */}
        {orderData && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Info Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                Order Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Code:</span>
                  <span className="font-medium">{orderData.orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking ID:</span>
                  <span className="font-mono text-xs font-medium">
                    {orderData.trackingCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipment Status:</span>
                  <Badge
                    style={{
                      backgroundColor: getStatusColor(
                        orderData.shipment?.status || ""
                      ).bg,
                      color: getStatusColor(orderData.shipment?.status || "")
                        .color,
                    }}
                  >
                    {getStatusColor(orderData.shipment?.status || "").text}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Order Status:</span>
                  <Badge className="bg-blue-100 text-blue-600">
                    {orderData.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-medium">
                    {orderData.sellerProfile?.shopName ||
                      orderData.sellerProfile?.businessName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Buyer:</span>
                  <span className="font-medium">
                    {orderData.buyer?.firstName} {orderData.buyer?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">
                    {orderData.buyer?.phone || "N/A"}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {formatPrice(orderData.subtotalKobo)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                      {formatPrice(orderData.shippingKobo)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 pt-2 border-t font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">
                      {formatPrice(orderData.totalKobo)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Address Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                Addresses & Timeline
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Pickup Location</span>
                  <p className="font-medium">
                    {orderData.sellerProfile?.locationCity},{" "}
                    {orderData.sellerProfile?.locationState}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    Delivery Address
                  </span>
                  <p className="font-medium">
                    {orderData.shipToSnapshot?.lga},{" "}
                    {orderData.shipToSnapshot?.state}
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order Date:</span>
                    <span>
                      {new Date(orderData.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Last Updated:</span>
                    <span>
                      {new Date(orderData.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {orderData.items && orderData.items.length > 0 && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-gray-500 block mb-2">
                      Order Items ({orderData.items.length})
                    </span>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {orderData.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.title} x{item.qty}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.lineTotalKobo)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                Update Status
              </h2>
              <div className="space-y-2">
                <Button
                  onClick={() => handleUpdateStatus("IN_TRANSIT")}
                  disabled={orderData.shipment?.status === "DELIVERED"}
                  className="w-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center gap-2"
                >
                  Mark as In Transit
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("AT_SHOPAM_HUB")}
                  disabled={orderData.shipment?.status === "DELIVERED"}
                  className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Mark as Received at Hub
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("OUT_FOR_DELIVERY")}
                  disabled={orderData.shipment?.status === "DELIVERED"}
                  className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Mark as Out for Delivery
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("DELIVERED")}
                  disabled={orderData.shipment?.status === "DELIVERED"}
                  className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Delivered
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Each step is updated by staff/riders and reflects live for both
                buyer & seller.
              </p>
            </Card>
          </div>
        )}

        {/* Tracking Timeline */}
        {orderData && !isLoading && (
          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Tracking Timeline
            </h2>
            <div className="relative">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.isCompleted
                          ? "bg-green-500 text-white"
                          : step.isCurrent
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 min-h-[40px] ${
                          step.isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`font-medium ${
                          step.isCompleted || step.isCurrent
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </h3>
                      {step.isCurrent && (
                        <Badge className="bg-orange-100 text-orange-600 text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        step.isCompleted || step.isCurrent
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                    {step.timestamp && (
                      <p className="text-xs text-gray-400 mt-1">
                        {step.timestamp}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!orderData && !isLoading && !error && (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Order Selected
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter an order ID or tracking code above to view order details and
              update delivery status. You can also click on an order from the
              Lagos Hub Dashboard.
            </p>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
}
