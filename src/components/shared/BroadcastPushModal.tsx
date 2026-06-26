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
import { useBroadcastPushMutation } from "@/api/notificationTemplatesApi";
import { toast } from "react-hot-toast";

interface BroadcastPushModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BroadcastPushModal: React.FC<BroadcastPushModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pushTemplateKey, setPushTemplateKey] = useState("");
  const [variablesString, setVariablesString] = useState(
    `{\n  "name": "User"\n}`,
  );

  const [broadcastPush, { isLoading: isBroadcasting }] =
    useBroadcastPushMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one of (title and body) OR pushTemplateKey is provide
    const hasDirectText = title.trim() || body.trim();
    const hasTemplateKey = pushTemplateKey.trim();

    if (!hasDirectText && !hasTemplateKey) {
      toast.error("Please provide either (Title/Body) or a Push Template Key");
      return;
    }

    let parsedVariables = {};
    if (variablesString.trim()) {
      try {
        parsedVariables = JSON.parse(variablesString);
        if (
          typeof parsedVariables !== "object" ||
          parsedVariables === null ||
          Array.isArray(parsedVariables)
        ) {
          throw new Error("Variables must be a key-value object");
        }
      } catch (err: any) {
        toast.error(err?.message || "Invalid JSON in Variables field");
        return;
      }
    }

    const toastId = toast.loading("Broadcasting push notification...");
    try {
      const payload: any = {};
      if (title.trim()) payload.title = title.trim();
      if (body.trim()) payload.body = body.trim();
      if (pushTemplateKey.trim())
        payload.pushTemplateKey = pushTemplateKey.trim();
      if (Object.keys(parsedVariables).length > 0)
        payload.variables = parsedVariables;

      await broadcastPush(payload).unwrap();

      toast.success("Broadcast notification sent successfully!", {
        id: toastId,
      });
      onOpenChange(false);

      // Reset form fields
      setTitle("");
      setBody("");
      setPushTemplateKey("");
      setVariablesString(`{\n  "name": "User"\n}`);
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to broadcast notification",
        { id: toastId },
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Broadcast Push Notification
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-4 flex flex-col flex-1 overflow-hidden"
        >
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100/50 text-xs text-orange-800 leading-relaxed">
              <strong>Super Admins:</strong> Send a global push broadcast.
              Specify either title/body direct message OR a push template key to
              fetch a template with variables.
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="broadcast-title"
                className="text-xs font-semibold text-gray-600 flex justify-between"
              >
                <span>Notification Title</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  Optional
                </span>
              </Label>
              <Input
                id="broadcast-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Platform Update"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="broadcast-body"
                className="text-xs font-semibold text-gray-600 flex justify-between"
              >
                <span>Notification Body</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  Optional
                </span>
              </Label>
              <Textarea
                id="broadcast-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="e.g., We have updated our services..."
                className="min-h-[80px] resize-none border-gray-200 focus:ring-orange-500 rounded-lg"
              />
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                OR
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="broadcast-template-key"
                className="text-xs font-semibold text-gray-600 flex justify-between"
              >
                <span>Push Template Key</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  Optional
                </span>
              </Label>
              <Input
                id="broadcast-template-key"
                value={pushTemplateKey}
                onChange={(e) => setPushTemplateKey(e.target.value)}
                placeholder="e.g., buyer.order.shipped"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="broadcast-variables"
                className="text-xs font-semibold text-gray-600 flex justify-between"
              >
                <span>Template Variables (JSON)</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  Optional
                </span>
              </Label>
              <Textarea
                id="broadcast-variables"
                value={variablesString}
                onChange={(e) => setVariablesString(e.target.value)}
                placeholder='{\n  "key": "value"\n}'
                className="min-h-[100px] font-mono text-xs border-gray-200 focus:ring-orange-500 rounded-lg leading-normal"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              disabled={isBroadcasting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isBroadcasting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6"
            >
              {isBroadcasting ? "Broadcasting..." : "Broadcast Push"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BroadcastPushModal;
