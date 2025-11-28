// src/components/logistics/AddRiderModal.tsx

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiderIcon } from "./LogisticsIcons";

interface AddRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRider: (riderData: {
    name: string;
    phone: string;
    rideType: string;
    plateNo: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function AddRiderModal({
  isOpen,
  onClose,
  onCreateRider,
  isLoading = false,
}: AddRiderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    rideType: "",
    plateNo: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.rideType ||
      !formData.plateNo
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await onCreateRider(formData);
      // Reset form on success
      setFormData({
        name: "",
        phone: "",
        rideType: "",
        plateNo: "",
      });
    } catch (error) {
      console.error("Failed to create rider:", error);
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
          <h2 className="text-xl font-semibold">Add New Rider</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="name"
              placeholder="Enter rider name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              id="rideType"
              placeholder="Enter ride type"
              value={formData.rideType}
              onChange={(e) => handleInputChange("rideType", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              id="plateNo"
              placeholder="Enter plate number"
              value={formData.plateNo}
              onChange={(e) => handleInputChange("plateNo", e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? "Creating Rider..." : "+ Add Rider"}
          </Button>
        </form>
      </div>
    </div>
  );
}
