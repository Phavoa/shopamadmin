import React from "react";
import { AlertCircle } from "lucide-react";

interface AdminErrorStateProps {
  onRetry: () => void;
}

export const AdminErrorState: React.FC<AdminErrorStateProps> = ({
  onRetry,
}) => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error Loading Admins
        </h2>
        <p className="text-gray-600 mb-4">
          Failed to load administrators. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#E67E22] text-white rounded-lg hover:bg-[#D2691E]"
        >
          Retry
        </button>
      </div>
    </div>
  );
};
