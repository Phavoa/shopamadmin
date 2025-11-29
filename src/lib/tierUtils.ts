/**
 * Maps tier codes to display names
 */
export const getTierDisplayName = (tier: string): string => {
  const tierMap: Record<string, string> = {
    A: "Gold",
    B: "Bronze",
    C: "Beginner",
  };

  return tierMap[tier.toUpperCase()] || tier;
};

/**
 * Gets tier badge styles based on tier level
 */
export const getTierBadgeStyles = (tier: string): string => {
  const tierStyles: Record<string, string> = {
    A: "bg-yellow-100 text-yellow-800 border-yellow-200", // Gold
    B: "bg-orange-100 text-orange-800 border-orange-200", // Bronze
    C: "bg-gray-100 text-gray-800 border-gray-200", // Beginner
  };

  return (
    tierStyles[tier.toUpperCase()] ||
    "bg-gray-100 text-gray-800 border-gray-200"
  );
};
