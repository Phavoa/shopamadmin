import { formatDistanceToNow } from "date-fns";

export const formatTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    return dateString;
  }
};
