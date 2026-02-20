"use client";

import React, { useState } from "react";

const DocumentIcon = () => (
  <svg
    width="17"
    height="20"
    viewBox="0 0 17 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.96 5.415L10.71 0.165C10.6046 0.0594807 10.4616 0.000131289 10.3125 0H1.3125C0.964403 0 0.630564 0.138281 0.384422 0.384422C0.138281 0.630564 0 0.964403 0 1.3125V17.8125C0 18.1606 0.138281 18.4944 0.384422 18.7406C0.630564 18.9867 0.964403 19.125 1.3125 19.125H14.8125C15.1606 19.125 15.4944 18.9867 15.7406 18.7406C15.9867 18.4944 16.125 18.1606 16.125 17.8125V5.8125C16.1249 5.66337 16.0655 5.52039 15.96 5.415ZM10.875 1.92L14.205 5.25H10.875V1.92ZM14.8125 18H1.3125C1.26277 18 1.21508 17.9802 1.17992 17.9451C1.14475 17.9099 1.125 17.8622 1.125 17.8125V1.3125C1.125 1.26277 1.14475 1.21508 1.17992 1.17992C1.21508 1.14475 1.26277 1.125 1.3125 1.125H9.75V5.8125C9.75 5.96168 9.80926 6.10476 9.91475 6.21025C10.0202 6.31574 10.1633 6.375 10.3125 6.375H15V17.8125C15 17.8622 14.9802 17.9099 14.9451 17.9451C14.9099 17.9802 14.8622 18 14.8125 18ZM11.625 10.3125C11.625 10.4617 11.5657 10.6048 11.4602 10.7102C11.3548 10.8157 11.2117 10.875 11.0625 10.875H5.0625C4.91332 10.875 4.77024 10.8157 4.66475 10.7102C4.55926 10.6048 4.5 10.4617 4.5 10.3125C4.5 10.1633 4.55926 10.0202 4.66475 9.91475C4.77024 9.80926 4.91332 9.75 5.0625 9.75H11.0625C11.2117 9.75 11.3548 9.80926 11.4602 9.91475C11.5657 10.0202 11.625 10.1633 11.625 10.3125ZM11.625 13.3125C11.625 13.4617 11.5657 13.6048 11.4602 13.7102C11.3548 13.8157 11.2117 13.875 11.0625 13.875H5.0625C4.91332 13.875 4.77024 13.8157 4.66475 13.7102C4.55926 13.6048 4.5 13.4617 4.5 13.3125C4.5 13.1633 4.55926 13.0202 4.66475 12.9148C4.77024 12.8093 4.91332 12.75 5.0625 12.75H11.0625C11.2117 12.75 11.3548 12.8093 11.4602 12.9148C11.5657 13.0202 11.625 13.1633 11.625 13.3125Z"
      fill="black"
    />
  </svg>
);

interface Appeal {
  uniqueId: string;
  id: string;
  buyer: string;
  action: string;
  reason: string;
  days: string;
  status: string;
}

const mockAppealsData: Appeal[] = [
  {
    uniqueId: "appeal-1",
    id: "AP-31001",
    buyer: "Ahmed M.",
    action: "Strike",
    reason: "Chargebacks",
    days: "2d",
    status: "Review",
  },
  {
    uniqueId: "appeal-2",
    id: "AP-31002",
    buyer: "Doha O.",
    action: "Suspended",
    reason: "Chargebacks",
    days: "2d",
    status: "Review",
  },
  {
    uniqueId: "appeal-3",
    id: "AP-31003",
    buyer: "Doha O.",
    action: "Strike",
    reason: "Chargebacks",
    days: "2d",
    status: "Review",
  },
  {
    uniqueId: "appeal-4",
    id: "AP-31004",
    buyer: "Doha O.",
    action: "Strike",
    reason: "Chargebacks",
    days: "2d",
    status: "Review",
  },
  {
    uniqueId: "appeal-5",
    id: "AP-31005",
    buyer: "Doha O.",
    action: "Payment Block",
    reason: "Chargebacks",
    days: "2d",
    status: "Review",
  },
];

const BuyerAppealsPage = () => {
  const [selectedAppealId, setSelectedAppealId] = useState<string | null>(
    mockAppealsData[0].uniqueId
  );
  const [adminNotes, setAdminNotes] = useState("");
  const [decisionNote, setDecisionNote] = useState("");

  const selectedAppeal =
    mockAppealsData.find((a) => a.uniqueId === selectedAppealId) ||
    mockAppealsData[0];

  const handleSelectAppeal = (uniqueId: string) => {
    if (selectedAppealId === uniqueId) {
      setSelectedAppealId(null);
    } else {
      setSelectedAppealId(uniqueId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Buyer Appeals and Investigations
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Appeals Inbox */}
        <div
          className="bg-white rounded-xl border border-gray-200 p-6"
          style={{ borderRadius: "18px" }}
        >
          <h2 className="text-lg font-semibold mb-4">Appeals Inbox</h2>

          <div className="space-y-3">
            {mockAppealsData.map((appeal) => (
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
                    <p className="font-semibold text-sm">{appeal.id}</p>
                    <p className="text-xs text-gray-500">
                      {appeal.buyer} • {appeal.action} • {appeal.days}
                    </p>
                  </div>
                  <button
                    className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      background: "#FFFFFF",
                      color: "#141312",
                      border: "1px solid #141312",
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
        {selectedAppealId && (
          <div
            className="bg-white rounded-xl border border-gray-200 p-6"
            style={{ borderRadius: "18px" }}
          >
            <h2 className="text-lg font-semibold mb-4">
              Case Detail: {selectedAppeal.id}
            </h2>

            <div className="space-y-4">
              {/* Case Summary */}
              <div className="text-sm">
                <p>
                  <strong>Buyer:</strong> {selectedAppeal.buyer} |{" "}
                  <strong>Action Appealed:</strong> {selectedAppeal.action} |{" "}
                  <strong>Issued:</strong> {selectedAppeal.days} ago
                </p>
                <p className="mt-2">
                  <strong>Reasons:</strong> {selectedAppeal.reason}
                </p>
                <p className="mt-2">
                  <strong>Status:</strong> {selectedAppeal.status} |{" "}
                  <strong>SLA:</strong> 24h to respond
                </p>
              </div>

              {/* Buyer Statement */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Buyer Statement</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                  <p>
                    I was wrongly flagged for chargebacks. My bank confirmed the
                    duplicate charges, reversing suspension can be lifted
                  </p>
                  <ul className="mt-2 ml-4 list-disc space-y-1">
                    <li>Cross-check receipts with payment gateway</li>
                    <li>Contact GTBank support for case ID BNK2391</li>
                    <li>Decide if suspension can be lifted</li>
                  </ul>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Attachment</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <DocumentIcon />
                    </div>
                    <p className="text-xs text-gray-600">Bank receipt</p>
                    <button className="text-xs text-[#E67E22] mt-1">
                      View
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <DocumentIcon />
                    </div>
                    <p className="text-xs text-gray-600">Payment gateway log</p>
                    <button className="text-xs text-[#E67E22] mt-1">
                      View
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <DocumentIcon />
                    </div>
                    <p className="text-xs text-gray-600">
                      Buyer email screenshot
                    </p>
                    <button className="text-xs text-[#E67E22] mt-1">
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block font-semibold text-sm mb-2">
                  Add Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add a decision note, e.g., verified incident via support logs"
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none"
                />
              </div>

              {/* Decision */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Decision</h3>
                <p className="text-xs text-gray-500 mb-3">Choose Outcome</p>
                <div className="flex gap-2 mb-4">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ background: "#E67E22" }}
                  >
                    Approve Appeal
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ background: "#E67E22" }}
                  >
                    Deny Appeal
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: "#FFF3E0",
                      color: "#E67E22",
                      border: "1px solid #E67E22",
                    }}
                  >
                    Uphold Decision
                  </button>
                </div>

                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Add a decision note, e.g., verified incident via support logs"
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none mb-3"
                />

                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ background: "#E67E22" }}
                  >
                    Submit Decision
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: "#F5F5F5",
                      color: "#374151",
                      border: "1px solid #D1D5DB",
                    }}
                  >
                    Save as Draft
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      background: "#FFF3E0",
                      color: "#E67E22",
                      border: "1px solid #E67E22",
                    }}
                  >
                    Request more evidence
                  </button>
                </div>
              </div>

              {/* Audit Trail */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Audit Trail</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 space-y-1">
                  <p>09:30 Appeal opened by buyer</p>
                  <p>09:40 Assigned to AdminT</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedAppealId && (
          <div
            className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center"
            style={{ borderRadius: "18px", minHeight: "400px" }}
          >
            <p className="text-gray-500">Select an appeal to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerAppealsPage;
