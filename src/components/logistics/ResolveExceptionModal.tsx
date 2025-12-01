// src/components/logistics/ResolveExceptionModal.tsx

import { X, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ResolveExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exceptionId: string;
  orderId: string;
  onResolve: (orderId: string, status: "RESOLVED" | "REJECTED") => void;
  isLoading: boolean;
}

export default function ResolveExceptionModal({
  isOpen,
  onClose,
  exceptionId,
  orderId,
  onResolve,
  isLoading,
}: ResolveExceptionModalProps) {
  if (!isOpen) return null;

  const handleResolve = (status: "RESOLVED" | "REJECTED") => {
    onResolve(orderId, status);
  };

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-semibold">Resolve Exception</h2>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Exception ID:</span> {exceptionId}
            </p>
            <p>
              <span className="font-medium">Order ID:</span> {orderId}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Please select the resolution status for this exception:
          </p>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => handleResolve("RESOLVED")}
              className="bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2 p-6"
              disabled={isLoading}
            >
              <CheckCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Resolve Exception</div>
                <div className="text-sm opacity-90">
                  Mark this exception as resolved
                </div>
              </div>
            </Button>

            <Button
              onClick={() => handleResolve("REJECTED")}
              className="bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 p-6"
              disabled={isLoading}
            >
              <XCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Reject Exception</div>
                <div className="text-sm opacity-90">
                  Mark this exception as invalid/rejected
                </div>
              </div>
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
