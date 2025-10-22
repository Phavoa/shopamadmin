"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StrikeFormProps {
  selectedSeller: string;
  reason: string;
  cooldownDays: string;
  onSellerChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onCooldownDaysChange: (value: string) => void;
}

export const StrikeForm: React.FC<StrikeFormProps> = ({
  selectedSeller,
  reason,
  cooldownDays,
  onSellerChange,
  onReasonChange,
  onCooldownDaysChange,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
      <div className="text-lg font-semibold text-[#111827] mb-4">
        Apply Strike or Suspension
      </div>
      <div className="flex flex-col gap-4">
        <Select value={selectedSeller} onValueChange={onSellerChange}>
          <SelectTrigger className="w-full border border-[#D1D5DB] py-6 px-3 rounded-sm text-sm text-[#111827]">
            <SelectValue placeholder="Type Sellers Name to Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="john-doe">John Doe</SelectItem>
            <SelectItem value="jane-smith">Jane Smith</SelectItem>
            <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
            <SelectItem value="alice-brown">Alice Brown</SelectItem>
            <SelectItem value="charlie-wilson">Charlie Wilson</SelectItem>
            <SelectItem value="diana-prince">Diana Prince</SelectItem>
            <SelectItem value="edward-norton">Edward Norton</SelectItem>
            <SelectItem value="fiona-green">Fiona Green</SelectItem>
            <SelectItem value="george-miller">George Miller</SelectItem>
            <SelectItem value="helen-davis">Helen Davis</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Type the reason, e.g., Fake Product, No show, Abuse"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          className="w-full border border-[#D1D5DB] py-6 px-3 rounded-sm text-sm text-[#111827]"
        />
        <Select value={cooldownDays} onValueChange={onCooldownDaysChange}>
          <SelectTrigger className="w-full border border-[#D1D5DB] py-6 px-3 rounded-sm text-sm text-[#111827]">
            <SelectValue placeholder="Select Number of Cooldown days (if Suspended)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="14">14 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="60">60 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-1 gap-2 mt-4">
        <Button className="bg-[#E67E22] hover:bg-[#D4731F] text-white w-full py-7">
          Apply Strike/Suspension
        </Button>
      </div>
    </div>
  );
};
