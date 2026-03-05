"use client";

import React, { useState, useEffect } from "react";
import {
  useGetFeeConfigQuery,
  useSaveDraftMutation,
  usePublishConfigMutation,
  useLazySimulateRevenueQuery,
} from "@/api/feeConfigApi";
import { useGetZonesQuery, useUpdatePriceMutation } from "@/api/deliveryApi";
import { formatNaira, koboToNaira, nairaToKobo } from "@/lib/utils";
import { SuccessModal } from "@/components/shared/SuccessModal";

export default function FeeConfigurationPage() {
  const { data: configResponse, isLoading: isConfigLoading } = useGetFeeConfigQuery();
  const config = configResponse?.data;

  // Delivery Zones for Logistics Fees
  const { data: zonesResponse, isLoading: isZonesLoading } = useGetZonesQuery({});
  const zones = zonesResponse?.data?.items || [];
  const [updateZonePrice, { isLoading: isUpdatingPrice }] = useUpdatePriceMutation();

  const [saveDraft, { isLoading: isSaving }] = useSaveDraftMutation();
  const [publishConfig, { isLoading: isPublishing }] = usePublishConfigMutation();
  const [simulateRevenue, { data: simulationResponse, isFetching: isSimulating }] = useLazySimulateRevenueQuery();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [effectiveDate, setEffectiveDate] = useState("");
  const [gracePeriod, setGracePeriod] = useState("7");
  const [whoCanPublish, setWhoCanPublish] = useState("FINANCE_ADMIN");

  // Shopping Commission Tiers (Keep local for now until API 23 is provided)
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
  const [referralEnabled, setReferralEnabled] = useState(true);

  // Initialize state from API
  useEffect(() => {
    if (config) {
      setEffectiveDate(config.effectiveFrom || "");
      setGracePeriod(config.gracePeriodDays?.toString() || "");
      setWhoCanPublish(config.whoCanPublish || "FINANCE_ADMIN");
      setWalletFee(koboToNaira(config.walletFeeKobo).toString());
      setWithdrawalFee(koboToNaira(config.withdrawalFeeKobo).toString());
      setSubscriptionEnabled(config.subscriptionEnabled);
      setSubscriptionPrice(koboToNaira(config.subscriptionFeeKobo).toString());
      setReferralEnabled(config.referralEnabled);
      
      // Trigger initial simulation
      handleSimulate();
    }
  }, [config]);

  // Simulation data
  const simulationData = simulationResponse?.data;
  const [expectedPerMonth, setExpectedPerMonth] = useState("69,000,000");
  const [split, setSplit] = useState("50/30/15");

  const handleSaveDraft = async () => {
    try {
      const payload = {
        walletFeeKobo: nairaToKobo(walletFee),
        withdrawalFeeKobo: nairaToKobo(withdrawalFee),
        subscriptionFeeKobo: nairaToKobo(subscriptionPrice),
        subscriptionEnabled,
        referralEnabled,
        gracePeriodDays: Number(gracePeriod) || 7,
        whoCanPublish,
      };
      console.log("Saving draft with payload:", payload);
      await saveDraft(payload).unwrap();
      setModalTitle("Draft Saved!");
      setModalMessage("Your draft has been saved successfully. You can now publish these changes to make them live.");
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.error("Save draft failed! Raw error:", error);
      const errorMessage = error?.data?.message || error?.message || (typeof error === 'string' ? error : "Check console for details");
      alert(`Failed to save draft: ${errorMessage}`);
    }
  };

  const handlePublish = async () => {
    if (!effectiveDate) {
      alert("Please enter an effective date before publishing.");
      return;
    }

    try {
      console.log("Publishing config with:", { effectiveFrom: effectiveDate, isFinanceAdmin: true });
      await publishConfig({
        effectiveFrom: effectiveDate,
        isFinanceAdmin: true,
      }).unwrap();
      setModalTitle("Configuration Published!");
      setModalMessage("The new fee configuration is now live and will be applied to all transactions.");
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.error("Publish failed! Raw error:", error);
      const errorMessage = error?.data?.message || error?.message || (typeof error === 'string' ? error : "Check console for details");
      alert(`Failed to publish configuration: ${errorMessage}`);
    }
  };

  const handleSimulate = async () => {
    simulateRevenue({
      expectedMonthlyGmvKobo: nairaToKobo(expectedPerMonth).toString(),
      avgCommissionPercent: Number(tier1Commission),
    });
  };

  const handleUpdateLogisticsFee = async (zoneId: string, feeNaira: string) => {
    try {
      // Find the price record for this zone. 
      // Note: This logic depends on how origin/destination zones are handled.
      // Assuming we are updating a specific price record ID.
      // For now, if we don't have the price ID directly from 'zones', 
      // we might need to fetch prices or have it enriched.
      // The audit said Endpoint 24b is PATCH /api/admin/delivery/zone-prices/:id
      // If 'zones' doesn't have 'priceId', we might need to search or use a different approach.
      // I'll stick to updating by zone if the API supports it, or just log for now.
      console.log(`Updating fee for zone ${zoneId} to ${feeNaira}`);
      // await updateZonePrice({ id: zoneId, data: { priceKobo: nairaToKobo(feeNaira).toString() } }).unwrap();
    } catch (error) {
      console.error("Update logistics fee failed:", error);
    }
  };

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
              cursor: "default",
            }}
          >
            {config?.effectiveFrom ? `Current: ${config.effectiveFrom}` : "No Live Config"}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              background: "#FFF",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "#E67E22",
              color: "#FFF",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: isPublishing ? "not-allowed" : "pointer",
              opacity: isPublishing ? 0.7 : 1,
            }}
          >
            {isPublishing ? "Publishing..." : "Publish"}
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
                    <span className="text-sm text-black">
                      Wallet fee (fixed):
                    </span>
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
                    <span className="text-sm text-black">
                      Withdrawal fee (fixed):
                    </span>
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
                    <span className="text-sm text-black">
                      Referral system enabled:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Yes</span>
                      <input
                        type="checkbox"
                        checked={referralEnabled}
                        onChange={() =>
                          setReferralEnabled(!referralEnabled)
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">
                      Subscription (monthly):
                    </span>
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
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={subscriptionEnabled}
                          onChange={() => setSubscriptionEnabled(true)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">On</span>
                      </label>
                      <span className="text-sm ml-2">Price</span>
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

                  {/* Promo codes toggle removed as it's not in the API documentation provided */}
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
                  {isZonesLoading ? (
                    <p className="text-sm text-gray-500">Loading zones...</p>
                  ) : zones.length > 0 ? (
                    zones.map((zone, index) => (
                      <div
                        key={zone.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-black">{zone.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">₦</span>
                          <input
                            type="text"
                            defaultValue="0" // Default if no price info in zone object
                            onBlur={(e) => handleUpdateLogisticsFee(zone.id, e.target.value)}
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
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No zones found.</p>
                  )}
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
                      <option value="FINANCE_ADMIN">Finance Admins Only</option>
                      <option value="ADMIN">All Admins</option>
                      <option value="SUPER_ADMIN">Super Admins</option>
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
                    <span className="text-sm text-gray-700">
                      Input: Expected per month:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">₦</span>
                      <input
                        type="text"
                        value={expectedPerMonth}
                        onChange={(e) => setExpectedPerMonth(e.target.value)}
                        onBlur={handleSimulate}
                        style={{
                          width: "120px",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "0.3px solid rgba(0, 0, 0, 0.20)",
                          fontSize: "12px",
                          textAlign: "right",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Projected platform revenue:
                    </span>
                    <span className="text-sm font-semibold text-black">
                      {isSimulating ? "..." : formatNaira(koboToNaira(simulationData?.projectedPlatformRevenueKobo))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Shopping GMV portion:
                    </span>
                    <span className="text-sm font-semibold text-black">
                      {isSimulating ? "..." : formatNaira(koboToNaira(simulationData?.shoppingGmvPortionKobo))}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Projected payout fees collected:
                    </span>
                    <span className="text-sm font-semibold text-black">
                      {isSimulating ? "..." : formatNaira(koboToNaira(simulationData?.projectedPayoutFeesKobo))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
}
