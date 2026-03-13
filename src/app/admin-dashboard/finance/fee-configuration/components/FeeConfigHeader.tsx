import React from "react";

interface FeeConfigHeaderProps {
  effectiveFrom?: string;
  isSaving: boolean;
  isPublishing: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const FeeConfigHeader: React.FC<FeeConfigHeaderProps> = ({
  effectiveFrom,
  isSaving,
  isPublishing,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-black">Fee Configuration</h1>
      <div className="flex gap-3">
        <button
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#FFF",
            color: "#374151",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "default",
          }}
        >
          {effectiveFrom ? `Current: ${effectiveFrom}` : "No Live Config"}
        </button>
        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            border: "1px solid #E5E7EB",
            background: "#FFF",
            color: "#374151",
            fontSize: "14px",
            fontWeight: 500,
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          {isSaving ? "Saving..." : "Save Draft"}
        </button>
        <button
          onClick={onPublish}
          disabled={isPublishing}
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            background: "#E67E22",
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: isPublishing ? "not-allowed" : "pointer",
            opacity: isPublishing ? 0.7 : 1,
          }}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
};
