import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  isCreating: boolean;
  onAddClick: () => void;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  isCreating,
  onAddClick,
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        onClick={() => router.push("/admin-dashboard/settings")}
        className="bg-gray-200 hover:bg-gray-300 flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Settings</span>
      </Button>

      <button
        onClick={onAddClick}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          background: "#E67E22",
          border: "none",
          color: "white",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        disabled={isCreating}
      >
        {isCreating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        {isCreating ? "Creating..." : "Add New Admin"}
      </button>
    </div>
  );
};
