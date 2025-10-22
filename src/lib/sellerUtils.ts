export const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-[#D8FED9] text-[#4D5650] border-[#D8FED9]";
    case "suspended":
      return "bg-[#FFC5C4] text-[#4D5650] border-[#FFC5C4]";
    case "pending":
    case "under_review":
      return "bg-[#E3CBC7] text-[#4D5650] border-[#E3CBC7]";
    default:
      return "bg-[#E3CBC7] text-[#4D5650] border-[#E3CBC7]";
  }
};

export const getTierBadgeStyles = (tier: string) => {
  switch (tier.toUpperCase()) {
    case "A":
      return "bg-[#FFD700] text-[#4D5650] border-[#FFD700]";
    case "B":
      return "bg-[#C0C0C0] text-[#4D5650] border-[#C0C0C0]";
    case "C":
      return "bg-[#CD7F32] text-[#4D5650] border-[#CD7F32]";
    default:
      return "bg-[#E3CBC7] text-[#4D5650] border-[#E3CBC7]";
  }
};
