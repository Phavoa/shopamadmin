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
import { Switch } from "@/components/ui/switch";
import type { SelectedBuyerForAction } from "@/types/buyer";

interface IssueStrikeModalProps {
  isOpen: boolean;
  selectedBuyer: SelectedBuyerForAction | null;
  reason: string;
  actionLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onReasonChange: (reason: string) => void;
  onIssueStrike: () => void;
}

const getBuyerName = (buyer: SelectedBuyerForAction | null) => {
  if (!buyer) return "";
  return buyer.name || `${buyer.firstName} ${buyer.lastName}`;
};

const IssueStrikeModal: React.FC<IssueStrikeModalProps> = ({
  isOpen,
  selectedBuyer,
  reason,
  actionLoading,
  onOpenChange,
  onReasonChange,
  onIssueStrike,
}) => {
  const [notifyBuyer, setNotifyBuyer] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Issue Strike
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Buyer Name (Read-only) */}
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              Buyer Name
            </Label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {getBuyerName(selectedBuyer)}
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

          {/* Notify Toggle */}
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm text-gray-900">
              Notify Buyer (email/sms)
            </Label>
            <Switch
              checked={notifyBuyer}
              onCheckedChange={setNotifyBuyer}
              className="data-[state=checked]:bg-green-500"
            />
          </div>

          {/* Strike Button */}
          <Button
            onClick={onIssueStrike}
            disabled={actionLoading || !reason}
            className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? "Issuing Strike..." : "Strike"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueStrikeModal;