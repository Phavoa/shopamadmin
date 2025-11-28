import React from "react";
import { Loader2 } from "lucide-react";

export const AdminLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-[#E67E22]" />
        <span className="text-gray-600">Loading admins...</span>
      </div>
    </div>
  );
};
