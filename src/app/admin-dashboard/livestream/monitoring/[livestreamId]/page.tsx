"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetLiveStreamByIdQuery } from "@/api/liveStreamApi";
import VideoPlayer from "@/components/livestream/VideoPlayer";
import { useAdminLivestreamMonitor } from "@/hooks/useAdminLivestreamMonitor";
import type { ActivityItem, AuctionState } from "@/types/monitoring";
import {
  Play,
  TrendingUp,
  MessageSquare,
  Gift,
  Package,
  Loader2,
  AlertCircle,
  Wifi,
  Gavel,
  Users,
  ShieldAlert,
} from "lucide-react";

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConnectionBadge({ isConnected }: { isConnected: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium">
      {isConnected ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-green-600">Live</span>
        </>
      ) : (
        <>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          <span className="text-red-500">Disconnected</span>
        </>
      )}
    </span>
  );
}

function LotStatusBadge({ status }: { status: AuctionState["status"] }) {
  const map: Record<
    AuctionState["status"],
    { label: string; className: string }
  > = {
    LIVE: { label: "LIVE", className: "bg-green-100 text-green-700" },
    LOCKED: { label: "LOCKED", className: "bg-amber-100 text-amber-700" },
    SOLD: { label: "SOLD", className: "bg-blue-100 text-blue-700" },
    NOT_SOLD: { label: "NOT SOLD", className: "bg-red-100 text-red-600" },
  };
  const { label, className } = map[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function ActivityIcon({ type }: { type: ActivityItem["type"] }) {
  const iconClass = "w-4 h-4 flex-shrink-0";
  switch (type) {
    case "BID":
      return <TrendingUp className={iconClass} />;
    case "LOT_STARTED":
      return <Gavel className={iconClass} />;
    case "LOCKED":
      return <ShieldAlert className={iconClass} />;
    case "SOLD":
      return <Package className={iconClass} />;
    case "DECLINED":
      return <AlertCircle className={iconClass} />;
    case "CHAT":
      return <MessageSquare className={iconClass} />;
    case "REACTION":
      return <Gift className={iconClass} />;
    case "VIEWER_UPDATE":
      return <Users className={iconClass} />;
    case "SYSTEM":
      return <Wifi className={iconClass} />;
    default:
      return <Package className={iconClass} />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WatchLivePage() {
  const params = useParams();
  const router = useRouter();
  const livestreamId = params?.livestreamId as string;

  // ── REST: stream metadata ──────────────────────────────────────────────────
  const { data, isLoading, error } = useGetLiveStreamByIdQuery(livestreamId, {
    pollingInterval: 15000,
    skip: !livestreamId,
  });
  const stream = data?.data;

  // ── WebSocket: real-time monitoring (read-only) ────────────────────────────
  const { activities, auctionState, viewerCount, isConnected } =
    useAdminLivestreamMonitor(livestreamId);

  // Format price helper — values from server are in kobo, divide by 100 for Naira
  const fmt = (koboStr: string) => {
    const n = parseInt(koboStr, 10);
    return isNaN(n) ? koboStr : `₦${(n / 100).toLocaleString("en-NG")}`;
  };

  // Countdown — only from server-provided endsAt, never local clock
  const countdownDisplay = useMemo(() => {
    if (!auctionState?.endsAt || auctionState.status !== "LIVE") return null;
    const msLeft = new Date(auctionState.endsAt).getTime() - Date.now();
    if (msLeft <= 0) return "Checking…";
    const s = Math.floor((msLeft / 1000) % 60);
    const m = Math.floor(msLeft / 60000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [auctionState?.endsAt, auctionState?.status]);

  // ── Loading / error states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[var(--background)] p-6">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900">
          Stream not found
        </h2>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[rgba(0,0,0,0.9)]">
          Live Monitoring — {stream.title || "Maxi Gadgets"}
        </h1>
        <ConnectionBadge isConnected={isConnected} />
      </div>

      {/* ── Row 1: Video + Activity Feed ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Preview (2/3) */}
        <div
          className="lg:col-span-2 bg-white p-5"
          style={{
            borderRadius: "18px",
            border: "0.3px solid rgba(0,0,0,0.20)",
          }}
        >
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)] mb-4">
            Live Preview
          </h2>

          <div
            className="relative bg-[#1a1a2e] rounded-lg flex items-center justify-center overflow-hidden"
            style={{ height: "85%" }}
          >
            {stream.liveHlsPlaylistPath ? (
              <VideoPlayer
                src={stream.liveHlsPlaylistPath}
                className="w-full h-full"
                autoPlay={true}
                minimal={true}
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#E67E22] flex items-center justify-center mx-auto mb-3">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
                <p className="text-white text-lg font-medium">
                  {stream.status === "LIVE"
                    ? "Stream starting…"
                    : "Not live yet"}
                </p>
              </div>
            )}
          </div>

          {/* Video stats */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-[rgba(0,0,0,0.7)]">
              Viewers:{" "}
              <span className="font-semibold">
                {isConnected ? viewerCount : "—"}
              </span>
            </p>
            <p className="text-sm text-[rgba(0,0,0,0.7)]">
              Stream Health:{" "}
              {isConnected ? (
                <span className="text-green-600">Connected</span>
              ) : (
                <span className="text-red-500">Disconnected</span>
              )}
            </p>
          </div>
        </div>

        {/* Activity Feed (1/3) */}
        <div>
          <div
            className="bg-white p-5 flex flex-col"
            style={{
              borderRadius: "18px",
              border: "0.3px solid rgba(0,0,0,0.20)",
              height: "700px",
            }}
          >
            <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)] mb-4">
              Activity Feed
              {activities.length > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  ({activities.length})
                </span>
              )}
            </h2>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-400 text-center mt-8">
                  {isConnected
                    ? "Waiting for activity…"
                    : "Connecting to stream…"}
                </p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    {/* Avatar or icon depending on type */}
                    {activity.type === "CHAT" ? (
                      <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {activity.avatarUrl ? (
                          <img
                            src={activity.avatarUrl}
                            alt={activity.senderName ?? ""}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-[9px] font-bold text-gray-500 uppercase leading-none">
                            {(activity.senderName ?? "?").slice(0, 2)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-0.5 text-[rgba(0,0,0,0.5)] flex-shrink-0">
                        <ActivityIcon type={activity.type} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      {activity.type === "CHAT" && activity.senderName && (
                        <p className="text-[11px] font-semibold text-[rgba(0,0,0,0.6)] mb-0.5">
                          {activity.senderName}
                        </p>
                      )}
                      <p className="text-sm text-[rgba(0,0,0,0.8)] leading-relaxed break-words">
                        {activity.type === "CHAT"
                          ? // Strip "Name: " prefix since name is rendered separately
                            activity.message.replace(/^[^:]+:\s*/, "")
                          : activity.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6">
            <div
              className="bg-white p-5"
              style={{
                borderRadius: "18px",
                border: "0.3px solid rgba(0,0,0,0.20)",
              }}
            >
              <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)] mb-4">
                Insights
              </h2>

              <div className="gap-6">
                <div>
                  <p className="text-sm text-[rgba(0,0,0,0.7)]">
                    Total Sales this Stream
                  </p>
                  <p className="font-semibold text-[rgba(0,0,0,0.9)] mt-1">
                    ₦620,000
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[rgba(0,0,0,0.7)]">
                    Products Sold
                  </p>
                  <p className="font-semibold text-[rgba(0,0,0,0.9)] mt-1">
                    12
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[rgba(0,0,0,0.7)]">Engagement</p>
                  <p className="font-semibold text-[rgba(0,0,0,0.9)] mt-1">
                    Avg watch 14m | Peak {viewerCount > 0 ? viewerCount : 340}{" "}
                    viewers
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[rgba(0,0,0,0.9)] mb-1">
                    Top Buyers
                  </p>
                  <ol className="text-sm text-[rgba(0,0,0,0.7)] space-y-1">
                    <li>1. John B. — ₦320,000</li>
                    <li>2. Ahmed H. — ₦120,000</li>
                    <li>3. Mary K. — ₦30,000</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Current Lot + Admin Controls ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Admin Controls (2/3) */}
        <div
          className="lg:col-span-2 bg-white p-5"
          style={{
            borderRadius: "18px",
            border: "0.3px solid rgba(0,0,0,0.20)",
          }}
        >
          <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)] mb-4">
            Admin Controls
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
              style={{ background: "#E67E22" }}
            >
              Add Strike to Seller
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium border transition-colors"
              style={{
                border: "1px solid rgba(0,0,0,0.2)",
                color: "rgba(0,0,0,0.7)",
              }}
            >
              Issue Warning to Seller
            </button>
            <button
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors"
              style={{ background: "#DC3545" }}
            >
              End Live
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 3: Insights ───────────────────────────────────────────────────── */}
    </div>
  );
}
