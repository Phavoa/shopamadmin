import React from "react";
import { AppealRecord } from "@/app/admin-dashboard/sellers/appeals/page";

interface AppealDetailProps {
  appeal: AppealRecord | null;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const AppealDetail: React.FC<AppealDetailProps> = ({ appeal }) => {
  if (!appeal) {
    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
          padding: "32px",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            color: "#6B7280",
          }}
        >
          Select an appeal from the inbox to view details
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        padding: "32px",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          {appeal.caseId}
        </div>
        <div
          style={{
            fontSize: "16px",
            color: "#6B7280",
          }}
        >
          {appeal.reason}
        </div>
      </div>

      {/* Seller Information */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Seller Information
        </div>
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontWeight: 500,
                color: "#374151",
                minWidth: "120px",
              }}
            >
              Name:
            </span>
            <span style={{ color: "#111827" }}>{appeal.sellerName}</span>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontWeight: 500,
                color: "#374151",
                minWidth: "120px",
              }}
            >
              Email:
            </span>
            <span style={{ color: "#111827" }}>{appeal.sellerEmail}</span>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontWeight: 500,
                color: "#374151",
                minWidth: "120px",
              }}
            >
              Seller ID:
            </span>
            <span style={{ color: "#111827" }}>{appeal.sellerId}</span>
          </div>
        </div>
      </div>

      {/* Appeal Details */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Appeal Details
        </div>
        <div style={{ display: "grid", gap: "8px" }}>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontWeight: 500,
                color: "#374151",
                minWidth: "120px",
              }}
            >
              Status:
            </span>
            <span
              style={{
                color: "#111827",
                textTransform: "capitalize",
              }}
            >
              {appeal.status}
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontWeight: 500,
                color: "#374151",
                minWidth: "120px",
              }}
            >
              Submitted:
            </span>
            <span style={{ color: "#111827" }}>
              {formatDate(appeal.dateSubmitted)}
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                fontWeight: 500,
                color: "#374151",
                minWidth: "120px",
              }}
            >
              Last Updated:
            </span>
            <span style={{ color: "#111827" }}>
              {formatDate(appeal.lastUpdated)}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#111827",
            marginBottom: "16px",
          }}
        >
          Description
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#374151",
            lineHeight: "1.75",
          }}
        >
          {appeal.description}
        </div>
      </div>

      {/* Attachments */}
      {appeal.attachments && appeal.attachments.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Attachments
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "16px",
            }}
          >
            {appeal.attachments.map((attachment, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  padding: "16px",
                  textAlign: "center",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    color: "#9CA3AF",
                    marginBottom: "8px",
                  }}
                >
                  📎
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "8px",
                  }}
                >
                  {attachment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {appeal.notes && appeal.notes.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Admin Notes
          </div>
          <ul
            style={{
              listStyle: "none",
              paddingLeft: "0",
              margin: "0",
            }}
          >
            {appeal.notes.map((note, index) => (
              <li
                key={index}
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  marginBottom: "8px",
                  paddingLeft: "16px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "0",
                  }}
                >
                  -
                </span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Audit Trail */}
      {appeal.auditTrail && appeal.auditTrail.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Audit Trail
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#6B7280",
              lineHeight: "1.75",
            }}
          >
            {appeal.auditTrail.map((entry, index) => (
              <div key={index} style={{ marginBottom: "4px" }}>
                {entry}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <button
          style={{
            fontSize: "14px",
            fontWeight: 500,
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#10B981",
            color: "#FFFFFF",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          Reinstate
        </button>
        <button
          style={{
            fontSize: "14px",
            fontWeight: 500,
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          Extend
        </button>
        <button
          style={{
            fontSize: "14px",
            fontWeight: 500,
            padding: "10px 16px",
            borderRadius: "6px",
            border: "1px solid #D1D5DB",
            backgroundColor: "#FFFFFF",
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F9FAFB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FFFFFF";
          }}
        >
          Contact
        </button>
      </div>
    </div>
  );
};
