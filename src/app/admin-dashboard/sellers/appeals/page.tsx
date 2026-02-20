"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";

interface Appeal {
  uniqueId: string;
  caseId: string;
  sellerName: string;
  action: string;
  days: string;
  status: string;
  issueDate: string;
  sla: string;
  sellerStatement: string;
  adminNotes: string[];
  attachments: Array<{ name: string }>;
  auditTrail: string[];
}

const mockAppeals: Appeal[] = [
  {
    uniqueId: "appeal-1",
    caseId: "AP-2001",
    sellerName: "Gadget Palace",
    action: "Strike",
    days: "2d",
    status: "Review",
    issueDate: "Aug 25",
    sla: "24h to respond",
    sellerStatement: "Our rider had an accident on the way, so notified support and could not at 6 notes.",
    adminNotes: [
      "Check rider logs on Aug 25",
      "Verify ticket 5500-5023",
      "Consider goodwill warning only"
    ],
    attachments: [
      { name: "Seller Photo Proof" },
      { name: "Support ticket screenshot" },
      { name: "Rider log extract" }
    ],
    auditTrail: [
      "09:10 Appeal opened by seller",
      "09:20 Assigned to AdminJ"
    ]
  },
  {
    uniqueId: "appeal-2",
    caseId: "AP-2002",
    sellerName: "Quick Phones",
    action: "Suspended",
    days: "2d",
    status: "Review",
    issueDate: "Aug 24",
    sla: "24h to respond",
    sellerStatement: "Account was suspended incorrectly. All deliveries were on time.",
    adminNotes: [
      "Review delivery logs",
      "Check customer complaints"
    ],
    attachments: [
      { name: "Delivery receipts" },
      { name: "Customer feedback" }
    ],
    auditTrail: [
      "08:30 Appeal opened by seller",
      "09:00 Under review"
    ]
  },
  {
    uniqueId: "appeal-3",
    caseId: "AP-2003",
    sellerName: "Gadget Palace",
    action: "Strike",
    days: "2d",
    status: "Review",
    issueDate: "Aug 23",
    sla: "24h to respond",
    sellerStatement: "Product quality issue was a misunderstanding.",
    adminNotes: [
      "Verify product specifications"
    ],
    attachments: [
      { name: "Product photos" }
    ],
    auditTrail: [
      "10:15 Appeal submitted"
    ]
  },
  {
    uniqueId: "appeal-4",
    caseId: "AP-2004",
    sellerName: "Gadget Palace",
    action: "Strike",
    days: "2d",
    status: "Review",
    issueDate: "Aug 22",
    sla: "24h to respond",
    sellerStatement: "Late delivery was due to logistics partner delay.",
    adminNotes: [
      "Check logistics partner reports"
    ],
    attachments: [
      { name: "Logistics report" }
    ],
    auditTrail: [
      "11:00 Appeal opened"
    ]
  },
  {
    uniqueId: "appeal-5",
    caseId: "AP-2005",
    sellerName: "Gadget Palace",
    action: "Suspended",
    days: "2d",
    status: "Review",
    issueDate: "Aug 21",
    sla: "24h to respond",
    sellerStatement: "Suspension should be reviewed as policies were followed.",
    adminNotes: [
      "Review policy compliance"
    ],
    attachments: [
      { name: "Policy documents" }
    ],
    auditTrail: [
      "12:30 Appeal filed"
    ]
  },
];

const SellerAppealsPage = () => {
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState("");

  const selectedAppeal = mockAppeals.find(a => a.uniqueId === selectedAppealId);

  const handleSelectAppeal = (uniqueId: string) => {
    if (selectedAppealId === uniqueId) {
      setSelectedAppealId(null);
    } else {
      setSelectedAppealId(uniqueId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <h1 className="text-2xl font-semibold mb-6">Seller Appeals and Investigations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Appeals Inbox */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ borderRadius: "18px" }}>
          <h2 className="text-lg font-semibold mb-4">Appeals Inbox</h2>
          
          <div className="space-y-3">
            {mockAppeals.map((appeal) => (
              <div
                key={appeal.uniqueId}
                onClick={() => handleSelectAppeal(appeal.uniqueId)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedAppealId === appeal.uniqueId
                    ? "border-[#E67E22] bg-[#FFF3E0]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{appeal.caseId}</p>
                    <p className="text-xs text-gray-500">{appeal.sellerName} • {appeal.action} • {appeal.days}</p>
                  </div>
              <button 
  className="px-3 py-1 rounded-lg text-xs font-medium" 
  style={{ 
    background: "#FFFFFF", 
    color: "#141312", 
    border: "1px solid #141312" 
  }}
>
  {appeal.status}
</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Case Detail */}
        {selectedAppeal ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ borderRadius: "18px" }}>
            <h2 className="text-lg font-semibold mb-4">Case Detail: {selectedAppeal.caseId}</h2>

            <div className="space-y-4">
              {/* Case Summary */}
              <div className="text-sm">
                <p>
                  <strong>Seller:</strong> {selectedAppeal.sellerName} | <strong>Action Appealed:</strong> {selectedAppeal.action} | <strong>Issued on:</strong> {selectedAppeal.issueDate}
                </p>
                <p className="mt-2">
                  <strong>Status:</strong> Awaiting review | <strong>SLA:</strong> {selectedAppeal.sla}
                </p>
              </div>

              {/* Seller Statement */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Seller Statement</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                  <p>{selectedAppeal.sellerStatement}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Admin Notes</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                  {selectedAppeal.adminNotes.map((note, index) => (
                    <p key={index}>- {note}</p>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Attachment</h3>
                <div className="grid grid-cols-3 gap-3">
                  {selectedAppeal.attachments.map((attachment, index) => (
                    <div key={index} className="text-center">
                      <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-600">{attachment.name}</p>
                      <button className="text-xs text-[#E67E22] mt-1">View</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Decision</h3>
                <p className="text-xs text-gray-500 mb-3">Choose Outcome</p>
                <div className="flex gap-2 mb-4">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#E67E22" }}>
                    Remove Strike
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#E67E22" }}>
                    Remove Strike
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#FFF3E0", color: "#E67E22", border: "1px solid #E67E22" }}>
                    Uphold Strike
                  </button>
                </div>

                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Add a decision note, e.g., verified accident via support logs"
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none mb-3"
                />

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "#E67E22" }}>
                    Submit Decision
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#F5F5F5", color: "#374151", border: "1px solid #D1D5DB" }}>
                    Save as Draft
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#FFF3E0", color: "#E67E22", border: "1px solid #E67E22" }}>
                    Request more evidence
                  </button>
                </div>
              </div>

              {/* Audit Trail */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Audit Trail</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 space-y-1">
                  {selectedAppeal.auditTrail.map((entry, index) => (
                    <p key={index}>{entry}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center" style={{ borderRadius: "18px", minHeight: "400px" }}>
            <p className="text-gray-500">Select an appeal to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAppealsPage;