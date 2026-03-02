import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiveStreamTier, UpdateTierRequest } from "@/api/slotApi";

interface EditTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: LiveStreamTier | null;
  onSave: (id: string, updates: UpdateTierRequest) => void;
  isLoading?: boolean;
}

export default function EditTierModal({
  isOpen,
  onClose,
  tier,
  onSave,
  isLoading = false,
}: EditTierModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number | string>("");
  const [maxViewers, setMaxViewers] = useState<number | string>("");
  const [minTotalSales, setMinTotalSales] = useState("");

  useEffect(() => {
    if (tier) {
      setName(tier.name);
      setDescription(tier.description);
      setDurationMinutes(tier.durationMinutes);
      setMaxViewers(tier.maxViewers);
      setMinTotalSales(tier.minTotalSales);
    }
  }, [tier]);

  const handleSave = () => {
    if (tier) {
      const updates: UpdateTierRequest = {
        name,
        description,
        durationMinutes: Number(durationMinutes),
        maxViewers: Number(maxViewers),
        minTotalSales,
      };
      onSave(tier.id, updates);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Edit Tier Configuration
          </DialogTitle>
          <p className="text-sm text-slate-600">
            Modify the tier details below. Changes will be applied immediately.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-slate-700"
            >
              Tier Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tier name"
              className="w-full border border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-slate-700 "
            >
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full border border-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="duration"
                className="text-sm font-medium text-slate-700"
              >
                Duration (min)
              </Label>
              <Input
                id="duration"
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full border border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="maxViewers"
                className="text-sm font-medium text-slate-700"
              >
                Max Viewers
              </Label>
              <Input
                id="maxViewers"
                type="number"
                value={maxViewers}
                onChange={(e) => setMaxViewers(e.target.value)}
                className="w-full border border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="minTotalSales"
              className="text-sm font-medium text-slate-700"
            >
              Min Total Sales (Threshold)
            </Label>
            <Input
              id="minTotalSales"
              value={minTotalSales}
              onChange={(e) => setMinTotalSales(e.target.value)}
              placeholder="e.g. 5000000"
              className="w-full border border-gray-200"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-[#E67A2B] hover:bg-[#D86A1F] text-white"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
