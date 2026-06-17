"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSendTestPushMutation } from "@/api/notificationTemplatesApi";
import { toast } from "react-hot-toast";

interface TestPushModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TestPushModal: React.FC<TestPushModalProps> = ({ isOpen, onOpenChange }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dataString, setDataString] = useState(`{\n  "lotId": "lot_123",\n  "kind": "auction.outbid"\n}`);

  const [sendTestPush, { isLoading: isSending }] = useSendTestPushMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Notification Title is required");
      return;
    }
    if (!body.trim()) {
      toast.error("Notification Body is required");
      return;
    }

    let parsedData = {};
    if (dataString.trim()) {
      try {
        parsedData = JSON.parse(dataString);
      } catch (err) {
        toast.error("Invalid JSON in Data payload field");
        return;
      }
    }

    const toastId = toast.loading("Sending test push notification...");
    try {
      const res = await sendTestPush({
        title: title.trim(),
        body: body.trim(),
        data: parsedData,
      }).unwrap();

      if (res.success > 0) {
        toast.success(`Push notification sent successfully to ${res.success} device(s)!`, { id: toastId });
        onOpenChange(false);
        // Reset form
        setTitle("");
        setBody("");
      } else {
        toast.error("Failed to send push: No active tokens bound to your account.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to send push notification", { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Send Test Push Notification
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 flex flex-col flex-1 overflow-hidden">
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs font-semibold text-gray-600">
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Auction update"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="body" className="text-xs font-semibold text-gray-600">
                Body *
              </Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="e.g., You were outbid!"
                className="min-h-[80px] resize-none border-gray-200 focus:ring-orange-500 rounded-lg"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="data" className="text-xs font-semibold text-gray-600 flex justify-between">
                <span>Data Payload (JSON)</span>
                <span className="text-[10px] text-gray-400 font-normal">Optional</span>
              </Label>
              <Textarea
                id="data"
                value={dataString}
                onChange={(e) => setDataString(e.target.value)}
                placeholder='{\n  "key": "value"\n}'
                className="min-h-[120px] font-mono text-xs border-gray-200 focus:ring-orange-500 rounded-lg leading-normal"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              disabled={isSending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6"
            >
              {isSending ? "Sending..." : "Send Push"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestPushModal;
