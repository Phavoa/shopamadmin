import React from "react";
import DocumentList from "./DocumentList";
import DocumentPreview from "./DocumentPreview";
import { DisplaySeller } from "./verification-utils";

interface SellerDetailsProps {
  selectedSeller: DisplaySeller | null;
  loading: boolean;
  onDocumentClick: (url: string, title: string) => void;
  onApprove: () => void;
  onReject: () => void;
}

const EmptyDetails = () => {
  return (
    <>
      <h2 className="text-lg font-semibold text-black mb-6">Details</h2>
      <div
        style={{
          width: "100%",
          height: "300px",
          border: "2px dashed #E5E7EB",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
          marginBottom: "24px",
        }}
      >
        <div className="text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm text-gray-500">
            Select a seller to review documents
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          disabled
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            background: "#E5E7EB",
            color: "#9CA3AF",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: "not-allowed",
          }}
        >
          Approve
        </button>
        <button
          disabled
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            background: "#FFF",
            color: "#9CA3AF",
            fontSize: "14px",
            fontWeight: 500,
            border: "0.3px solid #E5E7EB",
            cursor: "not-allowed",
          }}
        >
          Reject
        </button>
      </div>
    </>
  );
};

const SellerDetails: React.FC<SellerDetailsProps> = ({
  selectedSeller,
  loading,
  onDocumentClick,
  onApprove,
  onReject,
}) => {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "18px",
        border: "0.3px solid rgba(0, 0, 0, 0.20)",
        background: "#FFF",
      }}
    >
      {selectedSeller ? (
        <>
          <h2 className="text-lg font-semibold text-black mb-6">
            Details - {selectedSeller.shopName}
          </h2>

          <div className="mb-6 space-y-2 text-sm">
            <p>
              <strong>Business Name:</strong>{" "}
              {selectedSeller.businessName || "N/A"}
            </p>
            <p>
              <strong>Category:</strong>{" "}
              {selectedSeller.businessCategory || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {selectedSeller.locationCity},{" "}
              {selectedSeller.locationState}
            </p>
          </div>

          <DocumentList
            seller={selectedSeller}
            onDocumentClick={onDocumentClick}
          />

          <DocumentPreview
            seller={selectedSeller}
            onDocumentClick={onDocumentClick}
          />

          <div className="flex gap-3">
            <button
              onClick={onApprove}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                background: "#E67E22",
                color: "#FFF",
                fontSize: "14px",
                fontWeight: 500,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Approve
            </button>
            <button
              onClick={onReject}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                background: "#FFF",
                color: "#EF4444",
                fontSize: "14px",
                fontWeight: 500,
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Reject
            </button>
          </div>
        </>
      ) : (
        <EmptyDetails />
      )}
    </div>
  );
};

export default SellerDetails;
