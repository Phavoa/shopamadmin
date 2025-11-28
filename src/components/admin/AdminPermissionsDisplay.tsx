import React from "react";

type AdminRole = "ADMIN" | "HUB_ADMIN" | "SUPER_ADMIN";

interface AdminPermissionsDisplayProps {
  role: AdminRole;
}

const rolePermissions = {
  ADMIN: [
    "Manage sellers and buyers",
    "View reports and analytics",
    "Monitor livestreams",
    "Limited settings access",
  ],
  HUB_ADMIN: [
    "Manage hub operations",
    "Handle deliveries and logistics",
    "View hub-specific reports",
    "Coordinate with delivery teams",
  ],
  SUPER_ADMIN: [
    "Full system access and control",
    "Manage all admins and users",
    "Configure system settings",
    "Access to all reports and analytics",
  ],
};

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

export const AdminPermissionsDisplay: React.FC<
  AdminPermissionsDisplayProps
> = ({ role }) => {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "8px",
        background: "#FFF3E6",
      }}
    >
      <h3 className="text-sm font-medium text-gray-900 mb-2">
        {formatRoleDisplay(role)} Permissions
      </h3>
      <ul className="space-y-1">
        {rolePermissions[role].map((permission, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-gray-700"
          >
            <span className="mt-1">•</span>
            <span>{permission}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
