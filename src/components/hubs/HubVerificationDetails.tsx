"use client";

import React, { useState } from "react";
import { HubDisplay } from "./types";
import { Loader2, X, ZoomIn } from "lucide-react";

interface HubVerificationDetailsProps {
  selectedHub: HubDisplay | null;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

/** Lightbox modal – opens an image/doc URL full-screen */
const ImageLightbox = ({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "rgba(255,255,255,0.15)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <X size={20} />
      </button>

      <p
        style={{
          color: "#fff",
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: "16px",
          letterSpacing: "0.02em",
        }}
      >
        {title}
      </p>

      {/* Prevent click inside from closing */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflow: "auto",
          borderRadius: "12px",
        }}
      >
        <img
          src={url}
          alt={title}
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            borderRadius: "12px",
            objectFit: "contain",
            display: "block",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML =
                '<div style="color:#aaa;text-align:center;padding:40px;font-size:14px">Unable to load document preview</div>';
            }
          }}
        />
      </div>
    </div>
  );
};

const DocIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const EmptyDetails = () => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <h2 className="text-lg font-semibold mb-4">Details</h2>
    <div
      style={{
        flex: 1,
        border: "2px dashed #E5E7EB",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAFA",
        marginBottom: "24px",
        minHeight: "240px",
      }}
    >
      <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
        Select a hub to review details
      </p>
    </div>
    <div style={{ display: "flex", gap: "12px" }}>
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
  </div>
);

const HubVerificationDetails: React.FC<HubVerificationDetailsProps> = ({
  selectedHub,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string>("");

  // Reset to first document whenever a different hub is selected
  React.useEffect(() => {
    setSelectedDocIndex(0);
  }, [selectedHub?.id]);

  const docs = selectedHub?.documents ?? [];
  const activeDoc = docs[selectedDocIndex] ?? null;

  const openLightbox = (url: string, title: string) => {
    if (!url) return;
    setLightboxUrl(url);
    setLightboxTitle(title);
  };

  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "18px",
        border: "0.3px solid rgba(0, 0, 0, 0.20)",
        background: "#FFF",
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}
    >
      {/* Lightbox */}
      {lightboxUrl && (
        <ImageLightbox
          url={lightboxUrl}
          title={lightboxTitle}
          onClose={() => setLightboxUrl(null)}
        />
      )}

      {selectedHub ? (
        <>
          {/* Header */}
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#111",
              marginBottom: "20px",
            }}
          >
            Details - {selectedHub.name}
          </h2>

          {/* Document list */}
          <div style={{ marginBottom: "20px" }}>
            {docs.length > 0 ? (
              docs.map((doc, index) => {
                const isActive = index === selectedDocIndex;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDocIndex(index)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: isActive ? "#FDF8F3" : "transparent",
                      marginBottom: "4px",
                      transition: "background 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        color: isActive ? "#E67E22" : "#6B7280",
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <DocIcon />
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: isActive ? "#E67E22" : "#111",
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      {doc.title}
                    </span>
                  </div>
                );
              })
            ) : (
              <p
                style={{
                  fontSize: "13px",
                  color: "#9CA3AF",
                  fontStyle: "italic",
                }}
              >
                No documents uploaded.
              </p>
            )}
          </div>

          {/* Document Image preview */}
          <div style={{ marginBottom: "20px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#111",
                marginBottom: "10px",
              }}
            >
              Document Image
            </p>

            <div
              onClick={() =>
                activeDoc?.url
                  ? openLightbox(activeDoc.url, activeDoc.title)
                  : undefined
              }
              style={{
                width: "100%",
                minHeight: "160px",
                borderRadius: "12px",
                border: "1.5px dashed #D1D5DB",
                background: "#F9FAFB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                cursor: activeDoc?.url ? "zoom-in" : "default",
                transition: "border-color 0.2s ease",
              }}
            >
              {activeDoc?.url ? (
                <>
                  <img
                    src={activeDoc.url}
                    alt={activeDoc.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0,
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  {/* Zoom hover overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s ease",
                    }}
                    className="doc-preview-overlay"
                  >
                    <ZoomIn
                      size={28}
                      color="white"
                      style={{ opacity: 0, transition: "opacity 0.2s ease" }}
                      className="doc-preview-zoom-icon"
                    />
                  </div>
                </>
              ) : (
                <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
                  Documents Image Preview
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={onApprove}
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                background: "#E67E22",
                color: "#FFF",
                fontSize: "14px",
                fontWeight: 500,
                border: "none",
                cursor: isProcessing ? "not-allowed" : "pointer",
                opacity: isProcessing ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "opacity 0.2s ease",
              }}
            >
              {isProcessing && <Loader2 size={16} className="animate-spin" />}
              Approve
            </button>
            <button
              onClick={onReject}
              disabled={isProcessing}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                background: "#FFF",
                color: "#EF4444",
                fontSize: "14px",
                fontWeight: 500,
                border: "0.3px solid rgba(0,0,0,0.20)",
                cursor: isProcessing ? "not-allowed" : "pointer",
                opacity: isProcessing ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "opacity 0.2s ease",
              }}
            >
              {isProcessing && <Loader2 size={16} className="animate-spin" />}
              Reject
            </button>
          </div>
        </>
      ) : (
        <EmptyDetails />
      )}

      {/* Hover CSS for the zoom overlay */}
      <style>{`
        .doc-preview-overlay:hover {
          background: rgba(0,0,0,0.35) !important;
        }
        .doc-preview-overlay:hover .doc-preview-zoom-icon {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default HubVerificationDetails;
