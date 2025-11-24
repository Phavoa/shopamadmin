// src/components/logistics/AssignRiderModal.tsx

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiderIcon } from "./LogisticsIcons";

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssignRiderModal({
  isOpen,
  onClose,
}: AssignRiderModalProps) {
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
          <RiderIcon className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Assign Rider</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Select a Rider for this Order
        </p>
        <div className="space-y-4">
          <div>
            <select
              id="rider"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Rider</option>
              <option value="rider1">John Rider - Available</option>
              <option value="rider2">Mary Rider - Available</option>
              <option value="rider3">David Rider - Available</option>
            </select>
          </div>
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            Assign Rider
          </Button>
        </div>
      </div>
    </div>
  );
}
