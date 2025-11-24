// src/components/logistics/AddShopModal.tsx

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationIcon } from "./LogisticsIcons";

// Import hooks and types
import { useCreateHubMutation } from "@/api/hubApi";
import { useGetStatesQuery } from "@/api/userApi";
import { useGetZonesQuery, type DeliveryZone } from "@/api/deliveryApi";

interface AddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddShopModal({ isOpen, onClose }: AddShopModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    state: "Lagos",
    city: "",
    phone: "+234",
    deliveryZoneId: "",
    address: "",
  });

  // API mutations and queries
  const [createHub, { isLoading: isCreating }] = useCreateHubMutation();
  const { data: statesData } = useGetStatesQuery();
  const { data: zonesData } = useGetZonesQuery({ limit: 50 });

  // Get selected state data for LGAs
  const selectedState = statesData?.states?.find(
    (state) => state.state === formData.state
  );

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      // Format phone number - remove any non-digits
      let digits = value.replace(/\D/g, "");

      // If starts with 234, remove it
      if (digits.startsWith("234")) {
        digits = digits.substring(3);
      }

      // If starts with 0, remove it
      if (digits.startsWith("0")) {
        digits = digits.substring(1);
      }

      // Format as +234 followed by the digits
      const formattedValue = "+234" + digits;

      setFormData((prev) => ({
        ...prev,
        [field]: formattedValue,
      }));
    } else if (field === "state") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        city: "", // Reset city when state changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createHub(formData).unwrap();
      // Reset form and close modal on success
      setFormData({
        name: "",
        state: "Lagos",
        city: "",
        phone: "+234",
        deliveryZoneId: "",
        address: "",
      });
      onClose();
    } catch (error) {
      console.error("Failed to create hub:", error);
      // Handle error (you might want to show a toast notification)
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      state: "Lagos",
      city: "",
      phone: "+234",
      deliveryZoneId: "",
      address: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-6">
          <LocationIcon className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Add New Parcel Shop</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hub Name */}
          <div className="border rounded text-gray-600">
            <Input
              id="name"
              placeholder="Shop name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="w-full border rounded text-gray-600"
            />
          </div>

          {/* State Dropdown */}
          <div className="border rounded text-gray-600">
            <Select
              value={formData.state}
              onValueChange={(value) => handleInputChange("state", value)}
              required
              disabled
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {statesData?.states?.map((state) => (
                  <SelectItem key={state.state} value={state.state}>
                    {state.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City/LGA Dropdown - only show when state is selected */}
          {formData.state && selectedState && (
            <div className="border rounded text-gray-600">
              <Select
                value={formData.city}
                onValueChange={(value) => handleInputChange("city", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="City/LGA" />
                </SelectTrigger>
                <SelectContent>
                  {selectedState.lgas.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Phone Number */}
          <div className="border rounded text-gray-600">
            <Label htmlFor="phone" className="sr-only">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              className="border rounded text-gray-600 w-full"
            />
          </div>

          {/* Delivery Zone Dropdown */}
          <div className="border rounded text-gray-600">
            <Select
              value={formData.deliveryZoneId}
              onValueChange={(value) =>
                handleInputChange("deliveryZoneId", value)
              }
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Delivery zone" />
              </SelectTrigger>
              <SelectContent>
                {zonesData?.data?.items &&
                  zonesData.data.items.map((zone: DeliveryZone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name} ({zone.code})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address */}
          <div className="border rounded text-gray-600">
            <Input
              id="address"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#E67E22] hover:bg-[#E67E22]/90 p-5"
            disabled={isCreating}
          >
            {isCreating ? "Creating Hub..." : "Add Shop"}
          </Button>
        </form>
      </div>
    </div>
  );
}
