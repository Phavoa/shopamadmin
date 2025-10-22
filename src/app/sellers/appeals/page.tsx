"use client";

import React, { useState, useEffect } from "react";
import { AppealsInbox } from "@/components/sellers/AppealsInbox";
import { AppealDetail } from "@/components/sellers/AppealDetail";

// Define the AppealRecord type
export interface AppealRecord {
  id: string;
  caseId: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  reason: string;
  status: "Open" | "Under Review" | "Resolved" | "Rejected";
  dateSubmitted: string;
  lastUpdated: string;
  description: string;
  attachments?: string[];
  notes?: string[];
  auditTrail?: string[];
}

// Mock data for appeals - in a real app, this would come from an API
const mockAppealData: AppealRecord[] = [
  {
    id: "1",
    caseId: "APPEAL-2024-001",
    sellerId: "seller-1",
    sellerName: "John Doe",
    sellerEmail: "john@example.com",
    reason: "Dispute late delivery strike",
    status: "Open",
    dateSubmitted: "2024-01-15T10:00:00Z",
    lastUpdated: "2024-01-16T14:30:00Z",
    description:
      "Seller disputes the late delivery strike claiming unforeseen circumstances.",
    attachments: ["proof_of_delivery.pdf", "customer_complaint.jpg"],
    notes: ["Initial review completed", "Awaiting seller response"],
    auditTrail: [
      "2024-01-15: Appeal submitted",
      "2024-01-16: Case assigned to reviewer",
    ],
  },
  {
    id: "2",
    caseId: "APPEAL-2024-002",
    sellerId: "seller-2",
    sellerName: "Jane Smith",
    sellerEmail: "jane@example.com",
    reason: "Product quality issue appeal",
    status: "Under Review",
    dateSubmitted: "2024-01-10T14:30:00Z",
    lastUpdated: "2024-01-18T09:15:00Z",
    description:
      "Seller appeals against product quality strike with evidence of compliance.",
    attachments: ["quality_certificate.pdf", "product_photos.zip"],
    notes: ["Evidence reviewed", "Pending final decision"],
    auditTrail: [
      "2024-01-10: Appeal submitted",
      "2024-01-12: Evidence requested",
      "2024-01-18: Evidence received",
    ],
  },
  {
    id: "3",
    caseId: "APPEAL-2024-003",
    sellerId: "seller-3",
    sellerName: "Bob Johnson",
    sellerEmail: "bob@example.com",
    reason: "Policy violation appeal",
    status: "Resolved",
    dateSubmitted: "2024-01-05T16:45:00Z",
    lastUpdated: "2024-01-20T11:00:00Z",
    description: "Appeal against suspension for policy violation.",
    attachments: ["policy_guidelines.pdf"],
    notes: ["Appeal denied", "Seller notified"],
    auditTrail: [
      "2024-01-05: Appeal submitted",
      "2024-01-15: Decision made",
      "2024-01-20: Case closed",
    ],
  },
  {
    id: "4",
    caseId: "APPEAL-2024-004",
    sellerId: "seller-4",
    sellerName: "Alice Brown",
    sellerEmail: "alice@example.com",
    reason: "Fake product appeal",
    status: "Rejected",
    dateSubmitted: "2024-01-20T09:15:00Z",
    lastUpdated: "2024-01-25T16:20:00Z",
    description: "Seller appeals counterfeit product accusation.",
    attachments: ["authenticity_proof.pdf", "supplier_invoice.pdf"],
    notes: ["Evidence insufficient", "Appeal rejected"],
    auditTrail: [
      "2024-01-20: Appeal submitted",
      "2024-01-22: Additional evidence requested",
      "2024-01-25: Appeal rejected",
    ],
  },
];

const Page = () => {
  const [appeals, setAppeals] = useState<AppealRecord[]>([]);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealRecord | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Fetch appeals
  const fetchAppeals = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAppeals(mockAppealData);
    } catch (error) {
      console.error("Failed to fetch appeals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAppeals();
  }, []);

  const handleSelectAppeal = (appeal: AppealRecord) => {
    setSelectedAppeal(appeal);
  };

  return (
    <div
      className="min-h-screen py-6"
      style={{
        backgroundColor: "#F9FAFB",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        className="max-w-[1400px] mx-auto px-6"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "24px",
          padding: "24px",
        }}
      >
        <div style={{ minWidth: "400px" }}>
          <AppealsInbox
            appeals={appeals}
            loading={loading}
            selectedAppeal={selectedAppeal}
            onSelectAppeal={handleSelectAppeal}
          />
        </div>
        <div style={{ minWidth: "600px" }}>
          <AppealDetail appeal={selectedAppeal} />
        </div>
      </div>
    </div>
  );
};

export default Page;
