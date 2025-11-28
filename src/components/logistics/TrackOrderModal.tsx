// src/components/logistics/TrackOrderModal.tsx

import { useState, useCallback, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PackageIcon, TruckIcon } from "./LogisticsIcons";
import { useUpdateShipmentStatusByCodeMutation } from "@/api/shipmentApi";
import { useNotifications } from "@/hooks/useNotifications";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => Promise<void> | void;
}

// Shipment status options with their corresponding API values and colors
const SHIPMENT_STATUS_OPTIONS = [
  {
    id: "PICKED_UP",
    label: "Mark as Pick up (In transit to shopam)",
    color: "pink",
    status: "IN_TRANSIT" as const,
    note: "Package picked up from seller",
  },
  {
    id: "RECEIVED_AT_HUB",
    label: "Mark as Received at Hub",
    color: "orange",
    status: "IN_TRANSIT" as const,
    note: "Package received at ShopAm hub",
  },
  {
    id: "OUT_FOR_DELIVERY",
    label: "Mark as Out for Delivery",
    color: "blue",
    status: "IN_TRANSIT" as const,
    note: "Package out for delivery",
  },
  {
    id: "DELIVERED",
    label: "Mark as Delivered",
    color: "green",
    status: "DELIVERED" as const,
    note: "Package successfully delivered",
  },
] as const;

type StatusColor = "pink" | "orange" | "blue" | "green";

export default function TrackOrderModal({
  isOpen,
  onClose,
  onStatusUpdate,
}: TrackOrderModalProps) {
  const [trackingCode, setTrackingCode] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    trackingCode?: string;
    orderCode?: string;
  }>({});

  const { showSuccess, showError, handleAsyncOperation } = useNotifications();

  // Mutation for updating shipment status
  const [
    updateShipmentStatus,
    { isLoading: isUpdating, error: updateError, reset: resetMutation },
  ] = useUpdateShipmentStatusByCodeMutation();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTrackingCode("");
      setOrderCode("");
      setValidationErrors({});
      resetMutation();
    }
  }, [isOpen, resetMutation]);

  // Validation function
  const validateForm = useCallback((): boolean => {
    const errors: { trackingCode?: string; orderCode?: string } = {};

    if (!trackingCode.trim() && !orderCode.trim()) {
      errors.trackingCode = "Either tracking code or order code is required";
      errors.orderCode = "Either tracking code or order code is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [trackingCode, orderCode]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (status: string, note: string) => {
      if (!validateForm()) {
        showError("Please provide either a tracking code or order code");
        return;
      }

      try {
        await handleAsyncOperation(
          () =>
            updateShipmentStatus({
              data: {
                status,
                note,
                ...(trackingCode.trim() && {
                  trackingCode: trackingCode.trim(),
                }),
                ...(orderCode.trim() && { orderCode: orderCode.trim() }),
              },
            }).unwrap(),
          {
            onSuccess: async (result) => {
              showSuccess(
                `Order status updated successfully to ${status
                  .toLowerCase()
                  .replace("_", " ")}`
              );
              // Call the callback to refresh data
              if (onStatusUpdate) {
                try {
                  await onStatusUpdate();
                } catch (error) {
                  console.error(
                    "Failed to refresh data after status update:",
                    error
                  );
                }
              }
              // Close modal after successful update
              setTimeout(() => {
                onClose();
              }, 1500);
            },
            successMessage: "",
            showErrorToast: true,
          }
        );
      } catch (error) {
        // Error handling is done by handleAsyncOperation
        console.error("Failed to update shipment status:", error);
      }
    },
    [
      trackingCode,
      orderCode,
      updateShipmentStatus,
      handleAsyncOperation,
      showSuccess,
      showError,
      onClose,
      validateForm,
      onStatusUpdate,
    ]
  );

  // Memoized button configurations with loading states
  const actionButtons = useMemo(() => {
    return SHIPMENT_STATUS_OPTIONS.map((option) => ({
      ...option,
      isDisabled: isUpdating,
      onClick: () => handleSubmit(option.status, option.note),
    }));
  }, [isUpdating, handleSubmit]);

  // Get error message from mutation error
  const getErrorMessage = useCallback((error: unknown): string | null => {
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
  }, []);

  // Render loading spinner for button
  const renderLoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
          disabled={isUpdating}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold">Track Order</h2>
          {isUpdating && (
            <div className="ml-2 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Display global error */}
        {updateError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {getErrorMessage(updateError)}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* Input Fields */}
          <div className="space-y-3">
            <div>
              <label
                htmlFor="trackingId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tracking Code
              </label>
              <Input
                id="trackingId"
                placeholder="Enter tracking ID"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                disabled={isUpdating}
                className={
                  validationErrors.trackingCode
                    ? "border-red-300 focus:border-red-500"
                    : ""
                }
              />
              {validationErrors.trackingCode && (
                <p className="text-xs text-red-600 mt-1">
                  {validationErrors.trackingCode}
                </p>
              )}
            </div>

            <div className="text-center text-gray-400 font-medium">OR</div>

            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Order Code
              </label>
              <Input
                id="orderId"
                placeholder="Enter order code"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                disabled={isUpdating}
                className={
                  validationErrors.orderCode
                    ? "border-red-300 focus:border-red-500"
                    : ""
                }
              />
              {validationErrors.orderCode && (
                <p className="text-xs text-red-600 mt-1">
                  {validationErrors.orderCode}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {actionButtons.map((button) => (
              <Button
                key={button.id}
                onClick={button.onClick}
                disabled={button.isDisabled || isUpdating}
                className={`w-full bg-${button.color}-500 hover:bg-${button.color}-600 flex items-center justify-center gap-2 transition-colors`}
              >
                {isUpdating ? (
                  renderLoadingSpinner()
                ) : (
                  <>
                    {button.id === "OUT_FOR_DELIVERY" && (
                      <TruckIcon className="w-4 h-4" />
                    )}
                    {(button.id === "RECEIVED_AT_HUB" ||
                      button.id === "DELIVERED") && (
                      <PackageIcon className="w-4 h-4" />
                    )}
                    {button.label}
                  </>
                )}
              </Button>
            ))}
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center">
            Each step is updated by staff/riders and reflects live for both
            buyer & seller.
          </p>

          {/* Loading indicator for the entire modal */}
          {isUpdating && (
            <div className="text-center text-sm text-gray-500">
              Updating order status...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
