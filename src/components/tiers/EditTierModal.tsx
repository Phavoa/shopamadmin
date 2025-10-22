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
import { X } from "lucide-react";

type Tier = {
  id: string;
  title: string;
  subtitle?: string;
  meta: string[];
};

interface EditTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: Tier | null;
  onSave: (updatedTier: Tier) => void;
}

export default function EditTierModal({
  isOpen,
  onClose,
  tier,
  onSave,
}: EditTierModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [meta, setMeta] = useState<string[]>([]);

  useEffect(() => {
    if (tier) {
      setTitle(tier.title);
      setSubtitle(tier.subtitle || "");
      setMeta([...tier.meta]);
    }
  }, [tier]);

  const handleSave = () => {
    if (tier) {
      const updatedTier: Tier = {
        ...tier,
        title,
        subtitle: subtitle || undefined,
        meta,
      };
      onSave(updatedTier);
      onClose();
    }
  };

  const handleMetaChange = (index: number, value: string) => {
    const newMeta = [...meta];
    newMeta[index] = value;
    setMeta(newMeta);
  };

  const addMeta = () => {
    setMeta([...meta, ""]);
  };

  const removeMeta = (index: number) => {
    setMeta(meta.filter((_, i) => i !== index));
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
              htmlFor="title"
              className="text-sm font-medium text-slate-700"
            >
              Tier Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter tier title"
              className="w-full border border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="subtitle"
              className="text-sm font-medium text-slate-700 "
            >
              Subtitle (Optional)
            </Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter subtitle"
              className="w-full border border-gray-200"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              Meta Information
            </Label>
            <div className="space-y-3">
              {meta.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={item}
                    onChange={(e) => handleMetaChange(index, e.target.value)}
                    placeholder="Enter meta item (e.g., Viewer cap: 50)"
                    className="flex-1 border border-gray-200"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeta(index)}
                    className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    aria-label="Remove meta item"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addMeta}
                className="w-full border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700"
              >
                + Add Meta Item
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-[#E67A2B] hover:bg-[#D86A1F] text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
