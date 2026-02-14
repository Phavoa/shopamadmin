"use client";
import React, { useState } from "react";
import TierCard from "@/components/tiers/TierCard";
import EditTierModal from "@/components/tiers/EditTierModal";
import GlobalRules from "@/components/tiers/GlobalRules";
import {
  useGetLivestreamTiersQuery,
  useUpdateLivestreamTierMutation,
  LiveStreamTier,
  UpdateTierRequest,
} from "@/api/slotApi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Type needed for TierCard component, derived from UI requirements
type TierUI = {
  id: string;
  title: string;
  subtitle?: string;
  meta: string[];
};

const GLOBAL_RULES = [
  "Start window: 7:30 to 9:30 Sundays",
  "One scheduled slot per seller per week (groups allowed if on slot)",
  "Pop-up streams: 60 mins, cap 20 viewers",
  "No-show: auto-release at 7:10, add 1 strike",
  "Penalty: 2 strikes in 30 days → booking cooldown 7 days",
  "Standby sellers: auto-notify if a slot is released",
  "Admin override: can set tier and cap for any seller",
];

export default function TiersAndRulesPage() {
  const { data: response, isLoading, isError } = useGetLivestreamTiersQuery({});
  const [updateTier, { isLoading: isUpdating }] =
    useUpdateLivestreamTierMutation();

  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tiers = response?.data?.items || [];

  const handleEdit = (id: string) => {
    setEditingTierId(id);
    setIsModalOpen(true);
  };

  const handleReset = (id: string) => {
    // Reset functionality would nominally restore defaults.
    // Since we are strictly using API data, we might need an API endpoint for "reset"
    // or just inform the user this is not yet connected if no endpoint exists.
    // For now, adhering to "integration" scope, we'll toast that it's strict API data.
    toast.error("Resetting to default is not currently supported via API.");
  };

  const handleSaveTier = async (id: string, updates: UpdateTierRequest) => {
    try {
      await updateTier({ id, data: updates }).unwrap();
      toast.success("Tier updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update tier:", error);
      toast.error("Failed to update tier. Please try again.");
    }
  };

  // Map API data to UI format for TierCard
  const mapTierToUI = (tier: LiveStreamTier): TierUI => ({
    id: tier.id,
    title: tier.name,
    subtitle: tier.description || `Unlock threshold: ${tier.minTotalSales}`,
    meta: [
      `Viewer cap: ${tier.maxViewers}`,
      `Duration: ${tier.durationMinutes} mins`,
    ],
  });

  const editingTier = tiers.find((t) => t.id === editingTierId) || null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#E67A2B]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        Failed to load tiers. Please try refreshing the page.
      </div>
    );
  }

  return (
    <main className=" px-6 pt-8 pb-16 font-sans" aria-label="main-content">
      {/* Tiers grid */}
      <section aria-labelledby="tiers-heading">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={mapTierToUI(tier)}
              onEdit={handleEdit}
              onReset={handleReset}
            />
          ))}
        </div>
      </section>

      <GlobalRules rules={GLOBAL_RULES} />

      <EditTierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tier={editingTier}
        onSave={handleSaveTier}
        isLoading={isUpdating}
      />
    </main>
  );
}
