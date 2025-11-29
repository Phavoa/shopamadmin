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

interface IssueStrikeModalProps {
  isOpen: boolean;
  selectedBuyer: Buyer | null;
  reason: string;
  duration: string;
  actionLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onReasonChange: (reason: string) => void;
  onDurationChange: (duration: string) => void;
  onIssueStrike: () => void;
}

const IssueStrikeModal: React.FC<IssueStrikeModalProps> = ({
  isOpen,
  selectedBuyer,
  reason,
  duration,
  actionLoading,
  onOpenChange,
  onReasonChange,
  onDurationChange,
  onIssueStrike,
}) => {
  const getBuyerName = (buyer: Buyer | null) => {
    if (!buyer) return "";
    return buyer.name || `${buyer.firstName} ${buyer.lastName}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Issue Strike</DialogTitle>
          <DialogDescription>
            Issue a strike to {getBuyerName(selectedBuyer)}. After 3 strikes,
            buyer will be suspended.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="strike-reason">Reason for Strike</Label>
            <Textarea
              id="strike-reason"
              placeholder="Enter reason..."
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onReasonChange(e.target.value)
              }
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="strike-duration">Cooldown Period (days)</Label>
            <Input
              id="strike-duration"
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
            onClick={onIssueStrike}
            disabled={actionLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {actionLoading ? "Issuing Strike..." : "Issue Strike"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IssueStrikeModal;
