import React from "react";
import { CreditCard, File, ZoomIn } from "lucide-react";
import { DisplaySeller } from "./verification-utils";

interface DocumentListProps {
  seller: DisplaySeller;
  onDocumentClick: (url: string, title: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  seller,
  onDocumentClick,
}) => {
  return (
    <div className="space-y-3 mb-6">
      {seller.govIdUrl && (
        <div
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => onDocumentClick(seller.govIdUrl!, "Government ID")}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#FFF",
              border: "0.3px solid rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CreditCard className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-700">Government ID</span>
            <p className="text-xs text-blue-600">Click to preview</p>
          </div>
          <ZoomIn className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {seller.businessDocUrl && (
        <div
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() =>
            seller.businessDocUrl &&
            onDocumentClick(seller.businessDocUrl, "Business Document")
          }
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#FFF",
              border: "0.3px solid rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <File className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-700">Business Document</span>
            <p className="text-xs text-blue-600">Click to preview</p>
          </div>
          <ZoomIn className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default DocumentList;
