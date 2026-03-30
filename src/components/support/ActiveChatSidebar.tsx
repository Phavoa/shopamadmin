"use client";

import React from "react";
import { useGetActiveChatsQuery } from "@/api/supportChatApi";
import { formatDistanceToNow } from "date-fns";
import { User, MessageCircle } from "lucide-react";
import { SupportConversation } from "@/types/support";

interface ActiveChatSidebarProps {
  activeId?: string;
  onSelect: (chat: SupportConversation) => void;
}

export const ActiveChatSidebar: React.FC<ActiveChatSidebarProps> = ({
  activeId,
  onSelect,
}) => {
  const { data: activeChats, isLoading } = useGetActiveChatsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 w-full animate-pulse rounded-[var(--radius-md)] bg-[var(--color-muted)]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-[var(--border)] bg-[var(--color-surface)]">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--color-surface)]">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <MessageCircle size={20} className="text-[var(--primary)]" />
          Conversations
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {!activeChats || activeChats.length === 0 ? (
          <div className="p-8 text-center text-[var(--color-text-secondary)]">
            <p className="text-sm">No active chats.</p>
            <p className="text-xs">Claim a user from the queue to start.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {activeChats.map((chat) => {
              const userName = chat.user
                ? `${chat.user.firstName} ${chat.user.lastName}`
                : "Customer";
              const imageUrl = chat.user?.imageUrl;
              const hasUnread = Math.random() > 0.7; // Placeholder for unread state

              return (
                <button
                  key={chat.id}
                  onClick={() => onSelect(chat)}
                  className={`group relative flex items-center gap-3 rounded-[var(--radius-md)] p-3 text-left transition-all duration-200 cursor-pointer ${
                    activeId === chat.id
                      ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)] font-semibold"
                      : "hover:bg-[var(--color-muted)] text-[var(--color-text-secondary)] active:scale-[0.98]"
                  }`}
                >
                  <div
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      activeId === chat.id
                        ? "bg-[var(--sidebar-primary)] text-white rotate-3 shadow-lg shadow-[var(--sidebar-primary)]/20"
                        : "bg-[var(--primary)]/5 text-[var(--primary)] group-hover:bg-[var(--primary)]/10 shadow-sm border border-[var(--primary)]/10"
                    }`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={userName}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    ) : (
                      <User size={20} strokeWidth={2} />
                    )}
                    <div
                      className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 transition-all ${
                        activeId === chat.id
                          ? "border-[var(--sidebar-accent)] bg-green-400"
                          : "border-white bg-green-500 shadow-sm"
                      }`}
                    />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`truncate text-xs font-black tracking-tight ${activeId === chat.id ? "text-[var(--sidebar-primary)]" : "text-[var(--color-text-primary)]"}`}
                      >
                        {userName}
                      </span>
                      <span
                        className={`text-[9px] font-bold opacity-70 ${
                          activeId === chat.id
                            ? "text-[var(--sidebar-primary)]/70"
                            : "text-[var(--color-text-secondary)]/50"
                        }`}
                      >
                        {formatDistanceToNow(new Date(chat.updatedAt), {
                          addSuffix: false,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`line-clamp-1 text-[10px] truncate font-bold ${
                          activeId === chat.id
                            ? "text-[var(--sidebar-primary)]/80"
                            : "text-[var(--color-text-secondary)]/60"
                        }`}
                      >
                        {chat.lastMessage?.content || "No messages yet..."}
                      </p>
                      {hasUnread && activeId !== chat.id && (
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[8px] font-black text-white shadow-sm shadow-[var(--primary)]/20">
                          1
                        </div>
                      )}
                    </div>
                  </div>

                  {activeId === chat.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-[var(--primary)] rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
