"use client";
 
import { useState } from "react";
import { X, DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetOrderByIdQuery, useManualReleaseMutation } from "@/api/orderApi";
import { useNotifications } from "@/hooks/useNotifications";
 
interface ManualReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}
 
export default function ManualReleaseModal({
  isOpen,
  onClose,
  orderId,
}: ManualReleaseModalProps) {
  const { data: orderResponse, isLoading: orderLoading } = useGetOrderByIdQuery(
    { id: orderId, params: { populate: ["items"] } },
    { skip: !isOpen || !orderId }
  );
 
  const [manualRelease, { isLoading: isReleasing }] = useManualReleaseMutation();
  const { showSuccess, showError, handleAsyncOperation } = useNotifications();
 
  const [selectedItems, setSelectedItems] = useState<Record<string, { selected: boolean; qty: number }>>({});
  const [releaseDelivery, setReleaseDelivery] = useState(false);
  const [note, setNote] = useState("");
 
  if (!isOpen) return null;
 
  const order = orderResponse?.data;
  const items = order?.items || [];
 
  const handleItemToggle = (itemId: string, maxQty: number) => {
    setSelectedItems((prev) => {
      const current = prev[itemId];
      if (current?.selected) {
        return { ...prev, [itemId]: { ...current, selected: false } };
      }
      return { ...prev, [itemId]: { selected: true, qty: maxQty } };
    });
  };
 
  const handleQtyChange = (itemId: string, qty: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], qty },
    }));
  };
 
  const handleSubmit = async () => {
    if (note.length < 3) {
      showError("Note must be at least 3 characters long");
      return;
    }
 
    const itemsToRelease = Object.entries(selectedItems)
      .filter(([_, val]) => val.selected)
      .map(([itemId, val]) => ({ itemId, qty: val.qty }));
 
    if (itemsToRelease.length === 0 && !releaseDelivery) {
      showError("Please select at least one item or the delivery fee to release");
      return;
    }
 
    await handleAsyncOperation(
      () => manualRelease({
        id: orderId,
        data: {
          items: itemsToRelease,
          releaseDelivery,
          note
        }
      }).unwrap(),
      {
        onSuccess: () => {
          showSuccess("Funds released successfully");
          onClose();
        },
        successMessage: ""
      }
    );
  };
 
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manual Fund Release</h2>
              <p className="text-sm text-gray-500">Order ID: {order?.orderCode || orderId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
 
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orderLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-gray-500 animate-pulse">Loading order details...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <Label className="text-base font-bold">Select Items to Release Funds for</Label>
                <div className="grid gap-3">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-4 border rounded-xl transition-all ${
                        selectedItems[item.id]?.selected 
                          ? 'border-orange-500 bg-orange-50/30' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox 
                          id={`item-${item.id}`}
                          checked={selectedItems[item.id]?.selected || false}
                          onCheckedChange={() => handleItemToggle(item.id, item.qty)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <label 
                            htmlFor={`item-${item.id}`}
                            className="text-sm font-semibold text-gray-900 cursor-pointer block"
                          >
                            {item.title}
                          </label>
                          <p className="text-xs text-gray-500">
                             Max Refillable Qty: <span className="font-bold">{item.qty}</span>
                          </p>
                        </div>
                        {selectedItems[item.id]?.selected && (
                          <div className="w-24">
                            <Label className="text-[10px] uppercase text-gray-500">Qty</Label>
                            <Input 
                              type="number"
                              min={1}
                              max={item.qty}
                              value={selectedItems[item.id]?.qty || 1}
                              onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                              className="h-8 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <Checkbox 
                    id="delivery-fee"
                    checked={releaseDelivery}
                    onCheckedChange={(checked) => setReleaseDelivery(!!checked)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor="delivery-fee"
                      className="text-sm font-semibold text-gray-900 cursor-pointer"
                    >
                      Release Delivery Fee
                    </label>
                    <p className="text-xs text-gray-500">Push the shipping fee to the seller's wallet</p>
                  </div>
                </div>
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-bold">Internal Release Note</Label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Reason for manual release (e.g., Damaged item confirmed but covered by insurance)"
                  className="w-full min-h-[100px] p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                />
                <p className="text-xs text-gray-400">Min 3 characters. This note is for internal audit tracking.</p>
              </div>
            </>
          )}
        </div>
 
        {/* Footer */}
        <div className="p-6 border-t bg-gray-50/50 flex gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-11 rounded-xl"
            disabled={isReleasing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1 h-11 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
            disabled={isReleasing || orderLoading}
          >
            {isReleasing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Release Funds
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
