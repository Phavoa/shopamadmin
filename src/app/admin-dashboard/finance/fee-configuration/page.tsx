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
import { koboToNaira, nairaToKobo } from "@/lib/utils";
import { SuccessModal } from "@/components/shared/SuccessModal";
import { useNotifications } from "@/hooks/useNotifications";
import { FeeConfigHeader } from "./components/FeeConfigHeader";
import { CommissionTiers } from "./components/CommissionTiers";
import { WalletAndSubscription } from "./components/WalletAndSubscription";
import { LogisticsFees } from "./components/LogisticsFees";
import { VersioningAndEffective } from "./components/VersioningAndEffective";
import { RevenueSimulation } from "./components/RevenueSimulation";

export default function FeeConfigurationPage() {
  const { showSuccess, showError } = useNotifications();
  const { data: configResponse, isLoading: isConfigLoading } =
    useGetFeeConfigQuery();
  const config = configResponse?.data;

  // Fetch zones for name lookup and prices separately (populate causes 500 on backend)
  const { data: zonesResponse, isLoading: isZonesLoading } = useGetZonesQuery(
    { limit: 1000 },
  );
  const zones = zonesResponse?.data?.items ?? [];

  const { data: pricesResponse, isLoading: isPricesLoading } =
    useGetPricesQuery({ limit: 100, sortBy: "createdAt" });
  const prices = pricesResponse?.items ?? [];

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

      await updateTier(payload).unwrap();
      showSuccess(`${tier.name} updated`);
      handleSimulate();
    } catch (err: any) {
      showError(`Failed to update ${tier.name}`);
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
      showError(
        `Failed to seed zones: ${error?.data?.message || error?.message}`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <FeeConfigHeader
        effectiveFrom={config?.effectiveFrom}
        isSaving={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />

      <div className="p-6">
        <h2 className="text-lg font-semibold text-black mb-6">
          Fee Configuration Settings
        </h2>

        <div className="space-y-6">
          <CommissionTiers
            tiers={localTiers}
            isLoading={isTiersLoading}
            isCreating={isCreatingTier}
            onAddTier={handleAddTier}
            onUpdateTierState={handleUpdateTierState}
            onUpdateTierApi={handleUpdateTierApi}
            onDeleteTier={handleDeleteTier}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <WalletAndSubscription
                walletFee={walletFee}
                withdrawalFee={withdrawalFee}
                subscriptionEnabled={subscriptionEnabled}
                subscriptionPrice={subscriptionPrice}
                referralEnabled={referralEnabled}
                setWalletFee={setWalletFee}
                setWithdrawalFee={setWithdrawalFee}
                setSubscriptionEnabled={setSubscriptionEnabled}
                setSubscriptionPrice={setSubscriptionPrice}
                setReferralEnabled={setReferralEnabled}
              />

              <LogisticsFees
                isLoading={isZonesLoading || isPricesLoading}
                isSeeding={isSeeding}
                isUpdatingPrice={isUpdatingPrice}
                prices={prices}
                zones={zones}
                localLogisticsFees={localLogisticsFees}
                onSeedLogistics={handleSeedLogistics}
                onUpdateActive={(priceId, active) => {
                  setLocalLogisticsFees((prev) => ({
                    ...prev,
                    [priceId]: { ...prev[priceId], active },
                  }));
                  updateZonePrice({ id: priceId, data: { active } });
                }}
                onUpdatePrice={(priceId, price) => {
                  if (/^\d*\.?\d*$/.test(price)) {
                    setLocalLogisticsFees((prev) => ({
                      ...prev,
                      [priceId]: { ...prev[priceId], price },
                    }));
                  }
                }}
                onBlurPrice={handleUpdateLogisticsFeeApi}
              />
            </div>

            <div className="space-y-6">
              <VersioningAndEffective
                effectiveDate={effectiveDate}
                gracePeriod={gracePeriod}
                whoCanPublish={whoCanPublish}
                setEffectiveDate={setEffectiveDate}
                setGracePeriod={setGracePeriod}
                setWhoCanPublish={setWhoCanPublish}
              />

              <RevenueSimulation
                expectedPerMonth={expectedPerMonth}
                isSimulating={isSimulating}
                simulationData={simulationData}
                setExpectedPerMonth={setExpectedPerMonth}
                onSimulate={handleSimulate}
              />
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
