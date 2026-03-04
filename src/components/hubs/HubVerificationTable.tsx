import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { HubDisplay } from "./types";
import { formatTimeAgo } from "./hub-utils";

interface HubVerificationTableProps {
  hubs: HubDisplay[];
  isLoading: boolean;
  error: string | null;
  selectedHub: HubDisplay | null;
  onHubSelect: (hub: HubDisplay) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "#FEF3C7";
  let textColor = "#D97706";

  switch (status) {
    case "APPROVED":
      bgColor = "#D1FAE5";
      textColor = "#059669";
      break;
    case "REJECTED":
      bgColor = "#FEE2E2";
      textColor = "#DC2626";
      break;
    case "DENIED":
      bgColor = "#FEE2E2";
      textColor = "#DC2626";
      break;
    default:
      break;
  }

  return (
    <span
      className="px-3 py-1 text-xs font-semibold rounded-full"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

const HubVerificationTable: React.FC<HubVerificationTableProps> = ({
  hubs,
  isLoading,
  error,
  selectedHub,
  onHubSelect,
}) => {
  return (
    <div
      style={{
        borderRadius: "16px",
        border: "0.3px solid rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
      }}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-left py-4 px-6 text-lg font-semibold text-black">
                Hub Name
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-lg font-semibold text-black">
                Status
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-lg font-semibold text-black">
                Submitted
              </TableHead>
              <TableHead className="text-left py-4 px-6 text-lg font-semibold text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="border-b border-gray-200">
                  <TableCell className="py-4 px-6">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-red-600"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : hubs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-gray-500"
                >
                  No hubs to review
                </TableCell>
              </TableRow>
            ) : (
              hubs.map((hub) => {
                const isSelected = selectedHub?.id === hub.id;
                const isPending = hub.status === "PENDING";

                return (
                  <TableRow
                    key={hub.id}
                    onClick={() => onHubSelect(hub)}
                    className="border-b border-gray-200"
                    style={{
                      backgroundColor: isSelected ? "#FDF8F3" : "",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <TableCell className="py-4 px-6 text-sm text-black font-medium">
                      {hub.name.length > 14
                        ? hub.name.slice(0, 14) + "...."
                        : hub.name}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <StatusBadge status={hub.status} />
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                      {formatTimeAgo(hub.submittedAt)}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onHubSelect(hub);
                        }}
                        style={{
                          padding: "6px 20px",
                          borderRadius: "8px",
                          border: "0.3px solid rgba(0, 0, 0, 0.20)",
                          background: isSelected
                            ? "#E67E22"
                            : isPending
                              ? "#FFF"
                              : "#FFF",
                          color: isSelected ? "#FFF" : "#000",
                          fontSize: "14px",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isPending && !isSelected ? "Review" : "View"}
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HubVerificationTable;
