"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

interface SuspendSellerModalProps {
  isOpen: boolean;
  selectedSeller: DisplaySeller | null;
  reason: string;
  duration: string;
  actionLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onReasonChange: (reason: string) => void;
  onDurationChange: (duration: string) => void;
  onSuspend: () => void;
}

const getSellerName = (seller: DisplaySeller | null) => {
  if (!seller) return "";
  return seller.name || seller.shopName;
};

const SuspendSellerModal: React.FC<SuspendSellerModalProps> = ({
  isOpen,
  selectedSeller,
  reason,
  duration,
  actionLoading,
  onOpenChange,
  onReasonChange,
  onDurationChange,
  onSuspend,
}) => {
  const [notifySeller, setNotifySeller] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Issue Suspension
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Seller Name (Read-only) */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              Seller Name
            </Label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {getSellerName(selectedSeller)}
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Reason</Label>
            <Textarea
              placeholder="Type the reason, e.g., Fraud, Chargeback, Abuse"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Cooldown Days Dropdown */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              Select Number of Cooldown days
            </Label>
            <Select value={duration} onValueChange={onDurationChange}>
              <SelectTrigger className="w-full border-gray-200 rounded-lg">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
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

          {/* Suspend Button */}
          <Button
            onClick={onSuspend}
            disabled={actionLoading || !reason || !duration}
            className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? "Suspending..." : "Suspend"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendSellerModal;