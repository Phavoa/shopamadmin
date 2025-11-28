import React from "react";
import { Plus, Edit, Loader2, ChevronDown } from "lucide-react";
import { AdminPermissionsDisplay } from "./AdminPermissionsDisplay";

type AdminRole = "ADMIN" | "HUB_ADMIN" | "SUPER_ADMIN";

interface AdminFormProps {
  mode: "add" | "edit";
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: AdminRole) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  mode,
  firstName,
  lastName,
  email,
  role,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onRoleChange,
  onSubmit,
  isLoading,
}) => {
  const buttonText = isLoading
    ? mode === "add"
      ? "Creating Admin..."
      : "Updating Admin..."
    : mode === "add"
    ? "Add Admin"
    : "Update Admin";

  const buttonIcon = isLoading ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : mode === "add" ? (
    <Plus className="w-4 h-4" />
  ) : (
    <Edit className="w-4 h-4" />
  );

  const title = mode === "add" ? "Add New Admin" : "Edit Admin";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* <h2 className="text-xl font-semibold text-black mb-6">{title}</h2> */}

      {/* First Name */}
      <div>
        <input
          type="text"
          placeholder="Enter First Name"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      {/* Last Name */}
      <div>
        <input
          type="text"
          placeholder="Enter Last Name"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "0.3px solid rgba(0, 0, 0, 0.20)",
            fontSize: "14px",
            outline: "none",
          }}
        />
      </div>

      {/* Role Dropdown */}
      <div>
        <label className="text-sm text-gray-700 mb-2 block">
          Select Admin Role:
        </label>
        <div className="relative">
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value as AdminRole)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              fontSize: "14px",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            <option value="ADMIN">Admin</option>
            <option value="HUB_ADMIN">Hub Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Permissions Display */}
      <AdminPermissionsDisplay role={role} />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          background: "#E67E22",
          border: "none",
          color: "white",
          fontSize: "14px",
          fontWeight: "500",
          cursor: isLoading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginTop: "8px",
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {buttonIcon}
        {buttonText}
      </button>
    </form>
  );
};
