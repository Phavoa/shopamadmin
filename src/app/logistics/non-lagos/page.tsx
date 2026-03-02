// src/app/logistics/non-lagos/page.tsx
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Search } from "lucide-react";
import { useGetOrdersQuery, Order } from "@/api/orderApi";
import { useCreateRiderMutation, useGetRidersQuery } from "@/api/ridersApi";
import {
  useAssignRiderToShipmentMutation,
  useUpdateShipmentStatusByCodeMutation,
} from "@/api/shipmentApi";
import {
  useGetOrderExceptionsQuery,
  useRequestMoreEvidenceMutation,
  useResolveExceptionMutation,
  OrderException,
} from "@/api/orderExceptionsApi";
import { useNotifications } from "@/hooks/useNotifications";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Import all components
import KPIGrid from "@/components/logistics/KPIGrid";
import PickupRequestsTable from "@/components/logistics/PickupRequestsTable";
import DeliveriesTable from "@/components/logistics/DeliveriesTable";
import {
  PickupRequestsTableSkeleton,
  DeliveriesTableSkeleton,
} from "@/components/logistics/TableSkeleton";
import RiderStatus from "@/components/logistics/RiderStatus";
import ExceptionsTable from "@/components/logistics/ExceptionsTable";
import AddRiderModal from "@/components/logistics/AddRiderModal";
import AddShopModal from "@/components/logistics/AddShopModal";
import AssignRiderModal from "@/components/logistics/AssignRiderModal";
import TrackOrderModal from "@/components/logistics/TrackOrderModal";
import InvestigateExceptionModal from "@/components/logistics/InvestigateExceptionModal";
import RequestMoreEvidenceModal from "@/components/logistics/RequestMoreEvidenceModal";
import ResolveExceptionModal from "@/components/logistics/ResolveExceptionModal";

interface LogisticsOrder {
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

interface Exception {
  order: string; // Exception ID for actions
  customer: string;
  issue: string;
  address: string;
  phone: string;
  status: string;
  orderId?: string; // Original order ID for display
}

interface Rider {
  name: string;
  status: string;
  color: string;
}

export default function NonLagosHubDashboard() {
  const router = useRouter();
  const { showSuccess, showError, handleAsyncOperation } = useNotifications();

  // Modal states
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [showAssignRiderModal, setShowAssignRiderModal] = useState(false);
  const [showTrackOrderModal, setShowTrackOrderModal] = useState(false);
  const [showInvestigateModal, setShowInvestigateModal] = useState(false);
  const [showRequestMoreEvidenceModal, setShowRequestMoreEvidenceModal] =
    useState(false);
  const [showResolveExceptionModal, setShowResolveExceptionModal] =
    useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [selectedException, setSelectedException] = useState<string>("");
  const [selectedExceptionData, setSelectedExceptionData] =
    useState<OrderException | null>(null);

  // API calls with optimized query parameters
  const {
    data: pickupOrdersData,
    isLoading: pickupLoading,
    error: pickupError,
    refetch: refetchPickupOrders,
  } = useGetOrdersQuery({
    pickup: true,
    populate: ["buyer", "seller", "shipment"],
    IsNonLagosOrder: true,
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 50,
  });

  const {
    data: deliveryOrdersData,
    isLoading: deliveryLoading,
    error: deliveryError,
    refetch: refetchDeliveryOrders,
  } = useGetOrdersQuery({
    delivery: true,
    populate: ["buyer", "seller", "shipment"],
    IsNonLagosOrder: true,
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 50,
  });

  // Riders API
  const [createRider, { isLoading: isCreatingRider }] =
    useCreateRiderMutation();
  const {
    data: ridersData,
    isLoading: ridersLoading,
    error: ridersError,
    refetch: refetchRiders,
  } = useGetRidersQuery({
    limit: 50,
  });

  // Shipment API mutations
  const [assignRiderToShipment, { isLoading: isAssigningRider }] =
    useAssignRiderToShipmentMutation();
  const [updateShipmentStatusByCode, { isLoading: isUpdatingStatus }] =
    useUpdateShipmentStatusByCodeMutation();

  // Order Exceptions API
  const [requestMoreEvidence, { isLoading: isRequestingEvidence }] =
    useRequestMoreEvidenceMutation();
  const [resolveException, { isLoading: isResolvingException }] =
    useResolveExceptionMutation();

  // Get all order exceptions
  const {
    data: orderExceptionsData,
    isLoading: exceptionsLoading,
    error: exceptionsError,
    refetch: refetchExceptions,
  } = useGetOrderExceptionsQuery({
    params: {
      limit: 50,
      sortBy: "createdAt",
      sortDir: "desc",
      populate: ["buyer", "seller", "order"],
    },
  });

  // Error handling with useEffect to prevent infinite re-renders
  useEffect(() => {
    if (pickupError) {
      console.error("Pickup orders error:", pickupError);
    }
    if (deliveryError) {
      console.error("Delivery orders error:", deliveryError);
    }
    if (ridersError) {
      console.error("Riders data error:", ridersError);
    }
    if (exceptionsError) {
      console.error("Order exceptions error:", exceptionsError);
    }
  }, [pickupError, deliveryError, ridersError, exceptionsError]);

  // Optimized refresh function
  const refreshAllData = useCallback(async () => {
    try {
      await Promise.all([
        refetchPickupOrders(),
        refetchDeliveryOrders(),
        refetchRiders(),
        refetchExceptions(),
      ]);
      showSuccess("Data refreshed successfully");
    } catch (error) {
      showError("Failed to refresh data. Please try again.");
    }
  }, [
    refetchPickupOrders,
    refetchDeliveryOrders,
    refetchRiders,
    refetchExceptions,
    showSuccess,
    showError,
  ]);

  // Transform API data with useMemo for performance optimization
  const pickupRequests = useMemo((): LogisticsOrder[] => {
    if (!pickupOrdersData?.data?.items) return [];

    return pickupOrdersData.data.items.map((order: Order) => ({
      id: order.id,
      orderCode: order.orderCode,
      trackingId: order.trackingCode,
      seller:
        order.sellerProfile?.shopName ||
        order.sellerProfile?.businessName ||
        "Unknown Seller",
      pickupAddress: order.shipFromSnapshot?.state || "Address not available",
      phone: order.buyer?.phone || "Phone not available",
      status: order.shipment?.status || "AWAITING_SELLER_SHIPMENT",
      shipment: order.shipment,
    }));
  }, [pickupOrdersData]);

  const deliveries = useMemo((): LogisticsOrder[] => {
    if (!deliveryOrdersData?.data?.items) return [];

    return deliveryOrdersData.data.items.map((order: Order) => ({
      id: order.id,
      orderCode: order.orderCode,
      trackingId: order.trackingCode,
      buyer:
        order.buyer?.firstName && order.buyer?.lastName
          ? `${order.buyer.firstName} ${order.buyer.lastName}`
          : order.buyer?.email || "Unknown Buyer",
      deliveryAddress:
        order.shipToSnapshot?.lga ||
        order.shipToSnapshot?.state ||
        "Address not available",
      phone: order.buyer?.phone || "Phone not available",
      status: order.shipment?.status || "AWAITING_SELLER_SHIPMENT",
      shipment: order.shipment,
    }));
  }, [deliveryOrdersData]);

  // Calculate KPIs with useMemo - uses memoized pickupRequests and deliveries
  const kpis = useMemo(() => {
    const totalExceptions = orderExceptionsData?.data?.items?.length || 0;
    return {
      ordersToday:
        (pickupOrdersData?.data?.items?.length || 0) +
        (deliveryOrdersData?.data?.items?.length || 0),
      pickRequests: pickupRequests.length,
      atHub: deliveries.filter(
        (d: LogisticsOrder) => d.status === "AT_SHOPAM_HUB"
      ).length,
      waitingForDelivery: deliveries.filter(
        (d: LogisticsOrder) =>
          d.status !== "DELIVERED" && d.status !== "CANCELLED"
      ).length,
      exceptions: totalExceptions,
    };
  }, [
    pickupOrdersData,
    deliveryOrdersData,
    pickupRequests,
    deliveries,
    orderExceptionsData,
  ]);

  // Transform API data for exceptions table
  const exceptions = useMemo<Exception[]>(() => {
    if (!orderExceptionsData?.data?.items) return [];

    return orderExceptionsData.data.items.map((exception: OrderException) => ({
      order: exception.id, // Use exception ID for actions
      customer:
        exception.buyer?.firstName && exception.buyer?.lastName
          ? `${exception.buyer.firstName} ${exception.buyer.lastName}`
          : exception.buyer?.email || "Unknown Customer",
      issue: exception.description || exception.type || "No description",
      address: exception.buyer?.address || "Address not available",
      phone: exception.buyer?.phone || "Phone not available",
      status: exception.status,
      orderId: exception.orderId, // Keep order ID for display
    }));
  }, [orderExceptionsData]);

  const riders = useMemo<Rider[]>(
    () => [
      { name: "Rider Paul", status: "Available", color: "green" },
      { name: "Rider Obi", status: "On Delivery", color: "blue" },
      { name: "Rider Seyi", status: "Picking Up", color: "blue-700" },
      { name: "Rider Ahmed", status: "Offline", color: "gray" },
    ],
    []
  );

  // Event handlers
  const handleAssignRider = useCallback((orderId: string) => {
    setSelectedOrder(orderId);
    setShowAssignRiderModal(true);
  }, []);

  const handleInvestigate = useCallback(
    (exceptionId: string) => {
      const exception = orderExceptionsData?.data?.items?.find(
        (ex: OrderException) => ex.id === exceptionId
      );
      if (exception) {
        setSelectedExceptionData(exception);
        setSelectedOrder(exception.orderId);
        setShowInvestigateModal(true);
      }
    },
    [orderExceptionsData]
  );

  const handleRequestMoreEvidence = useCallback((exceptionId: string) => {
    setSelectedException(exceptionId);
    setSelectedOrder(""); // Clear selectedOrder since we're using exceptionId
    setShowRequestMoreEvidenceModal(true);
  }, []);

  const handleResolveException = useCallback((exceptionId: string) => {
    setSelectedException(exceptionId);
    setSelectedOrder(""); // Clear selectedOrder since we're using exceptionId
    setShowResolveExceptionModal(true);
  }, []);

  const handleRequestMoreEvidenceSubmit = useCallback(
    async (orderId: string, note: string) => {
      // Find the exception to get the actual order ID
      const exception = orderExceptionsData?.data?.items?.find(
        (ex: OrderException) => ex.id === selectedException
      );
      if (!exception) {
        showError("Exception not found");
        return;
      }

      await handleAsyncOperation(
        () =>
          requestMoreEvidence({
            orderId: exception.orderId,
            exId: selectedException,
            data: { note },
          }).unwrap(),
        {
          onSuccess: () => {
            setShowRequestMoreEvidenceModal(false);
            setSelectedException("");
            setSelectedOrder("");
            showSuccess("Evidence request sent successfully");
            refetchExceptions();
          },
          successMessage: "",
          showErrorToast: true,
        }
      );
    },
    [
      requestMoreEvidence,
      selectedException,
      orderExceptionsData,
      refetchExceptions,
      showSuccess,
      handleAsyncOperation,
    ]
  );

  const handleResolveExceptionSubmit = useCallback(
    async (orderId: string, status: "RESOLVED" | "REJECTED") => {
      // Find the exception to get the actual order ID
      const exception = orderExceptionsData?.data?.items?.find(
        (ex: OrderException) => ex.id === selectedException
      );
      if (!exception) {
        showError("Exception not found");
        return;
      }

      await handleAsyncOperation(
        () =>
          resolveException({
            orderId: exception.orderId,
            exId: selectedException,
            data: { status },
          }).unwrap(),
        {
          onSuccess: () => {
            setShowResolveExceptionModal(false);
            setSelectedException("");
            setSelectedOrder("");
            showSuccess(`Exception ${status.toLowerCase()} successfully`);
            refetchExceptions();
          },
          successMessage: "",
          showErrorToast: true,
        }
      );
    },
    [
      resolveException,
      selectedException,
      orderExceptionsData,
      refetchExceptions,
      showSuccess,
      handleAsyncOperation,
    ]
  );

  const handleCreateRider = useCallback(
    async (riderData: {
      name: string;
      phone: string;
      rideType: string;
      plateNo: string;
    }) => {
      await handleAsyncOperation(() => createRider(riderData).unwrap(), {
        onSuccess: () => {
          setShowAddRiderModal(false);
          showSuccess("Rider created successfully");
          refetchRiders();
        },
        successMessage: "",
        showErrorToast: true,
      });
    },
    [createRider, showSuccess, refetchRiders, handleAsyncOperation]
  );

  const handleAssignRiderToShipment = useCallback(
    async (orderId: string, riderId: string) => {
      await handleAsyncOperation(
        () => assignRiderToShipment({ orderId, data: { riderId } }).unwrap(),
        {
          onSuccess: () => {
            setShowAssignRiderModal(false);
            setSelectedOrder("");
            showSuccess("Rider assigned successfully");
            refreshAllData();
          },
          successMessage: "",
          showErrorToast: true,
        }
      );
    },
    [assignRiderToShipment, showSuccess, refreshAllData, handleAsyncOperation]
  );

  const handleShowAssignedMessage = useCallback(
    (orderId: string) => {
      showError(
        `A rider has already been assigned to this order. Order ID: ${orderId}`,
        {
          duration: 5000,
        }
      );
    },
    [showError]
  );

  const handleOpenTrackOrderModal = useCallback(() => {
    setShowTrackOrderModal(true);
  }, []);

  const handleRefreshAfterStatusUpdate = useCallback(async () => {
    try {
      await Promise.all([refetchPickupOrders(), refetchDeliveryOrders()]);
    } catch (error) {
      showError("Failed to refresh data after update");
    }
  }, [refetchPickupOrders, refetchDeliveryOrders, showError]);

  const handleCloseAssignRiderModal = useCallback(() => {
    setShowAssignRiderModal(false);
    setSelectedOrder("");
  }, []);

  // Derived loading state
  const isRefreshing = pickupLoading || deliveryLoading;

  // Get error messages for display - properly handle RTK Query error types
  const getErrorMessage = (error: unknown): string | null => {
    if (!error) return null;

    // Handle FetchBaseQueryError
    if (typeof error === "object" && error !== null && "status" in error) {
      const fetchError = error as {
        status: number | string;
        data?: unknown;
        error?: string;
      };
      if (fetchError.error) return fetchError.error;
      if (fetchError.data && typeof fetchError.data === "object") {
        const data = fetchError.data as { message?: string };
        return data.message || `Error: ${fetchError.status}`;
      }
      return `Error: ${fetchError.status}`;
    }

    // Handle SerializedError
    if (typeof error === "object" && error !== null && "message" in error) {
      return (error as { message: string }).message;
    }

    return "An unknown error occurred";
  };

  const pickupErrorMessage = getErrorMessage(pickupError);
  const deliveryErrorMessage = getErrorMessage(deliveryError);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Non-Lagos Hub Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time logistics management and order tracking
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/logistics/track-order")}
              className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Track Order
            </Button>

            <Button
              onClick={() => setShowAddRiderModal(true)}
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
              disabled={isCreatingRider}
            >
              <Plus className="w-5 h-5" />
              {isCreatingRider ? "Creating..." : "Add Rider"}
            </Button>

            <Button
              onClick={() => setShowAddShopModal(true)}
              className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Shop
            </Button>

            <Button
              onClick={refreshAllData}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* KPI Grid - uses memoized kpis */}
        <KPIGrid kpis={kpis} />

        {/* Pickup Requests Table */}
        <ErrorBoundary>
          {pickupLoading ? (
            <PickupRequestsTableSkeleton />
          ) : (
            <PickupRequestsTable
              pickupRequests={pickupRequests}
              onAssignRider={handleAssignRider}
              onShowAssignedMessage={handleShowAssignedMessage}
              isLoading={pickupLoading}
              error={pickupErrorMessage}
              onRefresh={refetchPickupOrders}
            />
          )}
        </ErrorBoundary>

        {/* Deliveries Table */}
        <ErrorBoundary>
          {deliveryLoading ? (
            <DeliveriesTableSkeleton />
          ) : (
            <DeliveriesTable
              deliveries={deliveries}
              onAssignRider={handleAssignRider}
              onTrackOrder={handleOpenTrackOrderModal}
              onShowAssignedMessage={handleShowAssignedMessage}
              isLoading={deliveryLoading}
              error={deliveryErrorMessage}
              onRefresh={refetchDeliveryOrders}
            />
          )}
        </ErrorBoundary>

        {/* Rider Status */}
        <RiderStatus riders={riders} />

        <ExceptionsTable
          exceptions={exceptions}
          onInvestigate={handleInvestigate}
          onRequestMoreEvidence={handleRequestMoreEvidence}
          onResolveException={handleResolveException}
          isLoading={exceptionsLoading}
          error={getErrorMessage(exceptionsError)}
          onRefresh={refetchExceptions}
        />

        {/* Modals */}
        <AddRiderModal
          isOpen={showAddRiderModal}
          onClose={() => setShowAddRiderModal(false)}
          onCreateRider={handleCreateRider}
          isLoading={isCreatingRider}
        />

        <AddShopModal
          isOpen={showAddShopModal}
          onClose={() => setShowAddShopModal(false)}
        />

        <AssignRiderModal
          isOpen={showAssignRiderModal}
          onClose={handleCloseAssignRiderModal}
          riders={ridersData?.data?.items || []}
          isLoading={ridersLoading || isAssigningRider}
          selectedOrder={selectedOrder}
          onAssignRider={handleAssignRiderToShipment}
        />

        <TrackOrderModal
          isOpen={showTrackOrderModal}
          onClose={() => setShowTrackOrderModal(false)}
          onStatusUpdate={handleRefreshAfterStatusUpdate}
        />

        <InvestigateExceptionModal
          isOpen={showInvestigateModal}
          onClose={() => {
            setShowInvestigateModal(false);
            setSelectedExceptionData(null);
            setSelectedOrder("");
          }}
          exception={selectedExceptionData}
        />

        <RequestMoreEvidenceModal
          isOpen={showRequestMoreEvidenceModal}
          onClose={() => {
            setShowRequestMoreEvidenceModal(false);
            setSelectedException("");
          }}
          exceptionId={selectedException}
          orderId={
            orderExceptionsData?.data?.items?.find(
              (ex: OrderException) => ex.id === selectedException
            )?.orderId || ""
          }
          onSubmit={handleRequestMoreEvidenceSubmit}
          isLoading={isRequestingEvidence}
        />

        <ResolveExceptionModal
          isOpen={showResolveExceptionModal}
          onClose={() => {
            setShowResolveExceptionModal(false);
            setSelectedException("");
          }}
          exceptionId={selectedException}
          orderId={
            orderExceptionsData?.data?.items?.find(
              (ex: OrderException) => ex.id === selectedException
            )?.orderId || ""
          }
          onResolve={handleResolveExceptionSubmit}
          isLoading={isResolvingException}
        />
      </div>
    </ErrorBoundary>
  );
}
