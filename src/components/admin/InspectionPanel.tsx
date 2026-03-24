// src/components/admin/InspectionPanel.tsx
"use client";

import { useState, useMemo } from "react";
import { OrderItem, useRejectBulkItemsMutation } from "@/api/orderApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Package, RefreshCw, XCircle, Check } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface InspectionPanelProps {
  items: OrderItem[];
  orderId: string;
  onSuccess: () => void;
  isCompleted: boolean;
  onCompleteChange: (isCompleted: boolean) => void;
}

export function InspectionPanel({ 
  items, 
  orderId, 
  onSuccess, 
  isCompleted, 
  onCompleteChange 
}: InspectionPanelProps) {
  const { showSuccess, showError } = useNotifications();
  const [rejectMap, setRejectMap] = useState<{ [itemId: string]: number }>({});
  
  const [rejectBulk, { isLoading: isRejecting }] = useRejectBulkItemsMutation();

  const handleRejectChange = (itemId: string, value: number, max: number) => {
    const clampedValue = Math.max(0, Math.min(value, max));
    setRejectMap((prev) => ({
      ...prev,
      [itemId]: clampedValue,
    }));
  };

  const handleBulkReject = async () => {
    const payloadItems = Object.entries(rejectMap)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => ({ itemId, qty }));

    if (payloadItems.length === 0) return;

    try {
      await rejectBulk({ orderId, items: payloadItems }).unwrap();
      showSuccess("Items rejected successfully");
      setRejectMap({});
      onSuccess();
    } catch (err) {
      console.error("Failed to reject items:", err);
      showError("Failed to reject items. Please try again.");
    }
  };

  const hasRejectChanges = useMemo(() => Object.values(rejectMap).some((qty) => qty > 0), [rejectMap]);

  if (!items || items.length === 0) return null;

  return (
    <Card className={`mt-6 p-6 border-orange-200 ${isCompleted ? 'bg-green-50/20' : 'bg-orange-50/30'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <Package className={`w-6 h-6 ${isCompleted ? 'text-green-500' : 'text-orange-500'}`} />
           <h2 className="text-xl font-bold text-gray-900">Hub Inspection Phase</h2>
        </div>
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1 py-1 px-3">
              <CheckCircle className="w-3 h-3" />
              Inspection Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="text-orange-600 border-orange-200">
              Action Required
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const receivedQty = item.fulfillment?.receivedQty || 0;
          const rejectedQty = item.exception?.totalRejectedQty || 0;
          // maxRejectableQty: item.qty - (item.fulfillment?.receivedQty || 0) - (item.exception?.totalRejectedQty || 0)
          const maxRejectableQty = Math.max(0, item.qty - receivedQty - rejectedQty);
          
          const isRefunded = item.status === "REFUNDED" || item.status === "PARTIALLY_REFUNDED";
          const isReleased = item.financial?.payoutReleasedKobo && item.financial.payoutReleasedKobo > 0;
          
          // Disable input if item is refunded, released, or the whole inspection is completed
          const isDisabled = isCompleted || isRefunded || isReleased || maxRejectableQty === 0;

          return (
            <div
              key={item.id}
              className={`bg-white p-4 rounded-lg border border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-opacity ${isCompleted ? 'opacity-60' : 'opacity-100'}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {item.status}
                  </Badge>
                  {item.exception?.totalRejectedQty ? (
                    <Badge variant="destructive" className="text-[10px]">
                      {item.exception.totalRejectedQty} Rejected
                    </Badge>
                  ) : null}
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500 mt-2">
                  <div>
                    <p className="font-medium text-gray-700">Total: {item.qty}</p>
                    <p>Status: {item.status}</p>
                  </div>
                  <div>
                    <p>Received: {receivedQty}</p>
                    <p>Rejectable: {maxRejectableQty}</p>
                  </div>
                  <div>
                    <p>Released: {(item.financial?.payoutReleasedKobo || 0) / 100} NGN</p>
                    <p>Refunded: {(item.financial?.refundedKobo || 0) / 100} NGN</p>
                  </div>
                  {item.exception?.totalRejectedQty ? (
                    <div className="flex items-center gap-1 text-red-500 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>Has Exceptions</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {!isCompleted && !isRefunded && !isReleased && maxRejectableQty > 0 && (
                <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded">
                  <span className="text-[10px] text-red-600 uppercase font-bold">Reject Qty</span>
                  <Input
                    type="number"
                    min={0}
                    max={maxRejectableQty}
                    value={rejectMap[item.id] || 0}
                    onChange={(e) => handleRejectChange(item.id, parseInt(e.target.value) || 0, maxRejectableQty)}
                    disabled={isRejecting}
                    className="w-24 h-8 text-sm focus:border-red-500"
                  />
                </div>
              )}
              
              {(isCompleted || isRefunded || isReleased || maxRejectableQty === 0) && (
                 <div className="flex items-center text-gray-400 gap-1 text-xs italic font-medium">
                   <Info className="w-3 h-3" />
                   <span>Item Locked</span>
                 </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex-1">
           <p className="text-sm text-gray-600 font-medium">
             {isCompleted 
               ? "Inspection is complete. Shipment buttons are now enabled." 
               : "Reject damaged or missing items, then mark inspection as complete to proceed with shipment."}
           </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isCompleted && (
            <Button
              onClick={handleBulkReject}
              disabled={!hasRejectChanges || isRejecting}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              {isRejecting ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Bulk Reject
            </Button>
          )}

          <Button
            onClick={() => onCompleteChange(!isCompleted)}
            className={isCompleted 
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
              : "bg-green-600 hover:bg-green-700 text-white min-w-[180px]"}
          >
            {isCompleted ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Undo Completion
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Mark Inspection Complete
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Info(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
