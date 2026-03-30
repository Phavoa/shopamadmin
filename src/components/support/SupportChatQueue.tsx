"use client";

import React, { useState } from "react";
import { useGetQueueQuery, useClaimChatMutation } from "@/api/supportChatApi";
import { formatDistanceToNow } from "date-fns";
import {
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Timer,
  Loader2,
} from "lucide-react";

export const SupportChatQueue: React.FC = () => {
  const { data: queueData, isLoading, isError } = useGetQueueQuery();
  const [claimChat, { isLoading: isClaiming }] = useClaimChatMutation();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    try {
      await claimChat(id).unwrap();
    } catch (err) {
      console.error("Failed to claim chat:", err);
    } finally {
      setClaimingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 w-full animate-pulse rounded-xl bg-gray-50"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-40 items-center justify-center text-red-500 font-bold bg-red-50 m-4 rounded-xl border border-red-100 italic">
        <AlertCircle className="mr-2" size={20} />
        Queue Synchronization Error
      </div>
    );
  }

  const queue = queueData || [];

  if (queue.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-[var(--color-text-secondary)]">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-500 shadow-inner">
          <CheckCircle size={40} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter italic">Zero Backlog</h3>
        <p className="mt-2 max-w-[200px] text-sm font-medium leading-relaxed opacity-60">
          Excellent! All customer inquiries are currently handled.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--color-muted)]/30">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)]/60">
          WAITING QUEUE
        </h2>
        <span className="rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm shadow-[var(--primary)]/20">
          {queue.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
        <div className="flex flex-col gap-3">
          {queue.map((item) => {
            const userName = item.user ? `${item.user.firstName} ${item.user.lastName}` : "Guest Customer";
            const waitTime = Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 60000);
            
            // Pro Color Coding for Urgency
            const urgencyColor = waitTime < 5 ? "bg-green-500" : waitTime < 15 ? "bg-amber-500" : "bg-red-500";

            return (
              <div
                key={item.id}
                className="group relative flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-4 transition-all duration-300 hover:border-[var(--primary)]/30 hover:shadow-xl hover:shadow-black/[0.03]"
              >
                {/* Urgency Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-t-[var(--radius-lg)] bg-gray-50">
                   <div 
                      className={`h-full ${urgencyColor} transition-all duration-1000`} 
                      style={{ width: `${Math.min(100, (waitTime / 20) * 100)}%` }} 
                   />
                </div>

                <div className="flex items-start justify-between mt-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-white shadow-sm overflow-hidden ${urgencyColor} text-lg`}>
                      {item.user?.imageUrl ? (
                        <img 
                          src={item.user.imageUrl} 
                          alt={userName} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        userName[0]
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-black text-[var(--color-text-primary)] leading-tight tracking-tight">
                        {userName}
                      </h4>
                      <p className="text-[10px] font-bold text-[var(--color-text-secondary)]/40 uppercase tracking-tighter mt-0.5">
                        ID: {item.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50`}>
                     <Clock size={14} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Message Preview */}
                <div className="rounded-[var(--radius-md)] bg-[var(--color-muted)]/50 p-3 border border-[var(--border)]/50">
                  <p className="line-clamp-2 text-[11px] leading-relaxed text-[var(--color-text-secondary)] font-medium">
                    <span className="font-black text-[var(--color-text-secondary)]/30 mr-1 italic uppercase text-[9px] tracking-widest">
                      Inquiry:
                    </span>
                    {item.lastMessage?.content || "Customer has joined the queue and is waiting for a response..."}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 mt-1">
                   <div className="flex items-center gap-2">
                      <div className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${urgencyColor} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${urgencyColor}`}></span>
                      </div>
                      <span className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest">
                        {waitTime}m <span className="text-[var(--color-text-secondary)]/50">waiting</span>
                      </span>
                   </div>
                   
                   <button
                    onClick={() => handleClaim(item.id)}
                    disabled={claimingId === item.id}
                    className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest transition-all hover:bg-[var(--color-primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/20 active:scale-95 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
                  >
                    {claimingId === item.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <CheckCircle size={12} strokeWidth={3} />
                    )}
                    Claim
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
