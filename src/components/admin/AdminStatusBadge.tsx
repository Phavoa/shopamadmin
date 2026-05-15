import React from "react";

interface AdminStatusBadgeProps {
  isActive?: boolean;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  isActive,
}) => {
  // Default to true if isActive is undefined or missing from the API response
  const status = isActive !== false;

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{
        backgroundColor: status ? "#10B981" : "#EF4444",
      }}
    >
      {status ? "Active" : "Inactive"}
    </span>
  );
};
