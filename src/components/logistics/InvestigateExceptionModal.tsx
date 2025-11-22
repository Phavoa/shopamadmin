// src/components/logistics/InvestigateExceptionModal.tsx

import { X, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvestigateExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: string;
}

export default function InvestigateExceptionModal({
  isOpen,
  onClose,
  selectedOrder,
}: InvestigateExceptionModalProps) {
  if (!isOpen) return null;

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
          <h2 className="text-xl font-semibold">
            Investigate Exception - Order {selectedOrder}
          </h2>
        </div>

        {/* Order Details */}
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span className="font-semibold">Order & Buyer Details</span>
        </div>
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Order ID:</span> {selectedOrder}
            </p>
            <p>
              <span className="font-medium">Buyer:</span> Jane Doe 🇳🇬 (📱0813
              466 7880)
            </p>
            <p>
              <span className="font-medium">Seller:</span> Mary K. 🇨🇦 (📱0813
              222 333)
            </p>
            <p>
              <span className="font-medium">Hub:</span> Lagos Main Hub
            </p>
            <p>
              <span className="font-medium">Date Delivered:</span> 2 April, 2025
            </p>
          </div>
        </div>

        {/* Reported Issue */}
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="font-semibold">Reported Issue</span>
        </div>
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Reported by:</span> Buyer
            </p>
            <p>
              <span className="font-medium">Reason:</span> Wrong item delivered
            </p>
            <p>
              <span className="font-medium">Buyer Note:</span> &quot;I ordered
              iPhone 12 but got iPhone X&quot;
            </p>
            <p>
              <span className="font-medium">Seller Reply:</span> &quot;Sent
              correct item (photo attached)&quot;
            </p>
          </div>
        </div>

        {/* Staff Actions */}
        <div>
          <h3 className="font-semibold mb-3">Staff Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Contact Buyer
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Contact Seller
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Request More Evidence
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">
              Approve Refund
            </Button>
            <Button className="bg-green-500 hover:bg-green-600">
              Send Replacement
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Close (No Issue)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
