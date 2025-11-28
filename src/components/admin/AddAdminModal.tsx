import React from "react";
import { X } from "lucide-react";
import { AdminForm } from "./AdminForm";

type AdminRole = "ADMIN" | "HUB_ADMIN" | "SUPER_ADMIN";

interface AddAdminModalProps {
  isOpen: boolean;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
  isLoading: boolean;
  onClose: () => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: AdminRole) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  firstName,
  lastName,
  email,
  role,
  isLoading,
  onClose,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onRoleChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        style={{
          width: "500px",
          padding: "24px",
          borderRadius: "18px",
          background: "#FFF",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">Add New Admin</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <AdminForm
          mode="add"
          firstName={firstName}
          lastName={lastName}
          email={email}
          role={role}
          onFirstNameChange={onFirstNameChange}
          onLastNameChange={onLastNameChange}
          onEmailChange={onEmailChange}
          onRoleChange={onRoleChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
