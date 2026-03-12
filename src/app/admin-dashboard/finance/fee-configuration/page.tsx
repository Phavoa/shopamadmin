"use client";

import React, { useState, useEffect } from "react";
import {
  useGetFeeConfigQuery,
  useSaveDraftMutation,
  usePublishConfigMutation,
  useLazySimulateRevenueQuery,
  useGetCommissionTiersQuery,
  useCreateCommissionTierMutation,
  useUpdateCommissionTierMutation,
  useDeleteCommissionTierMutation,
  type CommissionTier, // 👈 add this
} from "@/api/feeConfigApi";
import {
  useUpdatePriceMutation,
  useGetPricesQuery,
  useSeedZonesMutation,
  useGetZonesQuery,
} from "@/api/deliveryApi";
import {
  formatNaira,
  koboToNaira,
  nairaToKobo,
  formatNumber,
} from "@/lib/utils";
import { SuccessModal } from "@/components/shared/SuccessModal";
import { useNotifications } from "@/hooks/useNotifications";
import { Trash2, Plus, Save, Loader2 } from "lucide-react";

export default function FeeConfigurationPage() {
  const { showSuccess, showError } = useNotifications();
  const { data: configResponse, isLoading: isConfigLoading } =
    useGetFeeConfigQuery();
  const config = configResponse?.data;

  // Fetch zones for name lookup and prices separately (populate causes 500 on backend)
  const { data: zonesResponse, isLoading: isZonesLoading } = useGetZonesQuery(
    {},
  );
  const zones = zonesResponse?.data?.items ?? [];

  const { data: pricesResponse, isLoading: isPricesLoading } =
    useGetPricesQuery({ limit: 100, sortBy: "createdAt" });
  const prices = pricesResponse?.items ?? [];
  console.log(
    "[DeliveryPrices] zones:",
    zones.length,
    "prices:",
    prices.length,
    "pricesResponse:",
    pricesResponse,
  );

  const [updateZonePrice, { isLoading: isUpdatingPrice }] =
    useUpdatePriceMutation();
  const [seedZones, { isLoading: isSeeding }] = useSeedZonesMutation();

  const [saveDraft, { isLoading: isSaving }] = useSaveDraftMutation();
  const [publishConfig, { isLoading: isPublishing }] =
    usePublishConfigMutation();
  const [
    simulateRevenue,
    { data: simulationResponse, isFetching: isSimulating },
  ] = useLazySimulateRevenueQuery();

  const { data: tiersResponse, isLoading: isTiersLoading } =
    useGetCommissionTiersQuery({});
  // Handle both direct array and { items: [] } pattern
  const tiers: CommissionTier[] = Array.isArray(tiersResponse?.data)
    ? tiersResponse.data
    : (tiersResponse?.data as { items: CommissionTier[] } | undefined)?.items ||
      [];

  const [createTier, { isLoading: isCreatingTier }] =
    useCreateCommissionTierMutation();
  const [updateTier, { isLoading: isUpdatingTier }] =
    useUpdateCommissionTierMutation();
  const [deleteTier, { isLoading: isDeletingTier }] =
    useDeleteCommissionTierMutation();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const [effectiveDate, setEffectiveDate] = useState("");
  const [gracePeriod, setGracePeriod] = useState("7");
  const [whoCanPublish, setWhoCanPublish] = useState("FINANCE_ADMIN");

  // Wallet and Subscription
  const [walletFee, setWalletFee] = useState("0");
  const [withdrawalFee, setWithdrawalFee] = useState("50");
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState("0");
  const [referralEnabled, setReferralEnabled] = useState(true);

  // Local state for Tiers and Logistics to avoid desync/reset issues
  const [localTiers, setLocalTiers] = useState<CommissionTier[]>([]);
  const [localLogisticsFees, setLocalLogisticsFees] = useState<
    Record<string, { price: string; active: boolean }>
  >({});

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

      // Initialize local tiers
      if (tiers.length > 0) {
        setLocalTiers(
          tiers.map((t) => ({
            ...t,
            minAmount: koboToNaira(t.minAmount).toString(),
            maxAmount: koboToNaira(t.maxAmount).toString(),
          })),
        );
      }

      handleSimulate();
    }
  }, [config, tiers]);

  // Sync tiers to local state when they load
  useEffect(() => {
    if (tiers.length > 0) {
      setLocalTiers(
        tiers.map((t) => ({
          ...t,
          minAmount: koboToNaira(t.minAmount).toString(),
          maxAmount: koboToNaira(t.maxAmount).toString(),
        })),
      );
    }
  }, [tiers]);

  // Sync logistics prices to local state — keyed by price.id
  useEffect(() => {
    if (prices.length > 0) {
      const fees: Record<string, { price: string; active: boolean }> = {};
      prices.forEach((p) => {
        fees[p.id] = {
          price: koboToNaira(p.priceKobo).toString(),
          active: p.active,
        };
      });
      setLocalLogisticsFees(fees);
    }
  }, [prices]);

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
      showSuccess("Draft saved successfully");
      setModalTitle("Draft Saved!");
      setModalMessage(
        "Your draft has been saved successfully. You can now publish these changes to make them live.",
      );
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Check console for details";
      showError(`Failed to save draft: ${errorMessage}`);
    }
  };

  const handlePublish = async () => {
    if (!effectiveDate) {
      alert("Please enter an effective date before publishing.");
      return;
    }

    try {
      console.log("Publishing config with:", {
        effectiveFrom: effectiveDate,
        isFinanceAdmin: true,
      });
      await publishConfig({
        effectiveFrom: effectiveDate,
        isFinanceAdmin: true,
      }).unwrap();
      showSuccess("Configuration published live!");
      setModalTitle("Configuration Published!");
      setModalMessage(
        "The new fee configuration is now live and will be applied to all transactions.",
      );
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || "Check console for details";
      showError(`Failed to publish configuration: ${errorMessage}`);
    }
  };

  const handleSimulate = async () => {
    simulateRevenue({
      expectedMonthlyGmvKobo: nairaToKobo(expectedPerMonth).toString(),
      avgCommissionPercent: tiers.length > 0 ? tiers[0].percentage : 0,
    });
  };

  const handleAddTier = async () => {
    try {
      const nextNum = (tiers?.length || 0) + 1;
      const payload = {
        name: `Tier ${nextNum}`,
        minAmount: 0,
        maxAmount: 0,
        percentage: 0,
      };
      await createTier(payload).unwrap();
      showSuccess("New commission tier added");
    } catch (err: any) {
      const errMsg =
        err?.data?.message || err?.error || "Failed to create tier";
      showError(errMsg);
    }
  };

  const handleUpdateTierState = (
    tierId: string,
    updates: Partial<CommissionTier>,
  ) => {
    setLocalTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, ...updates } : t)),
    );
  };

  const handleUpdateTierApi = async (tierId: string) => {
    const tier = localTiers.find((t) => t.id === tierId);
    if (!tier) return;

    try {
      const payload = {
        id: tier.id,
        name: tier.name,
        minAmount: nairaToKobo(tier.minAmount),
        maxAmount: nairaToKobo(tier.maxAmount),
        percentage: parseFloat(tier.percentage as any) || 0,
      };

      console.log("Updating tier API:", payload);
      await updateTier(payload).unwrap();
      showSuccess(`${tier.name} updated`);

      // Force simulation update after tier change
      handleSimulate();
    } catch (err: any) {
      console.error("Update failed:", err?.data?.message || err?.error);
      showError(`Failed to update ${tier.name}`);
      // Optional: Refresh tiers from API on failure
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (confirm("Are you sure you want to delete this tier?")) {
      try {
        await deleteTier(id).unwrap();
        showSuccess("Tier deleted successfully");
      } catch (err: any) {
        const errMsg =
          err?.data?.message || err?.error || "Failed to delete tier";
        showError(errMsg);
      }
    }
  };

  const handleUpdateLogisticsFeeApi = async (priceId: string) => {
    const feeData = localLogisticsFees[priceId];
    if (!feeData) return;

    try {
      await updateZonePrice({
        id: priceId,
        data: {
          priceKobo: nairaToKobo(feeData.price).toString(),
          active: feeData.active,
        },
      }).unwrap();
      showSuccess("Logistics fee updated");
    } catch (error) {
      console.error("Update logistics fee failed:", error);
      showError("Failed to update logistics fee. Please try again.");
    }
  };

  const handleSeedLogistics = async () => {
    if (
      !confirm(
        "This will initialize the delivery pricing matrix for all zones. Existing prices might be affected if you choose to reset. Continue?",
      )
    ) {
      return;
    }
    try {
      await seedZones({ defaultPriceKobo: "0", reset: false }).unwrap();
      showSuccess("Logistics matrix initialized");
      setModalTitle("Matrix Initialized");
      setModalMessage(
        "The delivery pricing matrix has been successfully initialized. You can now set individual zone fees.",
      );
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      showError(`Failed to seed zones: ${error?.data?.message || error?.message}`);
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
            {config?.effectiveFrom
              ? `Current: ${config.effectiveFrom}`
              : "No Live Config"}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-black">
                Shopping Commission (All Goods)
              </h2>
              <button
                onClick={handleAddTier}
                disabled={isCreatingTier}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[var(--sidebar-primary)] border border-[var(--sidebar-primary)] rounded-lg hover:bg-orange-50 transition-colors"
              >
                {isCreatingTier ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                Add Tier
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isTiersLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-48 bg-gray-50 animate-pulse rounded-xl"
                    />
                  ))
              ) : localTiers.length > 0 ? (
                localTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="p-4 rounded-xl border border-gray-100 bg-gray-50/30 group relative"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) =>
                          handleUpdateTierState(tier.id, {
                            name: e.target.value,
                          })
                        }
                        onBlur={() => handleUpdateTierApi(tier.id)}
                        className="text-sm font-medium text-black bg-transparent border-none outline-none focus:ring-1 focus:ring-orange-200 rounded px-1 w-2/3"
                      />
                      <button
                        onClick={() => handleDeleteTier(tier.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Tier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Min amount (₦):
                        </label>
                        <input
                          type="text"
                          value={tier.minAmount ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*\.?\d*$/.test(val)) {
                              handleUpdateTierState(tier.id, {
                                minAmount: val,
                              });
                            }
                          }}
                          onBlur={() => handleUpdateTierApi(tier.id)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Max amount (₦):
                        </label>
                        <input
                          type="text"
                          value={tier.maxAmount ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*\.?\d*$/.test(val)) {
                              handleUpdateTierState(tier.id, {
                                maxAmount: val,
                              });
                            }
                          }}
                          onBlur={() => handleUpdateTierApi(tier.id)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">
                          Commission %:
                        </label>
                        <input
                          type="text"
                          value={tier.percentage ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Allow digits and at most one decimal point
                            if (/^\d*\.?\d*$/.test(val)) {
                              handleUpdateTierState(tier.id, {
                                percentage: val as any,
                              });
                            }
                          }}
                          onBlur={() => handleUpdateTierApi(tier.id)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-orange-500 transition-colors font-semibold text-orange-600"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No commission tiers defined. Click "Add Tier" to create one.
                </div>
              )}
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
                        onChange={() => setReferralEnabled(!referralEnabled)}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-black">
                    Logistics Fees
                  </h2>
                  <button
                    onClick={handleSeedLogistics}
                    disabled={isSeeding}
                    className="text-xs font-medium text-[var(--sidebar-primary)] px-3 py-1.5 border border-[var(--sidebar-primary)] rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
                  >
                    {isSeeding ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    Initialize Matrix
                  </button>
                </div>

                <div className="space-y-3">
                  {isZonesLoading || isPricesLoading ? (
                    <p className="text-sm text-gray-500">
                      Loading logistics fees...
                    </p>
                  ) : prices.length > 0 ? (
                    prices.map((price) => {
                      // Look up zone name from local zones list by originZoneId
                      const originZone = zones.find(
                        (z) => z.id === price.originZoneId,
                      );
                      const destZone = zones.find(
                        (z) => z.id === price.destinationZoneId,
                      );
                      const isSameZone =
                        price.originZoneId === price.destinationZoneId;
                      const label = isSameZone
                        ? (originZone?.name ?? price.originZoneId)
                        : `${originZone?.name ?? price.originZoneId} → ${destZone?.name ?? price.destinationZoneId}`;

                      return (
                        <div
                          key={price.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={localLogisticsFees[price.id]?.active ?? false}
                              onChange={(e) => {
                                const newActive = e.target.checked;
                                setLocalLogisticsFees((prev) => ({
                                  ...prev,
                                  [price.id]: { ...prev[price.id], active: newActive },
                                }));
                                // Immediately save active status change
                                updateZonePrice({
                                  id: price.id,
                                  data: { active: newActive },
                                });
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                              title={localLogisticsFees[price.id]?.active ? "Deactivate" : "Activate"}
                            />
                            <span className={`text-sm ${localLogisticsFees[price.id]?.active ? "text-black" : "text-gray-400"}`}>
                              {label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">₦</span>
                            <input
                              type="text"
                              value={localLogisticsFees[price.id]?.price ?? "0"}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^\d*\.?\d*$/.test(val)) {
                                  setLocalLogisticsFees((prev) => ({
                                    ...prev,
                                    [price.id]: { ...prev[price.id], price: val },
                                  }));
                                }
                              }}
                              onBlur={() =>
                                handleUpdateLogisticsFeeApi(price.id)
                              }
                              disabled={!localLogisticsFees[price.id]?.active}
                              style={{
                                width: "80px",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                border: "0.3px solid rgba(0, 0, 0, 0.20)",
                                fontSize: "14px",
                                textAlign: "right",
                                outline: "none",
                                opacity: localLogisticsFees[price.id]?.active ? 1 : 0.5,
                              }}
                            />
                            {isUpdatingPrice && (
                              <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500">
                      No delivery price records found. Click &quot;Initialize
                      Matrix&quot; to set up zones and pricing.
                    </p>
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
                      {isSimulating
                        ? "..."
                        : formatNaira(
                            koboToNaira(
                              simulationData?.projectedPlatformRevenueKobo,
                            ),
                          )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Shopping GMV portion:
                    </span>
                    <span className="text-sm font-semibold text-black">
                      {isSimulating
                        ? "..."
                        : formatNaira(
                            koboToNaira(simulationData?.shoppingGmvPortionKobo),
                          )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Projected payout fees collected:
                    </span>
                    <span className="text-sm font-semibold text-black">
                      {isSimulating
                        ? "..."
                        : formatNaira(
                            koboToNaira(
                              simulationData?.projectedPayoutFeesKobo,
                            ),
                          )}
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
