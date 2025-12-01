// src/components/logistics/RequestMoreEvidenceModal.tsx

import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RequestMoreEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  exceptionId: string;
  orderId: string;
  onSubmit: (orderId: string, note: string) => void;
  isLoading: boolean;
}

export default function RequestMoreEvidenceModal({
  isOpen,
  onClose,
  exceptionId,
  orderId,
  onSubmit,
  isLoading,
}: RequestMoreEvidenceModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const note = formData.get("note") as string;

    if (note.trim()) {
      onSubmit(orderId, note.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-50 backdrop-blur-[3px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Request More Evidence</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Exception ID:</span> {exceptionId}
              </p>
              <p>
                <span className="font-medium">Order ID:</span> {orderId}
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="note">Evidence Request Note</Label>
            <textarea
              id="note"
              name="note"
              rows={4}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide details about what additional evidence is needed from the buyer..."
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
