export type DisplaySeller = {
  userId: string;
  shopName: string;
  businessName?: string;
  businessCategory?: string;
  locationCity?: string;
  locationState?: string;
  status: string;
  createdAt: string;
  govIdUrl?: string;
  businessDocUrl?: string;
};

export const getStatusBadgeStyles = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return "bg-[#D1FAE5] text-[#065F46] border-[#D1FAE5]";
    case "SUSPENDED":
      return "bg-[#FEE2E2] text-[#991B1B] border-[#FEE2E2]";
    case "PENDING":
    case "UNDER_REVIEW":
    default:
      return "bg-[#FED7AA] text-[#9A3412] border-[#FED7AA]";
  }
};

export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};
