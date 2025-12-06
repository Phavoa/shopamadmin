"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Search } from "lucide-react";
import { StrikeRow } from "./StrikeRow";

export interface StrikeRecord {
  id: string;
  buyerId: string;
  buyerName: string;
  reason: string;
  date: string;
  status: string;
  cooldownEnds: string | null;
  buyerEmail: string;
  issuedBy: string;
  description: string;
}

interface StrikesTableProps {
  strikes: StrikeRecord[];
  fetchingStrikes: boolean;
  error: string | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onUpgradeToSuspension?: (strike: StrikeRecord) => void;
  onExtendSuspension?: (strike: StrikeRecord) => void;
  onRevoke?: (strike: StrikeRecord) => Promise<void>;
  onContact?: (strike: StrikeRecord) => void;
}

export const StrikesTable: React.FC<StrikesTableProps> = ({
  strikes,
  fetchingStrikes,
  error,
  searchQuery,
  onSearchChange,
  onUpgradeToSuspension,
  onExtendSuspension,
  onRevoke,
  onContact,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] mb-8">
      <div className="px-6 py-6">
        <div className="text-2xl font-semibold text-[#111827]">
          Strikes & Suspensions
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
          <Input
            placeholder="Search Buyer by Name, ID, or Category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-lg text-sm bg-white"
          />
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#E5E7EB] bg-white">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4B5563]">
                  Buyer ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4B5563]">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4B5563]">
                  Reason
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4B5563]">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4B5563]">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4B5563]">
                  Cooldown ends
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#4B5563]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fetchingStrikes ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Loading strikes...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : strikes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#9ca3af]">
                    No strikes found
                  </td>
                </tr>
              ) : (
                strikes.map((strike) => (
                  <StrikeRow
                    key={strike.id}
                    strike={strike}
                    onUpgradeToSuspension={onUpgradeToSuspension}
                    onExtendSuspension={onExtendSuspension}
                    onRevoke={onRevoke}
                    onContact={onContact}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
