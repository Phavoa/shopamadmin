"use client";

import React, { useState } from "react";
import { Search, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { 
  useGetWithdrawalsQuery, 
  useReviewWithdrawalMutation, 
  useBulkReviewWithdrawalsMutation 
} from "@/api/withdrawalsApi";
import { formatNaira, koboToNaira } from "@/lib/utils";
import { format } from "date-fns";

// Checkbox Icon
const CheckboxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.3125 0H1.3125C0.964403 0 0.630564 0.138281 0.384422 0.384422C0.138281 0.630564 0 0.964403 0 1.3125V16.3125C0 16.6606 0.138281 16.9944 0.384422 17.2406C0.630564 17.4867 0.964403 17.625 1.3125 17.625H16.3125C16.6606 17.625 16.9944 17.4867 17.2406 17.2406C17.4867 16.9944 17.625 16.6606 17.625 16.3125V1.3125C17.625 0.964403 17.4867 0.630564 17.2406 0.384422C16.9944 0.138281 16.6606 0 16.3125 0ZM16.5 16.3125C16.5 16.3622 16.4802 16.4099 16.4451 16.4451C16.4099 16.4802 16.3622 16.5 16.3125 16.5H1.3125C1.26277 16.5 1.21508 16.4802 1.17992 16.4451C1.14475 16.4099 1.125 16.3622 1.125 16.3125V1.3125C1.125 1.26277 1.14475 1.21508 1.17992 1.17992C1.21508 1.14475 1.26277 1.125 1.3125 1.125H16.3125C16.3622 1.125 16.4099 1.14475 16.4451 1.17992C16.4802 1.21508 16.5 1.26277 16.5 1.3125V16.3125Z" fill="black"/>
  </svg>
);

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PENDING": return "Pending";
    case "APPROVED": return "Approved";
    case "REJECTED": return "Rejected";
    case "HELD": return "Held";
    case "FAILED": return "Failed";
    case "PROCESSING": return "Processing";
    default: return status;
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "PENDING":
    case "HELD":
      return { background: "#FFE9D5", color: "#E67E22" };
    case "APPROVED":
      return { background: "#D7FDD9", color: "#008D3F" };
    case "REJECTED":
    case "FAILED":
      return { background: "#FFE5E5", color: "#DC3545" };
    case "PROCESSING":
      return { background: "#D4E6FF", color: "#2563EB" };
    default:
      return { background: "#F3F4F6", color: "#6B7280" };
  }
};

const PayoutManagementPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [expandedPayout, setExpandedPayout] = useState<string | null>(null);

  // Status mapping for API
  const tabToStatus: Record<string, string | undefined> = {
    "All": undefined,
    "Pending": "PENDING",
    "Approved": "APPROVED",
    "Processing": "PROCESSING",
    "Failed": "FAILED",
    "Held": "HELD",
    "Rejected": "REJECTED"
  };

  const { data: withdrawalsResponse, isLoading, error } = useGetWithdrawalsQuery({
    status: tabToStatus[activeTab],
    q: searchQuery || undefined,
    limit: 50,
  });

  const [reviewWithdrawal, { isLoading: isReviewing }] = useReviewWithdrawalMutation();
  const [bulkReviewWithdrawals, { isLoading: isBulkReviewing }] = useBulkReviewWithdrawalsMutation();

  const withdrawals = withdrawalsResponse?.data?.items || [];

  const tabs = ["All", "Pending", "Approved", "Processing", "Held", "Rejected", "Failed"];

  const handleSelectPayout = (id: string) => {
    setSelectedPayouts((prev: string[]) => 
      prev.includes(id) ? prev.filter((p: string) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPayouts(withdrawals.map(w => w.id));
    } else {
      setSelectedPayouts([]);
    }
  };

  const handleReview = async (id: string, action: "APPROVE" | "REJECT" | "HOLD") => {
    const reason = prompt(`Enter reason for ${action.toLowerCase()} (optional):`);
    try {
      await reviewWithdrawal({ id, body: { action, reason: reason || undefined } }).unwrap();
      alert(`Withdrawal ${action.toLowerCase()}ed successfully`);
    } catch (err: any) {
      alert(`Failed to ${action.toLowerCase()}: ${err?.data?.message || err.message}`);
    }
  };

  const handleBulkAction = async (action: "APPROVE" | "REJECT" | "HOLD") => {
    if (selectedPayouts.length === 0) return;
    const reason = prompt(`Enter reason for bulk ${action.toLowerCase()} (optional):`);
    try {
      await bulkReviewWithdrawals({ ids: selectedPayouts, action, reason: reason || undefined }).unwrap();
      alert(`${selectedPayouts.length} withdrawals ${action.toLowerCase()}ed successfully`);
      setSelectedPayouts([]);
    } catch (err: any) {
      alert(`Bulk ${action.toLowerCase()} failed: ${err?.data?.message || err.message}`);
    }
  };

  const handleExpandPayout = (id: string) => {
    setExpandedPayout((prev: string | null) => prev === id ? null : id);
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            onClick={() => handleBulkAction("APPROVE")}
            disabled={selectedPayouts.length === 0 || isBulkReviewing}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#E67E22",
              color: "#FFF",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: selectedPayouts.length === 0 || isBulkReviewing ? "not-allowed" : "pointer",
              opacity: selectedPayouts.length === 0 || isBulkReviewing ? 0.6 : 1,
            }}
          >
            {isBulkReviewing ? "Reviewing..." : "Approve Selected"}
          </button>
          <button
            onClick={() => handleBulkAction("HOLD")}
            disabled={selectedPayouts.length === 0 || isBulkReviewing}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#F3F4F6",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: selectedPayouts.length === 0 || isBulkReviewing ? "not-allowed" : "pointer",
              opacity: selectedPayouts.length === 0 || isBulkReviewing ? 0.6 : 1,
            }}
          >
            Hold
          </button>
          <button
            onClick={() => handleBulkAction("REJECT")}
            disabled={selectedPayouts.length === 0 || isBulkReviewing}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#FFE5E5",
              color: "#DC3545",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: selectedPayouts.length === 0 || isBulkReviewing ? "not-allowed" : "pointer",
              opacity: selectedPayouts.length === 0 || isBulkReviewing ? 0.6 : 1,
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
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={withdrawals.length > 0 && selectedPayouts.length === withdrawals.length}
                  className="w-4 h-4"
                />
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Payout ID</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">User</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Bank Detail</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Amount</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Requested</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-black">Note/Reason</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#E67E22]" />
                    <p className="text-sm text-gray-500">Loading withdrawals...</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-red-500">
                    <AlertCircle className="w-8 h-8" />
                    <p className="text-sm">Failed to load withdrawals. Please try again.</p>
                  </div>
                </td>
              </tr>
            ) : withdrawals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <p className="text-sm text-gray-500">No withdrawals found for this period.</p>
                </td>
              </tr>
            ) : (
              withdrawals.map((withdrawal) => (
                <React.Fragment key={withdrawal.id}>
                  <tr 
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${expandedPayout === withdrawal.id ? 'bg-gray-50' : ''}`}
                    onClick={() => handleExpandPayout(withdrawal.id)}
                  >
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedPayouts.includes(withdrawal.id)}
                        onChange={() => handleSelectPayout(withdrawal.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="py-4 px-6 text-sm text-black font-mono">
                      {withdrawal.id.slice(0, 8)}...
                    </td>
                    <td className="py-4 px-6 text-sm text-black">
                      <div className="flex flex-col">
                        <span className="font-medium">{withdrawal.user.firstName} {withdrawal.user.lastName}</span>
                        <span className="text-xs text-gray-500">{withdrawal.user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-black">
                      {withdrawal.bankDetail ? (
                        <div className="flex flex-col">
                          <span>{withdrawal.bankDetail.bankName}</span>
                          <span className="text-xs text-gray-500">{withdrawal.bankDetail.accountNumber}</span>
                        </div>
                      ) : "—"}
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-black">
                      {formatNaira(koboToNaira(withdrawal.amountKobo))}
                    </td>
                    <td className="py-4 px-6 text-sm text-black">
                      {format(new Date(withdrawal.createdAt), "MMM d, HH:mm")}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="inline-flex px-3 py-1.5 rounded-xl text-xs font-medium"
                        style={getStatusStyle(withdrawal.status)}
                      >
                        {getStatusLabel(withdrawal.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 truncate max-w-[150px]">
                      {withdrawal.reason || "—"}
                    </td>
                  </tr>

                  {/* Expanded Payout Details */}
                  {expandedPayout === withdrawal.id && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50">
                        <div className="p-6">
                          <div
                            style={{
                              padding: "24px",
                              borderRadius: "16px",
                              border: "0.5px solid rgba(0, 0, 0, 0.10)",
                              background: "#FFF",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-4 flex-1">
                                <div>
                                  <h3 className="text-lg font-bold text-black mb-1">
                                    Withdrawal Full ID: {withdrawal.id}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Submitted on {format(new Date(withdrawal.createdAt), "PPPP 'at' p")}
                                  </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-8">
                                  <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipient Information</h4>
                                    <p className="text-sm text-black font-semibold">{withdrawal.user.firstName} {withdrawal.user.lastName}</p>
                                    <p className="text-sm text-gray-600">{withdrawal.user.email}</p>
                                    {withdrawal.sellerId && (
                                      <p className="text-sm text-orange-600 font-medium mt-1">Seller ID: {withdrawal.sellerId}</p>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bank Details</h4>
                                    {withdrawal.bankDetail ? (
                                      <>
                                        <p className="text-sm text-black font-semibold">{withdrawal.bankDetail.accountName}</p>
                                        <p className="text-sm text-gray-600">{withdrawal.bankDetail.bankName} • {withdrawal.bankDetail.accountNumber}</p>
                                      </>
                                    ) : (
                                      <p className="text-sm text-red-500 italic">No bank details provided</p>
                                    )}
                                  </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                  <div className="space-y-1">
                                    <div className="flex justify-between w-64 text-sm">
                                      <span className="text-gray-600">Requested Amount</span>
                                      <span className="font-medium text-black">{formatNaira(koboToNaira(withdrawal.amountKobo))}</span>
                                    </div>
                                    <div className="flex justify-between w-64 text-sm">
                                      <span className="text-gray-600">Service Fee</span>
                                      <span className="text-gray-400">₦0.00</span>
                                    </div>
                                    <div className="flex justify-between w-64 text-lg font-bold pt-1 border-t border-gray-50">
                                      <span className="text-black">Net Payout</span>
                                      <span className="text-[#E67E22]">{formatNaira(koboToNaira(withdrawal.amountKobo))}</span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    {withdrawal.status === "PENDING" && (
                                      <>
                                        <button
                                          onClick={() => handleReview(withdrawal.id, "APPROVE")}
                                          disabled={isReviewing}
                                          className="px-6 py-2.5 bg-[#008D3F] text-white rounded-lg text-sm font-bold hover:bg-[#007032] transition-colors"
                                        >
                                          Approve Payout
                                        </button>
                                        <button
                                          onClick={() => handleReview(withdrawal.id, "HOLD")}
                                          disabled={isReviewing}
                                          className="px-6 py-2.5 bg-[#E67E22] text-white rounded-lg text-sm font-bold hover:bg-[#cf711d] transition-colors"
                                        >
                                          Put on Hold
                                        </button>
                                        <button
                                          onClick={() => handleReview(withdrawal.id, "REJECT")}
                                          disabled={isReviewing}
                                          className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {withdrawal.reason && (
                              <div className="mt-6 pt-4 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reason for status</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  {withdrawal.reason}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutManagementPage;