"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slot, Seller } from "@/lib/mockData";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: Slot | null;
  sellers: Seller[];
  onSave: (slot: Partial<Slot>) => void;
  selectedTime?: string;
}

const SlotModal: React.FC<SlotModalProps> = ({
  isOpen,
  onClose,
  slot,
  sellers,
  onSave,
  selectedTime,
}) => {
  const [formData, setFormData] = useState({
    sellerId: slot?.sellerId || "",
    startTime: slot?.startTime || selectedTime || "09:00",
    endTime: slot?.endTime || "10:00",
    status: slot?.status || "available",
    product: slot?.product || "",
    price: slot?.price?.toString() || "",
  });

  const handleSave = () => {
    const selectedSeller = sellers.find((s) => s.id === formData.sellerId);
    const slotData: Partial<Slot> = {
      ...formData,
      sellerName: selectedSeller?.name || "",
      price: formData.price ? parseFloat(formData.price) : undefined,
      duration: 60, // Assuming 1 hour slots
      date: "2025-10-21", // Current date
    };

    if (slot) {
      slotData.id = slot.id;
    }

    onSave(slotData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{slot ? "Edit Slot" : "Create New Slot"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seller Selection */}
          <div className="space-y-2">
            <Label htmlFor="seller">Seller</Label>
            <Select
              value={formData.sellerId}
              onValueChange={(value) =>
                setFormData({ ...formData, sellerId: value })
              }
            >
              <SelectTrigger aria-label="Select seller">
                <SelectValue placeholder="Select a seller" />
              </SelectTrigger>
              <SelectContent>
                {sellers.map((seller) => (
                  <SelectItem key={seller.id} value={seller.id}>
                    {seller.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                aria-label="Start time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                aria-label="End time"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as "booked" | "available",
                })
              }
            >
              <SelectTrigger aria-label="Select status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product (only for booked slots) */}
          {formData.status === "booked" && (
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Input
                id="product"
                type="text"
                placeholder="Product name"
                value={formData.product}
                onChange={(e) =>
                  setFormData({ ...formData, product: e.target.value })
                }
                aria-label="Product name"
              />
            </div>
          )}

          {/* Price (only for booked slots) */}
          {formData.status === "booked" && (
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                aria-label="Price in dollars"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} aria-label="Cancel">
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleSave}
                className="bg-color-primary hover:bg-color-primary-hover text-color-surface"
                aria-label={`${slot ? "Update" : "Create"} slot`}
              >
                {slot ? "Update" : "Create"} Slot
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlotModal;
