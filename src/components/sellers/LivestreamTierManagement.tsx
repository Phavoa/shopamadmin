import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedWrapper } from "@/components/shared/AnimatedWrapper";
import { User } from "@/types/auth";

type TierType = "Beginner" | "Bronze" | "Gold";

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
  // Initialize with actual tier from API data
  const getInitialTier = (): TierType => {
    if (!displaySeller?.tier) return "Bronze";

    const tier = displaySeller.tier.toLowerCase();
    if (tier.includes("beginner")) return "Beginner";
    if (tier.includes("gold")) return "Gold";
    return "Bronze"; // Default fallback
  };

  const [selectedTier, setSelectedTier] = useState<TierType>(getInitialTier());
  const [overrideReason, setOverrideReason] = useState("");

  const handleApplyOverride = () => {
    console.log("Applying override:", {
      tier: selectedTier,
      reason: overrideReason,
      currentTier: displaySeller?.tier,
    });
    // Handle override logic here
  };

  const handleResetToAuto = () => {
    console.log("Resetting to auto");
    setSelectedTier(getInitialTier());
    setOverrideReason("");
    // Handle reset logic here
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
                <InfoRow
                  label="Current Tier:"
                  value={displaySeller.tier || "N/A"}
                />
                <InfoRow
                  label="Auto-eligibility:"
                  value={`Sales: ₦${parseFloat(
                    displaySeller.totalSales
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
                <InfoRow
                  label="Business Name:"
                  value={seller?.businessName || "N/A"}
                />
              </div>

              {/* Manual Override Section */}
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Manual Override
                </h2>

                {/* Tier Selection Buttons */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <TierButton
                    label="Beginner"
                    isSelected={selectedTier === "Beginner"}
                    onClick={() => setSelectedTier("Beginner")}
                  />
                  <TierButton
                    label="Bronze"
                    isSelected={selectedTier === "Bronze"}
                    onClick={() => setSelectedTier("Bronze")}
                  />
                  <TierButton
                    label="Gold"
                    isSelected={selectedTier === "Gold"}
                    onClick={() => setSelectedTier("Gold")}
                  />
                </div>

                {/* Apply Override Button */}
                <Button
                  onClick={handleApplyOverride}
                  className="w-full bg-[#E67E22] hover:bg-orange-600 text-white font-medium py-6 rounded-lg transition-colors mb-4"
                >
                  Apply Override
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

              {/* Reset Button */}
              <Button
                onClick={handleResetToAuto}
                variant="outline"
                className="w-full border border-[#E67E22] text-[#E67E22]  hover:bg-[#E67E22]/50 hover:text-[#E67E22] font-medium py-4 rounded-lg transition-colors"
              >
                Reset to Auto
              </Button>
            </div>
          </Card>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default LivestreamTierManagement;
