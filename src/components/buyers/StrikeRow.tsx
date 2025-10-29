import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StrikeRecord {
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

interface StrikeRowProps {
  strike: StrikeRecord;
}

const getStatusBadgeStyles = (status: string) => {
  if (status.includes("Strike")) {
    return "bg-[#D4F4DD] text-[#2E7D32] border-none";
  } else if (status === "Suspended") {
    return "bg-[#FFD4D4] text-[#D32F2F] border-none";
  } else {
    return "bg-[#E8F5E9] text-[#43A047] border-none";
  }
};

export const StrikeRow: React.FC<StrikeRowProps> = ({ strike }) => {
  return (
    <tr className="border-b border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]">
      <td className="py-4 px-4 text-sm font-medium text-[#111827]">
        {strike.buyerId}
      </td>
      <td className="py-4 px-4 text-sm font-medium text-[#111827]">
        {strike.buyerName}
      </td>
      <td className="py-4 px-4 text-sm text-[#111827]">{strike.reason}</td>
      <td className="py-4 px-4 text-sm text-[#111827]">
        {new Date(strike.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className="py-4 px-4">
        <Badge
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeStyles(
            strike.status
          )}`}
        >
          {strike.status}
        </Badge>
      </td>
      <td className="py-4 px-4 text-sm text-[#111827]">
        {strike.cooldownEnds
          ? new Date(strike.cooldownEnds).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          : "-"}
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          {strike.status === "Suspended" ? (
            <>
              <Button
                size="sm"
                className="bg-[#E67E22] hover:bg-[#D4731F] text-white px-3 py-1 h-8 text-xs flex-1"
              >
                Reinstate
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#E67E22] text-[#E67E22] hover:bg-[#FFF5EB] px-3 py-1 h-8 text-xs flex-1"
              >
                Extend
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#E67E22] text-[#E67E22] hover:bg-[#FFF5EB] px-3 py-1 h-8 text-xs flex-1"
              >
                Contact
              </Button>
            </>
          ) : strike.status.includes("Strike") ? (
            <>
              <Button
                size="sm"
                className="bg-[#E67E22] hover:bg-[#D4731F] text-white px-3 py-1 h-8 text-xs flex-1"
              >
                Clear
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#E67E22] text-[#E67E22] hover:bg-[#FFF5EB] px-3 py-1 h-8 text-xs flex-1"
              >
                Upgrade to Suspend
              </Button>
            </>
          ) : null}
        </div>
      </td>
    </tr>
  );
};
