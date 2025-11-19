"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

// Checkbox Icon
const CheckboxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.3125 0H1.3125C0.964403 0 0.630564 0.138281 0.384422 0.384422C0.138281 0.630564 0 0.964403 0 1.3125V16.3125C0 16.6606 0.138281 16.9944 0.384422 17.2406C0.630564 17.4867 0.964403 17.625 1.3125 17.625H16.3125C16.6606 17.625 16.9944 17.4867 17.2406 17.2406C17.4867 16.9944 17.625 16.6606 17.625 16.3125V1.3125C17.625 0.964403 17.4867 0.630564 17.2406 0.384422C16.9944 0.138281 16.6606 0 16.3125 0ZM16.5 16.3125C16.5 16.3622 16.4802 16.4099 16.4451 16.4451C16.4099 16.4802 16.3622 16.5 16.3125 16.5H1.3125C1.26277 16.5 1.21508 16.4802 1.17992 16.4451C1.14475 16.4099 1.125 16.3622 1.125 16.3125V1.3125C1.125 1.26277 1.14475 1.21508 1.17992 1.17992C1.21508 1.14475 1.26277 1.125 1.3125 1.125H16.3125C16.3622 1.125 16.4099 1.14475 16.4451 1.17992C16.4802 1.21508 16.5 1.26277 16.5 1.3125V16.3125Z" fill="black"/>
  </svg>
);

interface Payout {
  id: string;
  user: string;
  sellerId: string;
  bank: string;
  amount: string;
  requested: string;
  status: "Pending" | "Approved" | "Failed" | "Processing";
  note: string;
  beneficiary?: string;
  fees?: string;
  net?: string;
  auditTrail?: string[];
}

const PayoutManagementPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [expandedPayout, setExpandedPayout] = useState<string | null>(null);

  // Mock data
  const payouts: Payout[] = [
    {
      id: "PAY-55102",
      user: "Next Gadgets",
      sellerId: "(S-21885)",
      bank: "GTBank 0123456789",
      amount: "₦540K",
      requested: "Aug 2, 10:05",
      status: "Pending",
      note: "KYC mismatch",
      beneficiary: "Next Gadgets NG",
      fees: "₦400",
      net: "₦540,400",
      auditTrail: [
        "09:40 Request created by seller",
        "10:02 Auto-checks passed (KYC-AML)",
        "10:10 Awaiting approval"
      ]
    },
    {
      id: "PAY-55102",
      user: "Mary K Stores",
      sellerId: "(S-21887)",
      bank: "GTBank 0123456789",
      amount: "₦540K",
      requested: "Aug 2, 10:05",
      status: "Approved",
      note: "KYC mismatch",
      beneficiary: "Mary K Stores NG",
      fees: "₦400",
      net: "₦540,400",
      auditTrail: [
        "09:40 Request created by seller",
        "10:02 Auto-checks passed (KYC-AML)",
        "10:10 Approved by admin"
      ]
    },
    {
      id: "PAY-55102",
      user: "Mark James",
      sellerId: "",
      bank: "GTBank 0123456789",
      amount: "₦540K",
      requested: "Aug 2, 10:05",
      status: "Failed",
      note: "KYC mismatch",
      beneficiary: "Mark James",
      fees: "₦400",
      net: "₦540,400",
      auditTrail: [
        "09:40 Request created by seller",
        "10:02 Auto-checks failed",
        "10:10 Payment failed"
      ]
    },
    {
      id: "PAY-55102",
      user: "Next Gadgets",
      sellerId: "(S-21885)",
      bank: "GTBank 0123456789",
      amount: "₦540K",
      requested: "Aug 2, 10:05",
      status: "Processing",
      note: "KYC mismatch",
      beneficiary: "Next Gadgets NG",
      fees: "₦400",
      net: "₦540,400",
      auditTrail: [
        "09:40 Request created by seller",
        "10:02 Auto-checks passed (KYC-AML)",
        "10:10 Processing payment"
      ]
    },
  ];

  const tabs = ["All", "Pending", "Approved", "Processing", "Failed"];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return { background: "#FFE9D5", color: "#E67E22" };
      case "Approved":
        return { background: "#D7FDD9", color: "#008D3F" };
      case "Failed":
        return { background: "#FFE5E5", color: "#DC3545" };
      case "Processing":
        return { background: "#D4E6FF", color: "#2563EB" };
      default:
        return { background: "#F3F4F6", color: "#6B7280" };
    }
  };

  const handleSelectPayout = (id: string) => {
    if (selectedPayouts.includes(id)) {
      setSelectedPayouts(selectedPayouts.filter(p => p !== id));
    } else {
      setSelectedPayouts([...selectedPayouts, id]);
    }
  };

  const handleExpandPayout = (id: string) => {
    if (expandedPayout === id) {
      setExpandedPayout(null);
    } else {
      setExpandedPayout(id);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Payout Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search Users or Payout ID"
            className="w-[320px] h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-8 px-6 py-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-2 transition-colors ${
              activeTab === tab
                ? "text-[#E67E22] border-b-2 border-[#E67E22]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex gap-3">
          <button
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#E67E22",
              color: "#FFF",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Approve
          </button>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#F3F4F6",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Hold
          </button>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#FFE5E5",
              color: "#DC3545",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Export: CSV
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            XLSX
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6">
                <CheckboxIcon />
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Payout ID</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Users</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Bank</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Amount</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Requested</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Note</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout, index) => (
              <React.Fragment key={index}>
                <tr 
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleExpandPayout(payout.id + index)}
                >
                  <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout.id + index)}
                      onChange={() => handleSelectPayout(payout.id + index)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-black">{payout.id}</td>
                  <td className="py-4 px-6 text-sm text-black">
                    {payout.user} {payout.sellerId && <span className="text-gray-500">{payout.sellerId}</span>}
                  </td>
                  <td className="py-4 px-6 text-sm text-black">{payout.bank}</td>
                  <td className="py-4 px-6 text-sm font-medium text-black">{payout.amount}</td>
                  <td className="py-4 px-6 text-sm text-black">{payout.requested}</td>
                  <td className="py-4 px-6">
                    <span
                      className="inline-flex px-3 py-1.5 rounded-xl text-xs font-normal"
                      style={getStatusStyle(payout.status)}
                    >
                      {payout.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-black">{payout.note}</td>
                </tr>

                {/* Expanded Payout Details */}
                {expandedPayout === payout.id + index && (
                  <tr>
                    <td colSpan={8} className="bg-gray-50">
                      <div className="p-6">
                        <div
                          style={{
                            padding: "20px",
                            borderRadius: "12px",
                            border: "0.3px solid rgba(0, 0, 0, 0.20)",
                            background: "#FFF",
                          }}
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <h3 className="text-lg font-semibold text-black mb-2">
                                Payout Details: {payout.id}
                              </h3>
                              <p className="text-sm text-gray-700 mb-1">
                                Seller: {payout.user} {payout.sellerId}
                              </p>
                              <p className="text-sm text-gray-700 mb-1">
                                Bank: {payout.bank} | Beneficiary: {payout.beneficiary}
                              </p>
                              <div className="mt-4 space-y-1">
                                <p className="text-sm text-gray-700">
                                  Amount: <span className="float-right font-medium">{payout.amount}</span>
                                </p>
                                <p className="text-sm text-gray-700">
                                  Fees: <span className="float-right">{payout.fees}</span>
                                </p>
                                <p className="text-sm text-gray-700 font-semibold">
                                  Net: <span className="float-right">{payout.net}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                style={{
                                  padding: "8px 20px",
                                  borderRadius: "8px",
                                  background: "#E67E22",
                                  color: "#FFF",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                Approve
                              </button>
                              <button
                                style={{
                                  padding: "8px 20px",
                                  borderRadius: "8px",
                                  background: "#F3F4F6",
                                  color: "#374151",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                Hold
                              </button>
                              <button
                                style={{
                                  padding: "8px 20px",
                                  borderRadius: "8px",
                                  background: "#FFE5E5",
                                  color: "#DC3545",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          </div>

                          {/* Audit Trail */}
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-base font-semibold text-black mb-3">Audit Trail</h4>
                            <div className="space-y-2">
                              {payout.auditTrail?.map((trail, idx) => (
                                <p key={idx} className="text-sm text-gray-700">
                                  {trail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutManagementPage;