import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedWrapper } from "@/components/shared/AnimatedWrapper";
import { User } from "@/types/auth";
import { toast } from "react-hot-toast";
import { useGetLivestreamTiersQuery } from "@/api/slotApi";
import {
  useOverrideLivestreamTierMutation,
  useResetLivestreamTierMutation,
} from "@/api/userApi";

interface DisplaySeller {
  id: string;
  name: string;
  email: string;
  status: string;
  tier: string;
  shopName: string;
  businessCategory: string;
  location: string;
  totalSales: string;
  createdAt: string;
  reliability?: string;
  strikes?: number;
  lastLive?: string;
  walletBalance?: string;
  totalOrders?: number;
  completedOrders?: number;
  activeListings?: number;
  nextSlot?: string;
  manualLivestreamTierId?: string | null;
  effectiveTier?: {
    name: string;
    durationMinutes: number;
    maxViewers: number;
    key: string;
  };
}

interface SellerProfile {
  userId: string;
  status: string;
  tier: string;
  shopName: string;
  businessCategory: string;
  locationCity: string;
  locationState: string;
  totalSales: string;
  createdAt: string;
  updatedAt?: string;
  businessName?: string;
}

interface LivestreamTierManagementProps {
  displaySeller: DisplaySeller;
  user?: User | null;
  seller?: SellerProfile | null;
}

interface InfoRowProps {
  label: string;
  value: string;
}

interface TierButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <div className="flex flex-wrap items-baseline gap-1">
      <span className="text-sm md:text-base font-semibold text-gray-900">
        {label}
      </span>
      <span className="text-sm md:text-base text-gray-700">{value}</span>
    </div>
  );
};

const TierButton: React.FC<TierButtonProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1 rounded-lg border text-sm font-medium transition-all
        ${
          isSelected
            ? "border-gray-900 bg-gray-50 text-gray-900 shadow-sm"
            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
        }
        focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:ring-offset-2
      `}
      type="button"
    >
      {label}
    </button>
  );
};

const LivestreamTierManagement: React.FC<LivestreamTierManagementProps> = ({
  displaySeller,
  user,
  seller,
}) => {
  const { data: tiersResponse, isLoading: tiersLoading } =
    useGetLivestreamTiersQuery({ limit: 3, allowedIntents: ["SCHEDULED"] });
  const [overrideLivestreamTier] = useOverrideLivestreamTierMutation();
  const [resetLivestreamTier] = useResetLivestreamTierMutation();
  const [selectedTierId, setSelectedTierId] = useState<string>("");
  const [overrideReason, setOverrideReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize selected tier
  useEffect(() => {
    if (tiersResponse?.data?.items && displaySeller?.tier && !selectedTierId) {
      const initial = tiersResponse.data.items.find(
        (t) => t.name.toLowerCase() === displaySeller.tier.toLowerCase(),
      );
      if (initial) setSelectedTierId(initial.id);
      else if (tiersResponse.data.items.length > 0)
        setSelectedTierId(tiersResponse.data.items[0].id);
    }
  }, [tiersResponse?.data?.items, displaySeller?.tier, selectedTierId]);

  const handleApplyOverride = async () => {
    if (!seller?.userId) {
      toast.error("Seller ID not found");
      return;
    }

    if (!selectedTierId) {
      toast.error("Please select a tier");
      return;
    }

    if (!overrideReason.trim()) {
      toast.error("Please provide a reason for the override");
      return;
    }

    try {
      setIsSubmitting(true);
      await overrideLivestreamTier({
        userId: seller.userId,
        tierId: selectedTierId,
        reason: overrideReason.trim(),
      }).unwrap();
      toast.success("Livestream tier overridden successfully");
      setOverrideReason("");

      // Removed window.location.reload() - RTK Query handles refetch via tag invalidation
    } catch (error) {
      console.error("Override error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to override tier",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetToAuto = async () => {
    if (!seller?.userId) {
      toast.error("Seller ID not found");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetLivestreamTier(seller.userId).unwrap();
      toast.success("Livestream tier reset to auto successfully");
      setSelectedTierId(""); // Clear selection to trigger re-initialization from new props
      setOverrideReason("");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to reset tier",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="col-span-5 w-full min-h-screen">
      <AnimatedWrapper animation="slideRight" delay={0.7}>
        <div className="max-w-md mx-auto">
          <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-5 md:px-6">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                Livestream Tier Management
              </h1>

              {/* Current Tier Info */}
              <div className="space-y-3 mb-6">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="text-sm md:text-base font-semibold text-gray-900">
                    Current Tier:
                  </span>
                  <span className="text-sm md:text-base text-blue-600 font-bold">
                    {displaySeller.effectiveTier?.name || "N/A"}
                  </span>
                  {!displaySeller.manualLivestreamTierId && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium ml-1">
                      Auto
                    </span>
                  )}
                  {displaySeller.manualLivestreamTierId && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium ml-1">
                      Overridden
                    </span>
                  )}
                </div>
                {displaySeller.effectiveTier && (
                  <div className="grid grid-cols-2 gap-2 mt-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                        Max Duration
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {displaySeller.effectiveTier.durationMinutes} mins
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                        Max Viewers
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {displaySeller.effectiveTier.maxViewers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                <InfoRow
                  label="Auto-eligibility:"
                  value={`Sales: ₦${parseFloat(
                    displaySeller.totalSales,
                  ).toLocaleString()}`}
                />
                <InfoRow
                  label="Business Category:"
                  value={displaySeller.businessCategory || "N/A"}
                />
                <InfoRow
                  label="Shop Name:"
                  value={displaySeller.shopName || "N/A"}
                />
                {/* <InfoRow
                  label="Business Name:"
                  value={seller?.businessName || "N/A"}
                /> */}
              </div>

              {/* Manual Override Section */}
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Manual Override
                </h2>

                {/* Tier Selection Buttons */}
                {tiersLoading ? (
                  <div className="text-sm text-gray-500 mb-4 animate-pulse">
                    Loading tiers...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tiersResponse?.data?.items?.map((tier) => (
                      <TierButton
                        key={tier.id}
                        label={tier.name}
                        isSelected={selectedTierId === tier.id}
                        onClick={() => setSelectedTierId(tier.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Apply Override Button */}
                <Button
                  onClick={handleApplyOverride}
                  disabled={isSubmitting}
                  className="w-full bg-[#E67E22] hover:bg-orange-600 text-white font-medium py-6 rounded-lg transition-colors mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Applying..." : "Apply Override"}
                </Button>

                {/* Reason Input */}
                <Input
                  type="text"
                  placeholder="Write the reason for override...e.g, High Reliability."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent"
                />
              </div>

              <Button
                onClick={handleResetToAuto}
                disabled={isSubmitting}
                variant="outline"
                className="w-full border border-[#E67E22] text-[#E67E22]  hover:bg-[#E67E22]/50 hover:text-[#E67E22] font-medium py-4 rounded-lg transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Resetting..." : "Reset to Auto"}
              </Button>
            </div>
          </Card>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default LivestreamTierManagement;
