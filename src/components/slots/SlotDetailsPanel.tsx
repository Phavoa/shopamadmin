"use client";

import React from "react";
import { ChevronDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Slot } from "@/lib/mockData";

interface SlotDetailsPanelProps {
  selectedSlot: Slot | null;
  selectedTime: string;
  onClose: () => void;
  onEdit: (slot: Slot) => void;
  onDelete: (slotId: string) => void;
}

const SlotDetailsPanel: React.FC<SlotDetailsPanelProps> = ({
  selectedSlot,
  selectedTime,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <h1
        className="text-[#111111] text-lg font-bold"
        style={{
          fontFamily:
            "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        }}
      >
        Slot Details (Selected: {selectedSlot?.startTime} -{" "}
        {selectedSlot?.endTime})
      </h1>
      <div
        className="w-full bg-[#ffffff] border border-[#e6e6e6] rounded-[12px] p-4 shadow-sm"
        style={{
          fontFamily:
            "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        }}
      >
        {selectedSlot ? (
          <div className="flex gap-4 justify-between">
            {/* Section 1: Slot Information */}
            <div className="max-w-sm space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-center">
                  <p className="text-xs font-medium  text-[#008d3f]">Status</p>
                  <Badge className="mt-1 bg-[#d7fdd9] text-[#008d3f] border-0 px-3 py-2 text-xs rounded-sm">
                    {selectedSlot.status === "booked" ? "Booked" : "Available"}
                    <ChevronDown className="inline-block ml-1" size={24} />
                  </Badge>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs font-medium text-[#666666]">Tier</p>
                  <Badge className="mt-1  border-[0.5px] border-[#f6dcbf] bg-transparent text-[#111111] px-3 py-2 text-xs rounded-sm">
                    {selectedSlot.tier}
                    <ChevronDown className="inline-block ml-1" size={24} />
                  </Badge>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs font-medium text-[#666666]">Cap</p>
                  <Badge className="mt-1 border-[0.5px] border-[#f6dcbf] bg-transparent text-[#111111] px-3 py-2 text-xs rounded-sm ">
                    120
                    <ChevronDown className="inline-block ml-1" size={24} />
                  </Badge>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xs font-medium text-[#666666]">Duration</p>
                  <Badge className="mt-1  border-[0.5px] border-[#f6dcbf] bg-transparent text-[#111111] px-3 py-2 text-xs rounded-sm">
                    {selectedSlot.duration} min
                    <ChevronDown className="inline-block ml-1" size={24} />
                  </Badge>
                </div>
              </div>
              <div className="pt-1">
                <h3 className="text-sm font-semibold text-gray-500 my-1">
                  Seller
                </h3>
                <div className="flex justify-start border border-[#e6e6e6] rounded-lg  items-center px-3 py-2 w-fit gap-3">
                  <p className="text-xs text-gray-900 font-medium">
                    {selectedSlot.sellerName}
                  </p>
                  <div className="w-px bg-gray-500 h-4" />
                  <p className="text-xs text-gray-900 font-medium">
                    Reliability: 95%
                  </p>
                  <div className="w-px bg-gray-500 h-4" />

                  <p className="text-xs text-gray-900 font-medium">
                    Strikes: 0
                  </p>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-[#e6e6e6]" />

            <div className="flex flex-col justify-between">
              <p className="text-gray-800 text-sm ">Reliability Score: 95%</p>
              <p className="text-gray-800 text-sm ">Products queued: 5</p>
              <p className="text-gray-800 text-sm ">Last no-show: None</p>
              <p className="text-gray-800 text-sm ">Strikes: 0</p>
            </div>
            <div className="w-px bg-[#e6e6e6]" />
            <div className="flex flex-col justify-between">
              <p className="text-gray-800 ">
                Standby Sellers (Similar Category)
              </p>
              <div className="flex justify-between">
                <p className="text-gray-800 text-sm ">Phone World</p>
                <p className="text-gray-800 text-sm ">95%</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-800 text-sm ">Phone World</p>
                <p className="text-gray-800 text-sm ">95%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-base font-semibold text-[#111111] mb-2">
              No Slot Selected
            </h3>
            <p className="text-sm text-[#666666]">
              Click on a slot in the calendar to view its details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotDetailsPanel;
