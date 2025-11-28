// src/components/logistics/AssignRiderModal.tsx

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiderIcon } from "./LogisticsIcons";
import { Rider } from "@/api/ridersApi";

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  riders: Rider[];
  isLoading?: boolean;
  selectedOrder: string;
  onAssignRider: (orderId: string, riderId: string) => Promise<void>;
}

export default function AssignRiderModal({
  isOpen,
  onClose,
  riders,
  isLoading = false,
  selectedOrder,
  onAssignRider,
}: AssignRiderModalProps) {
  const [selectedRiderId, setSelectedRiderId] = useState<string>("");
  console.log("Riders in AssignRiderModal:", riders);
  console.log("Selected Rider ID:", selectedRiderId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRiderId) {
      alert("Please select a rider");
      return;
    }

    try {
      // Call the parent handler which will make the API call
      await onAssignRider(selectedOrder, selectedRiderId);

      // Reset form and close modal on success
      setSelectedRiderId("");
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      // We don't close the modal on error so user can try again
      console.error("Failed to assign rider:", error);
    }
  };

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
          Select a Rider for Order: {selectedOrder}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="rider-select"
              className="text-sm font-medium text-gray-700"
            >
              Select Rider
            </label>
            <Select
              value={selectedRiderId}
              onValueChange={setSelectedRiderId}
              disabled={isLoading}
            >
              <SelectTrigger
                id="rider-select"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white hover:border-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
              >
                <SelectValue placeholder="Select a rider" />
              </SelectTrigger>
              <SelectContent className="border border-gray-200 rounded-md shadow-lg bg-white">
                {riders.map((rider) => (
                  <SelectItem
                    key={rider.id}
                    value={rider.id}
                    className="hover:bg-orange-500 focus:bg-orange-500 px-3 py-2"
                  >
                    {rider.name} - {rider.rideType} ({rider.plateNo}) -{" "}
                    {rider.active ? "Active" : "Inactive"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isLoading || !selectedRiderId}
          >
            {isLoading ? "Loading..." : "Assign Rider"}
          </Button>
        </form>
      </div>
    </div>
  );
}
