// src/app/logistics/non-lagos/page.tsx
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Search, LayoutDashboard, Loader2 } from "lucide-react";
import { useGetOrdersQuery, Order, GetOrdersParams } from "@/api/orderApi";
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
  GetOrderExceptionsParams,
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
  email?: string;
  status: string;
  shipment?: {
    status: string;
    hubId?: string;
    assignedRiderId?: string | null;
    hub?: any;
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
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  // Pagination States
  const [pickupPage, setPickupPage] = useState(1);
  const [pickupParams, setPickupParams] = useState<GetOrdersParams>({
    pickup: true,
    populate: [
      "items",
      "items.product",
      "payments",
      "buyer",
      "seller",
      "seller.user",
      "shipment",
      "shipment.events",
      "checkoutSession",
      "shipment.hub",
    ],
    isNonLagosOrder: true,
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 10,
  });

  const [deliveryPage, setDeliveryPage] = useState(1);
  const [deliveryParams, setDeliveryParams] = useState<GetOrdersParams>({
    delivery: true,
    populate: ["buyer", "seller", "shipment", "shipment.hub"],
    isNonLagosOrder: true,
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 10,
  });

  const [exceptionPage, setExceptionPage] = useState(1);
  const [exceptionParams, setExceptionParams] = useState<GetOrderExceptionsParams>({
    limit: 10,
    sortBy: "createdAt",
    sortDir: "desc",
    populate: ["buyer", "seller", "order"],
  });

  // API calls with optimized query parameters
  const {
    data: pickupOrdersData,
    isLoading: pickupLoading,
    error: pickupError,
    refetch: refetchPickupOrders,
  } = useGetOrdersQuery(pickupParams);

  const {
    data: deliveryOrdersData,
    isLoading: deliveryLoading,
    error: deliveryError,
    refetch: refetchDeliveryOrders,
  } = useGetOrdersQuery(deliveryParams);

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
  } = useGetOrderExceptionsQuery({ params: exceptionParams });

  // Pagination Handlers
  const handlePickupNext = useCallback(() => {
    if (pickupOrdersData?.data?.nextCursor) {
      setPickupPage((prev) => prev + 1);
      setPickupParams((prev) => ({
        ...prev,
        after: pickupOrdersData.data.nextCursor ?? undefined,
        before: undefined,
      }));
    }
  }, [pickupOrdersData]);

  const handlePickupPrev = useCallback(() => {
    if (pickupOrdersData?.data?.prevCursor) {
      setPickupPage((prev) => Math.max(1, prev - 1));
      setPickupParams((prev) => ({
        ...prev,
        before: pickupOrdersData.data.prevCursor ?? undefined,
        after: undefined,
      }));
    }
  }, [pickupOrdersData]);

  const handlePickupLimitChange = useCallback((newLimit: number) => {
    setPickupPage(1);
    setPickupParams((prev) => ({
      ...prev,
      limit: newLimit,
      after: undefined,
      before: undefined,
    }));
  }, []);

  const handleGoToFirstPickup = useCallback(() => {
    setPickupPage(1);
    setPickupParams((prev) => ({
      ...prev,
      after: undefined,
      before: undefined,
    }));
  }, []);

  const handleDeliveryNext = useCallback(() => {
    if (deliveryOrdersData?.data?.nextCursor) {
      setDeliveryPage((prev) => prev + 1);
      setDeliveryParams((prev) => ({
        ...prev,
        after: deliveryOrdersData.data.nextCursor ?? undefined,
        before: undefined,
      }));
    }
  }, [deliveryOrdersData]);

  const handleDeliveryPrev = useCallback(() => {
    if (deliveryOrdersData?.data?.prevCursor) {
      setDeliveryPage((prev) => Math.max(1, prev - 1));
      setDeliveryParams((prev) => ({
        ...prev,
        before: deliveryOrdersData.data.prevCursor ?? undefined,
        after: undefined,
      }));
    }
  }, [deliveryOrdersData]);

  const handleDeliveryLimitChange = useCallback((newLimit: number) => {
    setDeliveryPage(1);
    setDeliveryParams((prev) => ({
      ...prev,
      limit: newLimit,
      after: undefined,
      before: undefined,
    }));
  }, []);

  const handleGoToFirstDelivery = useCallback(() => {
    setDeliveryPage(1);
    setDeliveryParams((prev) => ({
      ...prev,
      after: undefined,
      before: undefined,
    }));
  }, []);

  const handleExceptionNext = useCallback(() => {
    if (orderExceptionsData?.data?.nextCursor) {
      setExceptionPage((prev) => prev + 1);
      setExceptionParams((prev) => ({
        ...prev,
        after: orderExceptionsData.data.nextCursor ?? undefined,
        before: undefined,
      }));
    }
  }, [orderExceptionsData]);

  const handleExceptionPrev = useCallback(() => {
    if (orderExceptionsData?.data?.prevCursor) {
      setExceptionPage((prev) => Math.max(1, prev - 1));
      setExceptionParams((prev) => ({
        ...prev,
        before: orderExceptionsData.data.prevCursor ?? undefined,
        after: undefined,
      }));
    }
  }, [orderExceptionsData]);

  const handleExceptionLimitChange = useCallback((newLimit: number) => {
    setExceptionPage(1);
    setExceptionParams((prev) => ({
      ...prev,
      limit: newLimit,
      after: undefined,
      before: undefined,
    }));
  }, []);

  const handleGoToFirstException = useCallback(() => {
    setExceptionPage(1);
    setExceptionParams((prev) => ({
      ...prev,
      after: undefined,
      before: undefined,
    }));
  }, []);

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
      pickupAddress: order.shipment?.hub
        ? `${order.shipment.hub.state}, ${order.shipment.hub.city}, ${order.shipment.hub.address}`
        : "Not Available",
      phone: order.shipment?.hub?.phone || "Not Available",
      email: order.shipment?.hub?.email || "Not Available",

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
        `${order.shipToSnapshot?.state}, ${order.shipToSnapshot?.city}, ${order.shipToSnapshot?.line1}` ||
        "Address not available",
      phone:
        order.shipToSnapshot?.phone ||
        order.buyer?.phone ||
        "Phone not available",
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
        (d: LogisticsOrder) => d.status === "AT_SHOPAM_HUB",
      ).length,
      waitingForDelivery: deliveries.filter(
        (d: LogisticsOrder) =>
          d.status !== "DELIVERED" && d.status !== "CANCELLED",
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
    [],
  );

  // Event handlers
  const handleAssignRider = useCallback((orderId: string) => {
    setSelectedOrder(orderId);
    setShowAssignRiderModal(true);
  }, []);

  const handleInvestigate = useCallback(
    (exceptionId: string) => {
      const exception = orderExceptionsData?.data?.items?.find(
        (ex: OrderException) => ex.id === exceptionId,
      );
      if (exception) {
        setSelectedExceptionData(exception);
        setSelectedOrder(exception.orderId);
        setShowInvestigateModal(true);
      }
    },
    [orderExceptionsData],
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
        (ex: OrderException) => ex.id === selectedException,
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
        },
      );
    },
    [
      requestMoreEvidence,
      selectedException,
      orderExceptionsData,
      refetchExceptions,
      showSuccess,
      handleAsyncOperation,
    ],
  );

  const handleResolveExceptionSubmit = useCallback(
    async (orderId: string, status: "RESOLVED" | "REJECTED", resolvedQty?: number) => {
      // Find the exception to get the actual order ID
      const exception = orderExceptionsData?.data?.items?.find(
        (ex: OrderException) => ex.id === selectedException,
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
            data: { status, resolvedQty },
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
        },
      );
    },
    [
      resolveException,
      selectedException,
      orderExceptionsData,
      refetchExceptions,
      showSuccess,
      handleAsyncOperation,
    ],
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
    [createRider, showSuccess, refetchRiders, handleAsyncOperation],
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
        },
      );
    },
    [assignRiderToShipment, showSuccess, refreshAllData, handleAsyncOperation],
  );

  const handleShowAssignedMessage = useCallback(
    (orderId: string) => {
      showError(
        `A rider has already been assigned to this order. Order ID: ${orderId}`,
        {
          duration: 5000,
        },
      );
    },
    [showError],
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
              onClick={() => {
                setIsNavigatingBack(true);
                router.push("/admin-dashboard");
              }}
              variant="outline"
              disabled={isNavigatingBack}
              className="group flex items-center gap-2 border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow-md hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50/50 transition-all duration-300 rounded-full px-5 py-2"
            >
              {isNavigatingBack ? (
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              ) : (
                <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300" />
              )}
              <span className="font-semibold tracking-tight">Back to Admin</span>
            </Button>

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
              hasNext={pickupOrdersData?.data?.hasNext}
              hasPrev={pickupOrdersData?.data?.hasPrev}
              onNextPage={handlePickupNext}
              onPrevPage={handlePickupPrev}
              currentPage={pickupPage}
              limit={pickupParams.limit}
              onLimitChange={handlePickupLimitChange}
              onGoToFirst={handleGoToFirstPickup}
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
              hasNext={deliveryOrdersData?.data?.hasNext}
              hasPrev={deliveryOrdersData?.data?.hasPrev}
              onNextPage={handleDeliveryNext}
              onPrevPage={handleDeliveryPrev}
              currentPage={deliveryPage}
              limit={deliveryParams.limit}
              onLimitChange={handleDeliveryLimitChange}
              onGoToFirst={handleGoToFirstDelivery}
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
          hasNext={orderExceptionsData?.data?.hasNext}
          hasPrev={orderExceptionsData?.data?.hasPrev}
          onNextPage={handleExceptionNext}
          onPrevPage={handleExceptionPrev}
          currentPage={exceptionPage}
          limit={exceptionParams.limit || 10}
          onLimitChange={handleExceptionLimitChange}
          onGoToFirst={handleGoToFirstException}
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
          allowedStates={[
            "FCT",
            "Ogun",
            "Oyo",
            "Rivers",
            "Ondo",
            "Anambra",
            "Akwa Ibom",
            "Ekiti",
            "Delta",
            "Edo",
            "Osun",
            "Kwara",
          ]}
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
              (ex: OrderException) => ex.id === selectedException,
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
              (ex: OrderException) => ex.id === selectedException,
            )?.orderId || ""
          }
          status={
            orderExceptionsData?.data?.items?.find(
              (ex: OrderException) => ex.id === selectedException,
            )?.status || ""
          }
          onResolve={handleResolveExceptionSubmit}
          isLoading={isResolvingException}
        />
      </div>
    </ErrorBoundary>
  );
}
