import { AppealRecord } from "@/app/admin-dashboard/sellers/appeals/page";
import React from "react";

interface AppealsInboxProps {
  appeals: AppealRecord[];
  loading: boolean;
  selectedAppeal: AppealRecord | null;
  onSelectAppeal: (appeal: AppealRecord) => void;
}

const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case "Open":
      return { backgroundColor: "#FEF3C7", color: "#92400E" };
    case "Under Review":
      return { backgroundColor: "#DBEAFE", color: "#1E40AF" };
    case "Resolved":
      return { backgroundColor: "#D1FAE5", color: "#065F46" };
    case "Rejected":
      return { backgroundColor: "#FEE2E2", color: "#991B1B" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#374151" };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const AppealsInbox: React.FC<AppealsInboxProps> = ({
  appeals,
  loading,
  selectedAppeal,
  onSelectAppeal,
}) => {
  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: "1px solid #E5E7EB",
          padding: "16px",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "24px",
          }}
        >
          Appeals Inbox
        </div>
        <div style={{ textAlign: "center", padding: "48px" }}>
          <div
            style={{
              fontSize: "14px",
              color: "#6B7280",
            }}
          >
            Loading appeals...
          </div>
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
        padding: "16px",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#111827",
          marginBottom: "24px",
        }}
      >
        Appeals Inbox
      </div>

      {appeals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px" }}>
          <div
            style={{
              fontSize: "14px",
              color: "#6B7280",
            }}
          >
            No appeals found
          </div>
        </div>
      ) : (
        <div>
          {appeals.map((appeal) => (
            <div
              key={appeal.id}
              onClick={() => onSelectAppeal(appeal)}
              style={{
                backgroundColor:
                  selectedAppeal?.id === appeal.id ? "#F9FAFB" : "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (selectedAppeal?.id !== appeal.id) {
                  e.currentTarget.style.backgroundColor = "#F9FAFB";
                  e.currentTarget.style.borderColor = "#D1D5DB";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedAppeal?.id !== appeal.id) {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: "4px",
                  }}
                >
                  {appeal.caseId}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <span>{appeal.sellerName}</span>
                  <span>•</span>
                  <span>{appeal.reason}</span>
                  <span>•</span>
                  <span>{formatDate(appeal.dateSubmitted)}</span>
                </div>
              </div>
              <div
                style={{
                  display: "inline-block",
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "4px 8px",
                  borderRadius: "9999px",
                  textTransform: "capitalize",
                  ...getStatusBadgeStyles(appeal.status),
                }}
              >
                {appeal.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
