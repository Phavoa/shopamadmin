// ─────────────────────────────────────────────────────────────────────────────
// src/hooks/useAdminLivestreamMonitor.ts
//
// Read-only WebSocket monitoring hook for the admin livestream dashboard.
// Emits only the initial `join_stream` handshake — no mutation events.
//
// Production fixes applied:
//   1. isReconnecting flag cleared in lot_state (not in connect) + fallback timeout
//   2. isReconnecting reset at effect entry to survive StrictMode double-mount
//   3. Monotonic seqRef for collision-proof activity IDs
//   4. Batched BID_ACCEPTED / LOT_STARTED actions — one dispatch per event
//   5. endsAt is string | null — local clock fallback removed
//   6. Reactions throttled: 500ms buffer → single summarized dispatch
//   7. All timers cleared in cleanup
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useReducer, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { authStorage } from "@/lib/auth/authUtils";
import type {
  AdminMonitorState,
  ActivityItem,
  ActivityType,
  AuctionState,
  LotStatePayload,
  LotStartedPayload,
  BidAcceptedPayload,
  LotLockedPayload,
  LotAcceptedPayload,
  LotDeclinedPayload,
  ViewerCountPayload,
  ChatMessagePayload,
  ReactionPayload,
  JoinStreamAck,
} from "@/types/monitoring";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_ACTIVITY_ITEMS = 100;
const REACTION_FLUSH_MS = 500;
const RECONNECT_FLAG_TIMEOUT_MS = 3000;

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://shapam-ecomerce-backend.onrender.com";

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "CONNECTED" }
  | { type: "DISCONNECTED" }
  | { type: "SET_VIEWER_COUNT"; count: number }
  | { type: "SET_AUCTION_STATE"; state: AuctionState }
  | { type: "UPDATE_AUCTION_STATUS"; status: AuctionState["status"] }
  | { type: "PUSH_ACTIVITY"; item: ActivityItem }
  // ── Batched actions (one dispatch = one render) ────────────────────────────
  | {
      type: "BID_ACCEPTED";
      currentPrice: string;
      nextBidPrice: string;
      endsAt: string | null;
      leaderUserId: string;
      activity: ActivityItem;
    }
  | {
      type: "LOT_STARTED";
      auctionState: AuctionState;
      activity: ActivityItem;
    }
  | {
      type: "LOT_TERMINAL"; // covers lot_locked, lot_accepted, lot_declined
      status: AuctionState["status"];
      activity: ActivityItem;
    };

function pushActivity(
  activities: ActivityItem[],
  item: ActivityItem,
): ActivityItem[] {
  if (activities.some((a) => a.id === item.id)) return activities; // dedup
  const next = [item, ...activities];
  return next.length > MAX_ACTIVITY_ITEMS
    ? next.slice(0, MAX_ACTIVITY_ITEMS)
    : next;
}

function reducer(state: AdminMonitorState, action: Action): AdminMonitorState {
  switch (action.type) {
    case "CONNECTED":
      return { ...state, isConnected: true };

    case "DISCONNECTED":
      return { ...state, isConnected: false };

    case "SET_VIEWER_COUNT":
      return { ...state, viewerCount: action.count };

    case "SET_AUCTION_STATE":
      return { ...state, auctionState: action.state };

    case "UPDATE_AUCTION_STATUS":
      if (!state.auctionState) return state;
      return {
        ...state,
        auctionState: { ...state.auctionState, status: action.status },
      };

    case "PUSH_ACTIVITY":
      return {
        ...state,
        activities: pushActivity(state.activities, action.item),
      };

    // ── Batched: bid_accepted ────────────────────────────────────────────────
    case "BID_ACCEPTED":
      return {
        ...state,
        auctionState: state.auctionState
          ? {
              ...state.auctionState,
              currentPrice: action.currentPrice,
              nextBidPrice: action.nextBidPrice,
              // Only update endsAt if the server provided a new value
              ...(action.endsAt !== null && { endsAt: action.endsAt }),
              leaderUserId: action.leaderUserId,
            }
          : state.auctionState,
        activities: pushActivity(state.activities, action.activity),
      };

    // ── Batched: lot_started ─────────────────────────────────────────────────
    case "LOT_STARTED":
      return {
        ...state,
        auctionState: action.auctionState,
        activities: pushActivity(state.activities, action.activity),
      };

    // ── Batched: lot terminal events ─────────────────────────────────────────
    case "LOT_TERMINAL":
      return {
        ...state,
        auctionState: state.auctionState
          ? { ...state.auctionState, status: action.status }
          : state.auctionState,
        activities: pushActivity(state.activities, action.activity),
      };

    default:
      return state;
  }
}

const initialState: AdminMonitorState = {
  auctionState: null,
  activities: [],
  viewerCount: 0,
  isConnected: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatKobo(kobo: string): string {
  const n = parseInt(kobo, 10);
  return isNaN(n) ? kobo : `₦${(n / 100).toLocaleString("en-NG")}`;
}

function makeId(prefix: string, suffix: string | number): string {
  return `${prefix}:${suffix}`;
}

function buildActivity(
  id: string,
  type: ActivityType,
  message: string,
  timestamp: number,
  raw?: unknown,
): ActivityItem {
  return { id, type, message, timestamp, raw };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdminLivestreamMonitor(
  streamId: string | null | undefined,
): AdminMonitorState {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const socketRef = useRef<Socket | null>(null);
  const streamIdRef = useRef(streamId);
  streamIdRef.current = streamId;

  // Monotonic counter — collision-proof IDs across reconnects (Fix 3)
  const seqRef = useRef(0);

  // Reconnect tracking (Fix 1 + 2)
  const isReconnecting = useRef(false);
  const reconnectFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Mirror endsAt to avoid stale closures in bid_accepted handler (Fix 5)
  const currentEndsAtRef = useRef<string | null>(null);
  currentEndsAtRef.current = state.auctionState?.endsAt ?? null;

  // Track latest leader's display name so lot_locked / lot_accepted can show it
  const leaderNameRef = useRef<string>("");

  // Mirror viewerCount to avoid stale closures in viewer_count handler
  const viewerCountRef = useRef(0);
  viewerCountRef.current = state.viewerCount;

  // Reaction throttle buffer (Fix 6)
  const reactionBufferRef = useRef<ReactionPayload[]>([]);
  const reactionFlushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // ── join_stream emitter ───────────────────────────────────────────────────
  const joinStream = useCallback((socket: Socket) => {
    if (!streamIdRef.current) return;
    socket.emit(
      "join_stream",
      { streamId: streamIdRef.current },
      (ack: JoinStreamAck) => {
        if (ack?.ok) {
          dispatch({ type: "SET_VIEWER_COUNT", count: ack.viewerCount });
        }
      },
    );
  }, []);

  useEffect(() => {
    if (!streamId) return;

    // Fix 2: Reset flag at effect entry — survives StrictMode double-mount.
    // removeAllListeners() on the previous socket is synchronous, so the old
    // socket's "disconnect" cannot fire and corrupt this after we reset it.
    isReconnecting.current = false;

    const token = authStorage.getAccessToken();

    const socket = io(WS_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // ─── Connection lifecycle ──────────────────────────────────────────────

    socket.on("connect", () => {
      dispatch({ type: "CONNECTED" });
      joinStream(socket);

      if (isReconnecting.current) {
        dispatch({
          type: "PUSH_ACTIVITY",
          item: buildActivity(
            makeId("system:reconnected", ++seqRef.current),
            "SYSTEM",
            "Monitoring reconnected",
            Date.now(),
          ),
        });

        // Fix 1: Do NOT clear isReconnecting here. lot_state clears it after
        // it arrives. If lot_state never arrives (no active lot), the fallback
        // timeout below clears it after 3 seconds.
        if (reconnectFallbackRef.current)
          clearTimeout(reconnectFallbackRef.current);
        reconnectFallbackRef.current = setTimeout(() => {
          isReconnecting.current = false;
          reconnectFallbackRef.current = null;
        }, RECONNECT_FLAG_TIMEOUT_MS);
      }
    });

    socket.on("disconnect", () => {
      dispatch({ type: "DISCONNECTED" });
      isReconnecting.current = true;
    });

    socket.on("connect_error", () => {
      dispatch({ type: "DISCONNECTED" });
    });

    // ─── DEBUG: catch-all — remove once confirmed ────────────────────────
    socket.onAny((eventName: string, ...args: unknown[]) => {
      try {
        console.log("[WS DEBUG]", eventName, JSON.stringify(args));
      } catch {
        console.log("[WS DEBUG]", eventName, args);
      }
    });

    // ─── Auction Events ────────────────────────────────────────────────────

    socket.on("lot_state", (payload: LotStatePayload) => {
      dispatch({
        type: "SET_AUCTION_STATE",
        state: {
          lotId: payload.lotId,
          status: payload.status,
          currentPrice: payload.currentPrice,
          nextBidPrice: payload.nextBidPrice,
          leaderUserId: payload.leaderUserId,
          endsAt: payload.endsAt,
        },
      });

      // Fix 1: Flag cleared here — after lot_state confirms, not in connect.
      // This ensures the guard below fires correctly on reconnect.
      if (isReconnecting.current) {
        dispatch({
          type: "PUSH_ACTIVITY",
          item: buildActivity(
            makeId("lot_state_reconnect", payload.lotId),
            "SYSTEM",
            `Auction state restored — lot at ${formatKobo(payload.currentPrice)}`,
            Date.now(),
          ),
        });

        // Clear flag and cancel fallback timer
        isReconnecting.current = false;
        if (reconnectFallbackRef.current) {
          clearTimeout(reconnectFallbackRef.current);
          reconnectFallbackRef.current = null;
        }
      }
    });

    // Fix 4: Single LOT_STARTED dispatch (was two)
    socket.on("lot_started", (payload: LotStartedPayload) => {
      leaderNameRef.current = ""; // reset winner tracking for new lot
      dispatch({
        type: "LOT_STARTED",
        auctionState: {
          lotId: payload.lotId,
          status: "LIVE",
          currentPrice: payload.startPrice,
          nextBidPrice: payload.nextBidPrice,
          leaderUserId: null,
          endsAt: payload.endsAt,
        },
        activity: buildActivity(
          makeId("lot_started", payload.lotId),
          "LOT_STARTED",
          `🟢 New lot started — opening bid ${formatKobo(payload.startPrice)}`,
          Date.now(),
          payload,
        ),
      });
    });

    // Fix 4 + 5: Single BID_ACCEPTED dispatch, no local clock fallback
    socket.on("bid_accepted", (payload: BidAcceptedPayload) => {
      const endsAt = payload.extendedEndsAt ?? null;
      const resolvedEndsAt = endsAt ?? currentEndsAtRef.current;

      const name = `${payload.user.firstName} ${payload.user.lastName}`.trim();
      leaderNameRef.current = name; // keep winner name for lot_locked / lot_accepted
      const timerNote = payload.extendedEndsAt ? " ↑ timer extended" : "";

      dispatch({
        type: "BID_ACCEPTED",
        currentPrice: payload.amount,
        nextBidPrice: payload.nextBidPrice,
        endsAt: resolvedEndsAt,
        leaderUserId: payload.userId,
        activity: buildActivity(
          makeId(
            `bid:${payload.userId}`,
            `${payload.amount}:${++seqRef.current}`,
          ),
          "BID",
          `💰 ${name} is now highest bidder — ${formatKobo(payload.amount)}${timerNote}`,
          Date.now(),
          payload,
        ),
      });
    });

    // Fix 4: Single LOT_TERMINAL dispatch for lot_locked
    socket.on("lot_locked", (payload: LotLockedPayload) => {
      const winner = leaderNameRef.current;
      dispatch({
        type: "LOT_TERMINAL",
        status: "LOCKED",
        activity: buildActivity(
          makeId("lot_locked", payload.lotId),
          "LOCKED",
          winner
            ? `🔒 Bidding closed — highest bidder: ${winner} at ${formatKobo(payload.finalPriceKobo)}`
            : `🔒 Bidding closed at ${formatKobo(payload.finalPriceKobo)}`,
          Date.now(),
          payload,
        ),
      });
    });

    // Fix 4: Single LOT_TERMINAL dispatch for lot_accepted
    socket.on("lot_accepted", (payload: LotAcceptedPayload) => {
      const winner = leaderNameRef.current;
      dispatch({
        type: "LOT_TERMINAL",
        status: "SOLD",
        activity: buildActivity(
          makeId("lot_accepted", payload.lotId),
          "SOLD",
          winner
            ? `🏆 ${winner} won the lot for ${formatKobo(payload.amountKobo)}!`
            : `🏆 Lot sold for ${formatKobo(payload.amountKobo)}`,
          Date.now(),
          payload,
        ),
      });
    });

    // Fix 4: Single LOT_TERMINAL dispatch for lot_declined
    socket.on("lot_declined", (payload: LotDeclinedPayload) => {
      dispatch({
        type: "LOT_TERMINAL",
        status: "NOT_SOLD",
        activity: buildActivity(
          makeId("lot_declined", payload.lotId),
          "DECLINED",
          "Lot ended — Not sold",
          Date.now(),
          payload,
        ),
      });
    });

    // ─── Engagement Events ─────────────────────────────────────────────────

    socket.on("viewer_count", (payload: ViewerCountPayload) => {
      // Ref-based dedup prevents redundant dispatches without stale closure risk
      if (viewerCountRef.current === payload.count) return;
      dispatch({ type: "SET_VIEWER_COUNT", count: payload.count });
      // Viewer count changes are NOT logged to the activity feed —
      // they are already live in the video panel. Logging them pollutes the
      // feed and causes unnecessary re-renders under high viewer churn.
    });

    socket.on("chat_message", (payload: ChatMessagePayload) => {
      console.log("[WS chat_message raw]", JSON.stringify(payload));

      const firstName = payload?.user?.firstName ?? "";
      const lastName = payload?.user?.lastName ?? "";
      const name = `${firstName} ${lastName}`.trim() || "Viewer";

      // Priority: imageUrl > logoUrl (top-level) > seller.logoUrl > null
      const avatarUrl: string | null =
        payload?.user?.imageUrl ||
        payload?.user?.logoUrl ||
        payload?.user?.seller?.logoUrl ||
        null;

      const message =
        (payload as any)?.message ?? (payload as any)?.text ?? "(message)";
      const timestamp =
        (payload as any)?.timestamp ??
        (payload as any)?.createdAt ??
        Date.now();
      const ts =
        typeof timestamp === "number"
          ? timestamp
          : new Date(timestamp).getTime();

      dispatch({
        type: "PUSH_ACTIVITY",
        item: {
          ...buildActivity(
            makeId("chat", `${ts}:${++seqRef.current}`),
            "CHAT",
            `${name}: ${message}`,
            ts,
            payload,
          ),
          senderName: name,
          avatarUrl,
        },
      });
    });

    // Fix 6: Reactions throttled — 500ms buffer → single summarized dispatch
    socket.on("reaction", (payload: ReactionPayload) => {
      reactionBufferRef.current.push(payload);

      // Only schedule one flush timer per window
      if (reactionFlushTimerRef.current) return;

      reactionFlushTimerRef.current = setTimeout(() => {
        const buf = reactionBufferRef.current;
        reactionBufferRef.current = [];
        reactionFlushTimerRef.current = null;

        if (buf.length === 0) return;

        // Aggregate: { "❤️": 5, "🔥": 3 } → "5× ❤️  3× 🔥"
        const counts: Record<string, number> = {};
        for (const r of buf) {
          counts[r.type] = (counts[r.type] ?? 0) + 1;
        }
        const summary = Object.entries(counts)
          .map(([type, n]) => (n > 1 ? `${n}× ${type}` : type))
          .join("  ");

        dispatch({
          type: "PUSH_ACTIVITY",
          item: buildActivity(
            makeId("reaction", ++seqRef.current),
            "REACTION",
            `Reactions: ${summary}`,
            Date.now(),
          ),
        });
      }, REACTION_FLUSH_MS);
    });

    // ─── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      // Fix 7: Clear all timers before tearing down socket
      if (reconnectFallbackRef.current) {
        clearTimeout(reconnectFallbackRef.current);
        reconnectFallbackRef.current = null;
      }
      if (reactionFlushTimerRef.current) {
        clearTimeout(reactionFlushTimerRef.current);
        reactionFlushTimerRef.current = null;
      }
      // Flush any buffered reactions before unmounting
      reactionBufferRef.current = [];

      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [streamId, joinStream]);

  return state;
}
