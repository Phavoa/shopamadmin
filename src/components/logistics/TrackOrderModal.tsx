// src/components/logistics/TrackOrderModal.tsx

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PackageIcon, TruckIcon } from "./LogisticsIcons";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrackOrderModal({
  isOpen,
  onClose,
}: TrackOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-semibold">Track Order</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Input id="trackingId" placeholder="Enter tracking ID" />
          </div>
          <div className="space-y-2">
            <Button className="w-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center gap-2">
              Mark as Pick up (In transit to shopam)
            </Button>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2">
              <PackageIcon className="w-4 h-4" />
              Mark as Received at Hub
            </Button>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2">
              <TruckIcon className="w-4 h-4" />
              Mark as Out for Delivery
            </Button>
            <Button className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2">
              <PackageIcon className="w-4 h-4" />
              Mark as Delivered
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Each step is updated by staff/riders and reflects live for both
            buyer & seller.
          </p>
        </div>
      </div>
    </div>
  );
}
