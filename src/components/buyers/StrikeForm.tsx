"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Toggle ON SVG
const ToggleOnIcon = () => (
  <svg
    width="36"
    height="20"
    viewBox="0 0 36 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 10C0 4.47715 4.47715 0 10 0H25.7141C31.2369 0 35.7141 4.47715 35.7141 10C35.7141 15.5228 31.2369 20 25.7141 20H10C4.47715 20 0 15.5228 0 10Z"
      fill="#11C35B"
    />
    <path
      d="M25.7148 0.75C30.8234 0.750035 34.9648 4.89138 34.9648 10C34.9648 15.1086 30.8234 19.25 25.7148 19.25C20.6063 19.25 16.4648 15.1086 16.4648 10C16.4648 4.89136 20.6063 0.75 25.7148 0.75Z"
      fill="white"
      stroke="#11C35B"
      strokeWidth="1.5"
    />
  </svg>
);

// Toggle OFF SVG
const ToggleOffIcon = () => (
  <svg
    width="36"
    height="20"
    viewBox="0 0 36 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 10C0 4.47715 4.47715 0 10 0H25.7141C31.2369 0 35.7141 4.47715 35.7141 10C35.7141 15.5228 31.2369 20 25.7141 20H10C4.47715 20 0 15.5228 0 10Z"
      fill="#D1D5DB"
    />
    <path
      d="M10 0.75C15.1086 0.750035 19.25 4.89138 19.25 10C19.25 15.1086 15.1086 19.25 10 19.25C4.89136 19.25 0.75 15.1086 0.75 10C0.75 4.89136 4.89136 0.75 10 0.75Z"
      fill="white"
      stroke="#D1D5DB"
      strokeWidth="1.5"
    />
  </svg>
);

interface StrikeFormProps {
  selectedBuyer: string;
  reason: string;
  cooldownDays: string;
  onBuyerChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onCooldownDaysChange: (value: string) => void;
}

export const StrikeForm: React.FC<StrikeFormProps> = ({
  selectedBuyer,
  reason,
  cooldownDays,
  onBuyerChange,
  onReasonChange,
  onCooldownDaysChange,
}) => {
  const [notifyBuyer, setNotifyBuyer] = useState(true);
  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
      <div className="text-lg font-semibold text-[#111827] mb-4">
        Issue New Buyer Strike / Suspension
      </div>
      <div className="flex flex-col gap-4">
        <Select value={selectedBuyer} onValueChange={onBuyerChange}>
          <SelectTrigger className="w-full border border-[#D1D5DB] py-6 px-3 rounded-sm text-sm text-[#111827]">
            <SelectValue placeholder="Type Buyers Name to Select" />
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
      {/* Notify Buyer Toggle */}
      <div className="flex items-center justify-between py-3">
        <span className="text-sm font-medium text-gray-700">
          Notify Buyer (email/sms)
        </span>
        <button
          type="button"
          onClick={() => setNotifyBuyer(!notifyBuyer)}
          className="focus:outline-none"
        >
          {notifyBuyer ? <ToggleOnIcon /> : <ToggleOffIcon />}
        </button>
      </div>

      <div className="flex flex-1 gap-2 mt-4">
        <Button className="bg-[#E67E22] hover:bg-[#D4731F] text-white w-full py-7">
          Apply Strike/Suspension
        </Button>
      </div>
    </div>
  );
};
