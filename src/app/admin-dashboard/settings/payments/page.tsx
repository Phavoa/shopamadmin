"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetSystemConfigByKeyQuery,
  useUpdateSystemConfigMutation,
} from "@/api/systemConfigApi";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";

type PaymentProvider = "PAYSTACK" | "FLUTTERWAVE" | "MONNIFY";

export default function PaymentsWalletSettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderTitle("Payments & Wallet Settings"));
  }, [dispatch]);

  // Fetch configs
  const { data: activeProviderData, isLoading: isLoadingProvider } =
    useGetSystemConfigByKeyQuery("ACTIVE_PAYMENT_PROVIDER");
  const { data: manualWithdrawalsData, isLoading: isLoadingManual } =
    useGetSystemConfigByKeyQuery("MANUAL_WITHDRAWALS_ENABLED");
  const { data: deductVatData, isLoading: isLoadingVatEnabled } =
    useGetSystemConfigByKeyQuery("DEDUCT_VAT_FROM_SELLER");
  const { data: vatPercentData, isLoading: isLoadingVatPercent } =
    useGetSystemConfigByKeyQuery("VAT_PERCENTAGE");

  const [updateConfig, { isLoading: isUpdating }] =
    useUpdateSystemConfigMutation();

  // Local state
  const [activeProvider, setActiveProvider] =
    useState<PaymentProvider>("PAYSTACK");
  const [manualWithdrawals, setManualWithdrawals] = useState<boolean>(false);
  const [deductVatFromSeller, setDeductVatFromSeller] = useState<boolean>(false);
  const [vatPercentage, setVatPercentage] = useState<string>("7.5");

  // Sync with fetched data
  useEffect(() => {
    if (activeProviderData?.data?.value) {
      setActiveProvider(activeProviderData.data.value as PaymentProvider);
    }
    if (manualWithdrawalsData?.data?.value) {
      setManualWithdrawals(manualWithdrawalsData.data.value === "true");
    }
    if (deductVatData?.data?.value !== undefined) {
      setDeductVatFromSeller(deductVatData.data.value === "true");
    }
    if (vatPercentData?.data?.value !== undefined) {
      setVatPercentage(vatPercentData.data.value);
    }
  }, [activeProviderData, manualWithdrawalsData, deductVatData, vatPercentData]);

  const handleSave = async () => {
    try {
      // Update Provider
      await updateConfig({
        key: "ACTIVE_PAYMENT_PROVIDER",
        value: activeProvider,
      }).unwrap();

      // Update Manual Withdrawals
      await updateConfig({
        key: "MANUAL_WITHDRAWALS_ENABLED",
        value: manualWithdrawals.toString(),
      }).unwrap();

      // Update VAT Settings
      await updateConfig({
        key: "DEDUCT_VAT_FROM_SELLER",
        value: deductVatFromSeller.toString(),
      }).unwrap();

      await updateConfig({
        key: "VAT_PERCENTAGE",
        value: vatPercentage || "0",
      }).unwrap();

      toast.success("Payment & VAT settings updated successfully");
    } catch (error) {
      console.error("Failed to save payment settings:", error);
      toast.error("Failed to update payment settings");
    }
  };

  const isLoading =
    isLoadingProvider || isLoadingManual || isLoadingVatEnabled || isLoadingVatPercent;

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
          onClick={handleSave}
          disabled={isLoading || isUpdating}
          className="flex items-center justify-center min-w-[140px] px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-70"
          style={{ background: "#E67E22" }}
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#E67E22] mb-4" />
            <p className="text-gray-500 font-medium">Loading settings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {/* Payment Gateways */}
            <div
              className="p-6 bg-white shadow-sm"
              style={{
                borderRadius: "18px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
              }}
            >
              <h2 className="text-lg font-semibold text-black mb-2">
                Active Payment Gateway
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Select the primary payment processor for checkouts and deposits.
              </p>

              <div className="space-y-3">
                {/* Paystack */}
                <label
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                    activeProvider === "PAYSTACK"
                      ? "border-[#E67E22] bg-orange-50/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_provider"
                      value="PAYSTACK"
                      checked={activeProvider === "PAYSTACK"}
                      onChange={(e) =>
                        setActiveProvider(e.target.value as PaymentProvider)
                      }
                      className="w-4 h-4 text-[#E67E22] focus:ring-[#E67E22]"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Paystack
                      </h3>
                    </div>
                  </div>
                  {activeProvider === "PAYSTACK" && (
                    <CheckCircle2 className="w-5 h-5 text-[#E67E22]" />
                  )}
                </label>

                {/* Flutterwave */}
                <label
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                    activeProvider === "FLUTTERWAVE"
                      ? "border-[#E67E22] bg-orange-50/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_provider"
                      value="FLUTTERWAVE"
                      checked={activeProvider === "FLUTTERWAVE"}
                      onChange={(e) =>
                        setActiveProvider(e.target.value as PaymentProvider)
                      }
                      className="w-4 h-4 text-[#E67E22] focus:ring-[#E67E22]"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Flutterwave
                      </h3>
                    </div>
                  </div>
                  {activeProvider === "FLUTTERWAVE" && (
                    <CheckCircle2 className="w-5 h-5 text-[#E67E22]" />
                  )}
                </label>

                {/* Monnify */}
                <label
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                    activeProvider === "MONNIFY"
                      ? "border-[#E67E22] bg-orange-50/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_provider"
                      value="MONNIFY"
                      checked={activeProvider === "MONNIFY"}
                      onChange={(e) =>
                        setActiveProvider(e.target.value as PaymentProvider)
                      }
                      className="w-4 h-4 text-[#E67E22] focus:ring-[#E67E22]"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Monnify
                      </h3>
                    </div>
                  </div>
                  {activeProvider === "MONNIFY" && (
                    <CheckCircle2 className="w-5 h-5 text-[#E67E22]" />
                  )}
                </label>
              </div>
            </div>

            {/* Wallet Settings / Manual Withdrawals */}
            <div
              className="p-6 bg-white shadow-sm"
              style={{
                borderRadius: "18px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
              }}
            >
              <h2 className="text-lg font-semibold text-black mb-2">
                Wallet & Withdrawals
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Manage how user withdrawals are processed.
              </p>

              <div className="space-y-6">
                <div className="flex items-start justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="pr-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Manual Withdrawals Processing
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      When enabled, withdrawals bypass the automated provider
                      disbursement API and are queued for manual approval and
                      processing by an admin.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={manualWithdrawals}
                      onChange={(e) => setManualWithdrawals(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* VAT (Value Added Tax) Settings */}
            <div
              className="p-6 bg-white shadow-sm md:col-span-2"
              style={{
                borderRadius: "18px",
                border: "0.3px solid rgba(0, 0, 0, 0.20)",
              }}
            >
              <h2 className="text-lg font-semibold text-black mb-2">
                VAT (Value Added Tax) Deduction
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Configure how Value Added Tax is deducted from unregistered sellers&apos; payouts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="pr-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      Deduct VAT from Seller Payout
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      When enabled, VAT is automatically calculated and deducted from the net earnings of sellers who are not VAT-registered. It is never charged to buyers at checkout.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-1 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={deductVatFromSeller}
                      onChange={(e) => setDeductVatFromSeller(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="pr-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      VAT Percentage Rate (%)
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      The tax rate percentage deducted from unregistered seller payouts (e.g., 7.5 for 7.5%).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={vatPercentage}
                        onChange={(e) => setVatPercentage(e.target.value)}
                        disabled={!deductVatFromSeller}
                        className={`w-28 px-3 py-2 text-right border border-gray-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E67E22] pr-8 transition-colors ${
                          !deductVatFromSeller
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                            : "bg-white text-black"
                        }`}
                      />
                      <span
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${
                          !deductVatFromSeller ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}