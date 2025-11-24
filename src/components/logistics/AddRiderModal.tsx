// src/components/logistics/AddRiderModal.tsx

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiderIcon } from "./LogisticsIcons";

interface AddRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRiderModal({ isOpen, onClose }: AddRiderModalProps) {
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
          <h2 className="text-xl font-semibold">Add New Rider</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Input id="name" placeholder="Enter rider name" />
          </div>
          <div>
            <Input id="phone" placeholder="Enter phone number" />
          </div>
          <div>
            <Input id="bikeType" placeholder="Enter ride type" />
          </div>
          <div>
            <Input id="plate" placeholder="Enter plate number" />
          </div>
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            + Add Rider
          </Button>
        </div>
      </div>
    </div>
  );
}
