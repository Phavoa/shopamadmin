import React from "react";

interface AdminStatusBadgeProps {
  isActive: boolean;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  isActive,
}) => {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{
        backgroundColor: isActive ? "#10B981" : "#EF4444",
      }}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};
