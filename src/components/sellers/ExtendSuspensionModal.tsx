"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface DisplaySeller {
  id: string;
  name: string;
  email: string;
  shopName: string;
  status: string;
  tier: string;
  businessCategory: string;
  location: string;
  totalSales: string;
  createdAt: string;
}

interface ExtendSuspensionModalProps {
  isOpen: boolean;
  selectedSeller: DisplaySeller | null;
  actionLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onExtend: (days: string, notify: boolean) => void;
}

const ExtendSuspensionModal: React.FC<ExtendSuspensionModalProps> = ({
  isOpen,
  selectedSeller,
  actionLoading,
  onOpenChange,
  onExtend,
}) => {
  const [extensionDays, setExtensionDays] = useState("");
  const [notifySeller, setNotifySeller] = useState(true);

  const handleExtend = () => {
    if (extensionDays) {
      onExtend(extensionDays, notifySeller);
      setExtensionDays("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Extend Suspension
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Extension Days Dropdown */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              Extend Suspension by:
            </Label>
            <Select value={extensionDays} onValueChange={setExtensionDays}>
              <SelectTrigger className="w-full border-gray-200 rounded-lg">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="4">4 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notify Toggle */}
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm text-gray-900">
              Notify Seller (email/sms)
            </Label>
            <Switch
              checked={notifySeller}
              onCheckedChange={setNotifySeller}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Extend Button */}
          <Button
            onClick={handleExtend}
            disabled={actionLoading || !extensionDays}
            className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? "Extending..." : "Extend"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExtendSuspensionModal;
