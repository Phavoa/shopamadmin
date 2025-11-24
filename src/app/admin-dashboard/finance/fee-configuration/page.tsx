"use client";

import React, { useState } from "react";

export default function FeeConfigurationPage() {
  const [effectiveDate, setEffectiveDate] = useState("12/09/2025");
  const [gracePeriod, setGracePeriod] = useState("7");
  const [whoCanPublish, setWhoCanPublish] = useState("Finance Admins Only");

  // Shopping Commission Tiers
  const [tier1Min, setTier1Min] = useState("100");
  const [tier1Max, setTier1Max] = useState("499,999");
  const [tier1Commission, setTier1Commission] = useState("6");
  
  const [tier2Min, setTier2Min] = useState("500,000");
  const [tier2Max, setTier2Max] = useState("999,999");
  const [tier2Commission, setTier2Commission] = useState("5");
  
  const [tier3Min, setTier3Min] = useState("1,000,000");
  const [tier3Commission, setTier3Commission] = useState("3");

  // Wallet and Subscription
  const [walletFee, setWalletFee] = useState("0");
  const [withdrawalFee, setWithdrawalFee] = useState("50");
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState("0");
  const [promoCodesEnabled, setPromoCodesEnabled] = useState(true);

  // Logistics Fees
  const logistics = [
    { name: "Lagos", fee: "0" },
    { name: "Abuja", fee: "0" },
    { name: "South West to South East", fee: "50" },
    { name: "South West", fee: "50" },
    { name: "South East", fee: "50" },
    { name: "South West to Abuja", fee: "50" },
    { name: "Abuja to South East", fee: "50" },
    { name: "Lagos to Abuja", fee: "50" },
    { name: "Lagos Mainland to Island", fee: "50" },
  ];

  // Simulation data
  const [expectedPerMonth, setExpectedPerMonth] = useState("69,000,000");
  const [split, setSplit] = useState("50/30/15");
  const [platformRevenue, setPlatformRevenue] = useState("2,240,000");
  const [shoppingGMV, setShoppingGMV] = useState("40%");
  const [payoutFees, setPayoutFees] = useState("40,000");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">Fee Configuration</h1>
        <div className="flex gap-3">
          <button
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFF",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Draft v1
          </button>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFF",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Save Draft
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
            Publish
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-black mb-6">
          Fee Configuration Settings
        </h2>

        <div className="space-y-6">
          {/* Shopping Commission Card */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-base font-semibold text-black mb-6">
              Shopping Commission (All Goods)
            </h2>

            <div className="grid grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div>
                <h3 className="text-sm font-medium text-black mb-4">
                  Tier 1 - ₦100 to ₦499,999
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Min amount (₦):
                    </label>
                    <input
                      type="text"
                      value={tier1Min}
                      onChange={(e) => setTier1Min(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Max amount (₦):
                    </label>
                    <input
                      type="text"
                      value={tier1Max}
                      onChange={(e) => setTier1Max(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Commission %:
                    </label>
                    <input
                      type="text"
                      value={tier1Commission}
                      onChange={(e) => setTier1Commission(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tier 2 */}
              <div>
                <h3 className="text-sm font-medium text-black mb-4">
                  Tier 2 - ₦500,000 to ₦999,999
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Min amount (₦):
                    </label>
                    <input
                      type="text"
                      value={tier2Min}
                      onChange={(e) => setTier2Min(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Max amount (₦):
                    </label>
                    <input
                      type="text"
                      value={tier2Max}
                      onChange={(e) => setTier2Max(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Commission %:
                    </label>
                    <input
                      type="text"
                      value={tier2Commission}
                      onChange={(e) => setTier2Commission(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tier 3 */}
              <div>
                <h3 className="text-sm font-medium text-black mb-4">
                  Tier 3 - ₦1,000,000 and above
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Min amount (₦):
                    </label>
                    <input
                      type="text"
                      value={tier3Min}
                      onChange={(e) => setTier3Min(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Commission %:
                    </label>
                    <input
                      type="text"
                      value={tier3Commission}
                      onChange={(e) => setTier3Commission(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: 2 columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Wallet and Subscription */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "18px",
                  border: "0.3px solid rgba(0, 0, 0, 0.20)",
                  background: "#FFF",
                }}
              >
                <h2 className="text-base font-semibold text-black mb-6">
                  Wallet and Subscription
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Wallet fee (fixed):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">₦</span>
                      <input
                        type="text"
                        value={walletFee}
                        onChange={(e) => setWalletFee(e.target.value)}
                        style={{
                          width: "60px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "0.3px solid rgba(0, 0, 0, 0.20)",
                          fontSize: "14px",
                          textAlign: "right",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Withdrawal fee (fixed):</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">₦</span>
                      <input
                        type="text"
                        value={withdrawalFee}
                        onChange={(e) => setWithdrawalFee(e.target.value)}
                        style={{
                          width: "60px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "0.3px solid rgba(0, 0, 0, 0.20)",
                          fontSize: "14px",
                          textAlign: "right",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Subscription (monthly):</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={!subscriptionEnabled}
                          onChange={() => setSubscriptionEnabled(false)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Off</span>
                      </label>
                      <span className="text-sm">Price</span>
                      <input
                        type="text"
                        value={subscriptionPrice}
                        onChange={(e) => setSubscriptionPrice(e.target.value)}
                        disabled={!subscriptionEnabled}
                        style={{
                          width: "60px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "0.3px solid rgba(0, 0, 0, 0.20)",
                          fontSize: "14px",
                          textAlign: "right",
                          outline: "none",
                          opacity: subscriptionEnabled ? 1 : 0.5,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">Promo codes enabled:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Yes</span>
                      <input
                        type="checkbox"
                        checked={promoCodesEnabled}
                        onChange={() => setPromoCodesEnabled(!promoCodesEnabled)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics Fees */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "18px",
                  border: "0.3px solid rgba(0, 0, 0, 0.20)",
                  background: "#FFF",
                }}
              >
                <h2 className="text-base font-semibold text-black mb-6">
                  Logistics Fees
                </h2>

                <div className="space-y-3">
                  {logistics.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-black">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">₦</span>
                        <input
                          type="text"
                          defaultValue={item.fee}
                          style={{
                            width: "60px",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "0.3px solid rgba(0, 0, 0, 0.20)",
                            fontSize: "14px",
                            textAlign: "right",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Effective Date and Versioning */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "18px",
                  border: "0.3px solid rgba(0, 0, 0, 0.20)",
                  background: "#FFF",
                }}
              >
                <h2 className="text-base font-semibold text-black mb-6">
                  Effective Date and Versioning
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-black block mb-2">
                      Effective from:
                    </label>
                    <input
                      type="text"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-black block mb-2">
                      Grace period (days):
                    </label>
                    <input
                      type="text"
                      value={gracePeriod}
                      onChange={(e) => setGracePeriod(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-black block mb-2">
                      Who can publish:
                    </label>
                    <select
                      value={whoCanPublish}
                      onChange={(e) => setWhoCanPublish(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "0.3px solid rgba(0, 0, 0, 0.20)",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option>Finance Admins Only</option>
                      <option>All Admins</option>
                      <option>Super Admins</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Simulation (What-if) */}
              <div
                style={{
                  padding: "20px",
                  borderRadius: "18px",
                  border: "0.3px solid rgba(0, 0, 0, 0.20)",
                  background: "#FFF",
                }}
              >
                <h2 className="text-base font-semibold text-black mb-6">
                  Simulation (What-if)
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Input: Expected per month:</span>
                    <span className="text-sm font-semibold text-black">
                      ₦{expectedPerMonth}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Split (S/M/%):</span>
                    <span className="text-sm font-semibold text-black">{split}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Projected platform revenue:
                    </span>
                    <span className="text-sm font-semibold text-black">
                      ₦{platformRevenue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Shopping GMV portion:</span>
                    <span className="text-sm font-semibold text-black">{shoppingGMV}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Projected payout fees collected:
                    </span>
                    <span className="text-sm font-semibold text-black">
                      ₦{payoutFees}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}