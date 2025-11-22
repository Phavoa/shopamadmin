"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PaymentsWalletSettingsPage() {
  const router = useRouter();

  // Payment Gateways state
  const [transactionFee, setTransactionFee] = useState("30");

  // Escrow Management state
  const [autoReleaseHours, setAutoReleaseHours] = useState("8");
  const [disputeHoldDays, setDisputeHoldDays] = useState("14");
  const [manualReleaseRequired, setManualReleaseRequired] = useState(true);

  // Wallet Settings state
  const [minWithdrawal, setMinWithdrawal] = useState("1000");
  const [withdrawalFee, setWithdrawalFee] = useState("50");
  const [dailyWithdrawalLimit, setDailyWithdrawalLimit] = useState("365");
  const [instantWithdrawals, setInstantWithdrawals] = useState(true);

  // API & Webhooks state
  const [webhookUrl, setWebhookUrl] = useState("https://www.shopam.ng/webhooks/payments");
  const [webhookVerification, setWebhookVerification] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">
          Payments & Wallet Settings
        </h1>
      </div>

      {/* Back Button and Save Button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => router.push("/admin-dashboard/settings")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>

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
          Save Changes
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Payment Gateways */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              Payment Gateways
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Configure payment processors
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Paystack
                  </h3>
                  <p className="text-xs text-gray-600">
                    Primary payment gateway
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{ background: "#D7FDD9", color: "#008D3F" }}
                  >
                    Active
                  </span>
                  <button className="px-4 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">
                    Configure
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Flutterwave
                  </h3>
                  <p className="text-xs text-gray-600">
                    Secondary payment gateway
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{ background: "#D7FDD9", color: "#008D3F" }}
                  >
                    Active
                  </span>
                  <button className="px-4 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">
                    Configure
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Transaction Fee (%)
                </label>
                <input
                  type="text"
                  value={transactionFee}
                  onChange={(e) => setTransactionFee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Escrow Management */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              Escrow Management
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Funds holding and release rules
            </p>

            <div className="space-y-4">
              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Auto-release after delivery (hours)
                </label>
                <input
                  type="text"
                  value={autoReleaseHours}
                  onChange={(e) => setAutoReleaseHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Dispute hold period (days)
                </label>
                <input
                  type="text"
                  value={disputeHoldDays}
                  onChange={(e) => setDisputeHoldDays(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-start justify-between pt-2">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Manual Release Required
                  </h3>
                  <p className="text-xs text-gray-600">
                    For orders above NGN 500,000
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={manualReleaseRequired}
                  onChange={(e) => setManualReleaseRequired(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Wallet Settings */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              Wallet Settings
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              User wallet and withdrawal settings
            </p>

            <div className="space-y-4">
              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Minimum Withdrawal (NGN)
                </label>
                <input
                  type="text"
                  value={minWithdrawal}
                  onChange={(e) => setMinWithdrawal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Withdrawal Fee (NGN)
                </label>
                <input
                  type="text"
                  value={withdrawalFee}
                  onChange={(e) => setWithdrawalFee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Daily Withdrawal Limit (NGN)
                </label>
                <input
                  type="text"
                  value={dailyWithdrawalLimit}
                  onChange={(e) => setDailyWithdrawalLimit(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-start justify-between pt-2">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Instant Withdrawals
                  </h3>
                  <p className="text-xs text-gray-600">
                    Process withdrawals immediately
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={instantWithdrawals}
                  onChange={(e) => setInstantWithdrawals(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>
            </div>
          </div>

          {/* API & Webhooks */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              API & Webhooks
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              External integrations and callbacks
            </p>

            <div className="space-y-4">
              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Webhook URL
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-start justify-between pt-2">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Webhook Verification
                  </h3>
                  <p className="text-xs text-gray-600">
                    Verify webhook signatures
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={webhookVerification}
                  onChange={(e) => setWebhookVerification(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}