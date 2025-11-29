"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Buyer } from "@/types/buyer";

interface SuspendBuyerModalProps {
  isOpen: boolean;
  selectedBuyer: Buyer | null;
  reason: string;
  duration: string;
  actionLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onReasonChange: (reason: string) => void;
  onDurationChange: (duration: string) => void;
  onSuspend: () => void;
}

const SuspendBuyerModal: React.FC<SuspendBuyerModalProps> = ({
  isOpen,
  selectedBuyer,
  reason,
  duration,
  actionLoading,
  onOpenChange,
  onReasonChange,
  onDurationChange,
  onSuspend,
}) => {
  const getBuyerName = (buyer: Buyer | null) => {
    if (!buyer) return "";
    return buyer.name || `${buyer.firstName} ${buyer.lastName}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Suspend Buyer</DialogTitle>
          <DialogDescription>
            Suspend {getBuyerName(selectedBuyer)} from making purchases
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="reason">Reason for Suspension</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onReasonChange(e.target.value)
              }
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 7"
              value={duration}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onDurationChange(e.target.value)
              }
              className="mt-2"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSuspend}
            disabled={actionLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {actionLoading ? "Suspending..." : "Suspend Buyer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendBuyerModal;
