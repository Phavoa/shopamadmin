import React from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeStyles } from "./verification-utils";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge
      className={`rounded-full px-3 py-1 text-xs font-medium border ${getStatusBadgeStyles(
        status
      )}`}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
