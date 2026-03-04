// ─────────────────────────────────────────────────────────────────────────────
// src/types/monitoring.ts
// Shared type definitions for the admin livestream monitoring system.
// All types map 1-to-1 to the backend WebSocket event payloads documented in
// the Shopam Engineering Guide.
// ─────────────────────────────────────────────────────────────────────────────

// ─── WebSocket Event Payloads ────────────────────────────────────────────────

/** Emitted once after join_stream if an auction lot is currently active. */
export interface LotStatePayload {
  lotId: string;
  status: "LIVE" | "LOCKED" | "SOLD" | "NOT_SOLD";
  currentPrice: string;
  nextBidPrice: string;
  leaderUserId: string | null;
  endsAt: string;
}

/** Broadcast when the seller starts a new lot. */
export interface LotStartedPayload {
  lotId: string;
  livestreamItemId: string;
  productId: string;
  startPrice: string;
  nextBidPrice: string;
  endsAt: string;
}

/** Broadcast when a bid is successfully accepted. */
export interface BidAcceptedPayload {
  lotId: string;
  amount: string;
  nextBidPrice: string;
  userId: string;
  extendedEndsAt?: string;
  user: {
    firstName: string;
    lastName: string;
    imageUrl: string | null;
  };
}

/** Broadcast when bidding closes (winner pending seller acceptance). */
export interface LotLockedPayload {
  lotId: string;
  leaderUserId: string;
  finalPriceKobo: string;
}

/** Broadcast when the seller accepts the winner. */
export interface LotAcceptedPayload {
  lotId: string;
  amountKobo: string;
}

/** Broadcast when the seller declines or cancels the lot. */
export interface LotDeclinedPayload {
  lotId: string;
}

/** Broadcast when viewer count changes. */
export interface ViewerCountPayload {
  streamId: string;
  count: number;
}

/** Broadcast when a chat message is sent by any participant. */
export interface ChatMessagePayload {
  user: {
    firstName: string;
    lastName: string;
    imageUrl: string | null;
    /** Seller logo — used as avatar fallback when imageUrl is absent. */
    logoUrl?: string | null;
    seller?: { logoUrl?: string | null };
  };
  message: string;
  timestamp: number;
}

/** Broadcast when a reaction is sent. */
export interface ReactionPayload {
  type: string;
  userId: string;
}

/** Ack response received after emitting join_stream. */
export interface JoinStreamAck {
  ok: boolean;
  room: string;
  viewerCount: number;
  mode: "hls" | "webrtc";
  token: string | null;
}

// ─── Hook Return Types ────────────────────────────────────────────────────────

/** Snapshot of the current auction lot state. Null when no lot is active. */
export interface AuctionState {
  lotId: string;
  status: "LIVE" | "LOCKED" | "SOLD" | "NOT_SOLD";
  currentPrice: string;
  nextBidPrice: string;
  leaderUserId: string | null;
  /**
   * Server-provided end time (ISO string). Null means the server has not yet
   * confirmed the end time — never substitute a local clock value here.
   */
  endsAt: string | null;
}

/** Discriminated union of all activity types displayed in the feed. */
export type ActivityType =
  | "LOT_STARTED"
  | "BID"
  | "LOCKED"
  | "SOLD"
  | "DECLINED"
  | "CHAT"
  | "REACTION"
  | "VIEWER_UPDATE"
  | "SYSTEM";

/** A single entry in the admin activity feed. */
export interface ActivityItem {
  /** Stable unique identifier. Prevents duplicate rendering on reconnect. */
  id: string;
  type: ActivityType;
  message: string;
  /** Unix timestamp (ms). Prefer server-provided value when available. */
  timestamp: number;
  /** Display name of the sender (chat messages). */
  senderName?: string;
  /** Resolved avatar URL — imageUrl first, then logoUrl fallback. */
  avatarUrl?: string | null;
  /** Original raw event payload for full data access if needed. */
  raw?: unknown;
}

/** The complete state returned by useAdminLivestreamMonitor. */
export interface AdminMonitorState {
  /** Real-time auction lot snapshot. Null when no lot is currently active. */
  auctionState: AuctionState | null;
  /** Activity feed — newest first, capped at MAX_ACTIVITY_ITEMS. */
  activities: ActivityItem[];
  /** Current viewer count, updated live from viewer_count events. */
  viewerCount: number;
  /** Whether the WebSocket is currently connected. */
  isConnected: boolean;
}
