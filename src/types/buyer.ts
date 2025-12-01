import { User } from "./auth";

export interface Buyer extends User {
  name?: string;
  totalOrders?: number;
  totalSpend?: string;
  lastActivity?: string;
  strikes?: number;
  followersCount?: number;
  followingCount?: number;
}

export interface SelectedBuyerForAction {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StrikeData {
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  reason: string;
  duration: string;
  strikeCount: number;
  status: string;
  date: string;
}
