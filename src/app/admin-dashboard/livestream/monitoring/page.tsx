"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGetLiveStreamsQuery } from "@/api/liveStreamApi";
import { Play, Calendar, User, Loader2, AlertCircle } from "lucide-react";

export default function LiveMonitoringPage() {
  const router = useRouter();

  // Fetch only currently LIVE streams
  const { data, isLoading, error } = useGetLiveStreamsQuery(
    {
      status: "LIVE",
    },
    {
      pollingInterval: 30000, // Poll every 30s to keep list fresh
    },
  );

  const liveStreams = data?.data.items || [];

  const handleStreamClick = (streamId: string) => {
    router.push(`/admin-dashboard/livestream/monitoring/${streamId}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-red-500">
        <AlertCircle className="mb-2 h-10 w-10" />
        <p>Failed to load live streams. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pt-6 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Live Monitoring</h1>
        <p className="text-gray-500 mt-1">
          Select a live stream to monitor its status and activity.
        </p>
      </div>

      {liveStreams.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="bg-gray-100 p-4 rounded-full mb-3">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No Active Livestreams
          </h3>
          <p className="text-gray-500 max-w-sm text-center mt-1">
            There are currently no streams with LIVE status. Scheduled streams
            will appear here when they go live.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveStreams.map((stream) => (
            <div
              key={stream.id}
              onClick={() => handleStreamClick(stream.id)}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Thumbnail / Preview Area */}
              <div className="relative h-48 bg-gray-900 flex items-center justify-center">
                {/* Fallback pattern or actual thumbnail if available */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>

                <div className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-white ml-1" fill="white" />
                </div>

                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  LIVE
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
                  {stream.title || "Untitled Stream"}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <User className="h-3.5 w-3.5" />
                  <span>
                    {stream.seller
                      ? `${stream.seller.firstName} ${stream.seller.lastName}`
                      : "Unknown Seller"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Started:{" "}
                      {stream.startedAt
                        ? new Date(stream.startedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  {/* Placeholder for viewer count if API doesn't provide it yet */}
                  {/* <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Viewers: -</span>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
