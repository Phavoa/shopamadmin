import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ReferralsHeaderProps {
  onBack?: () => void;
}

const ReferralsHeader: React.FC<ReferralsHeaderProps> = ({ onBack }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Default behavior - navigate back
      window.history.back();
    }
  };

  return (
    <div>
      {/* Back Button */}
      <Button
        className="mb-6 px-4 py-2 flex items-center gap-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Back to Settings</span>
      </Button>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-none border border-gray-200">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">User Referrals</h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor top referrers and their earnings
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralsHeader;
