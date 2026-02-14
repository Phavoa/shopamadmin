import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Radio } from "lucide-react";

import { LiveStream } from "@/api/liveStreamApi";

type LiveStreamsCardProps = {
  streams?: LiveStream[];
  isLoading?: boolean;
};

function LiveStreamSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between py-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-16 px-[10px] py-[4px] rounded-full" />
            <Skeleton className="h-8 w-16 px-3 rounded-[var(--radius-sm)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyLiveStreams() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50/50 rounded-lg border-dashed border border-gray-200">
      <div className="bg-white p-3 rounded-full shadow-sm mb-4">
        <Radio className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        No Active Streams
      </h3>
      <p className="text-sm text-gray-500 max-w-[200px]">
        When sellers go live, their streams will appear here instantly.
      </p>
    </div>
  );
}

function LiveStreamsCard({ streams = [], isLoading }: LiveStreamsCardProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] h-[400px] flex flex-col">
      <div className="p-[var(--space-lg)] pb-4 border-b border-[var(--border)] shrink-0">
        <h2 className="text-xl font-semibold leading-[var(--text-h2-line)] text-black flex items-center gap-2">
          Live Livestreams
          {!isLoading && streams.length > 0 && (
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {streams.length}
            </span>
          )}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-[var(--space-lg)] pt-2">
        {isLoading ? (
          <LiveStreamSkeleton />
        ) : streams.length === 0 ? (
          <EmptyLiveStreams />
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {streams.map((s) => (
              <li
                key={s.id}
                className="py-6 flex items-center justify-between first:pt-4 last:pb-2"
              >
                <div>
                  <div className="text-base font-medium text-black leading-[var(--text-body-lg-line)]">
                    {s.title}
                  </div>
                  <div className="text-sm text-gray-600 leading-[var(--text-caption-line)] mt-1">
                    {s.tier?.name}
                    {s.seller && (
                      <span className="text-xs text-gray-400 block mt-0.5">
                        by {s.seller.firstName} {s.seller.lastName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#CFFAE6] text-[#066A47] border-0 px-[10px] py-[4px] rounded-full text-[var(--text-caption-size)] font-[var(--text-caption-weight)] flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#066A47] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#066A47]"></span>
                    </span>
                    Live
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                    onClick={() => alert(`${s.title} — view clicked`)}
                  >
                    View
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export { LiveStreamsCard };
