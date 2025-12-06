import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

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
  onUpgradeToSuspension?: (strike: StrikeRecord) => void;
  onExtendSuspension?: (strike: StrikeRecord) => void;
  onRevoke?: (strike: StrikeRecord) => void | Promise<void>;
  onContact?: (strike: StrikeRecord) => void;
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

const formatCooldownDate = (dateString: string | null): string => {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "-";

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "-";
  }
};

export const StrikeRow: React.FC<StrikeRowProps> = ({
  strike,
  onUpgradeToSuspension,
  onExtendSuspension,
  onRevoke,
  onContact,
}) => {
  return (
    <tr className="border-b border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]">
      <td className="py-4 px-4 text-sm font-medium text-[#111827]">
        {strike.buyerId.substring(0, 10)}...
      </td>
      <td className="py-4 px-4 text-sm font-medium text-[#111827]">
        {strike.buyerName}
      </td>
      <td className="py-4 px-4 text-sm text-[#111827]">{strike.reason}</td>
      <td className="py-4 px-4 text-sm text-[#111827]">
        {formatDistanceToNow(new Date(strike.date), {
          addSuffix: true,
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
        {formatCooldownDate(strike.cooldownEnds)}
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          {strike.status === "Suspended" ? (
            <>
              <Button
                onClick={() => onRevoke?.(strike)}
                size="sm"
                className="bg-[#E67E22] hover:bg-[#D4731F] text-white px-3 py-1 h-8 text-xs flex-1"
              >
                Reinstate
              </Button>
              <Button
                onClick={() => onExtendSuspension?.(strike)}
                size="sm"
                variant="outline"
                className="border-[#E67E22] text-[#E67E22] hover:bg-[#FFF5EB] px-3 py-1 h-8 text-xs flex-1"
              >
                Extend
              </Button>
              <Button
                onClick={() => onContact?.(strike)}
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
                onClick={() => onRevoke?.(strike)}
                size="sm"
                className="bg-[#E67E22] hover:bg-[#D4731F] text-white px-3 py-1 h-8 text-xs flex-1"
              >
                Clear
              </Button>
              <Button
                onClick={() => onUpgradeToSuspension?.(strike)}
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
