import React from "react";
import { FileText } from "lucide-react";
import { DisplaySeller } from "./verification-utils";

interface DocumentPreviewProps {
  seller: DisplaySeller;
  onDocumentClick: (url: string, title: string) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  seller,
  onDocumentClick,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-black mb-3">Document Preview</h3>
      <div
        style={{
          width: "100%",
          height: "200px",
          border: "2px dashed #E5E7EB",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
          cursor: seller.govIdUrl ? "pointer" : "default",
        }}
        onClick={() =>
          seller.govIdUrl && onDocumentClick(seller.govIdUrl, "Government ID")
        }
      >
        {seller.govIdUrl ? (
          <img
            src={seller.govIdUrl}
            alt="Government ID"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No document uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;
