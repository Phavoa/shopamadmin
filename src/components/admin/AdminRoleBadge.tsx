import React from "react";

type AdminRole = "ADMIN" | "HUB_ADMIN" | "SUPER_ADMIN";

interface AdminRoleBadgeProps {
  role: AdminRole;
}

const formatRoleDisplay = (role: AdminRole): string => {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "HUB_ADMIN":
      return "Hub Admin";
    case "SUPER_ADMIN":
      return "Super Admin";
    default:
      return role;
  }
};

const getRoleColor = (role: AdminRole): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "#E67E22";
    case "HUB_ADMIN":
      return "#3B82F6";
    case "ADMIN":
    default:
      return "#6B7280";
  }
};

export const AdminRoleBadge: React.FC<AdminRoleBadgeProps> = ({ role }) => {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{
        backgroundColor: getRoleColor(role),
      }}
    >
      {formatRoleDisplay(role)}
    </span>
  );
};
