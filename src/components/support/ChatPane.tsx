"use client";

import React, { useEffect, useRef } from "react";
import {
  useGetChatHistoryQuery,
  useCloseChatMutation,
} from "@/api/supportChatApi";
import { format } from "date-fns";
import { SupportConversation, SupportMessage } from "@/types/support";
import {
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  User as UserIcon,
  XCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";

interface ChatPaneProps {
  chat: SupportConversation;
  onClose?: () => void;
  lastReadAt?: string | null;
}

export const ChatPane: React.FC<ChatPaneProps> = ({
  chat,
  onClose,
  lastReadAt,
}) => {
  const {
    data: historyData,
    isLoading,
    isFetching,
  } = useGetChatHistoryQuery(chat.id, {
    pollingInterval: 0, // We rely on WebSockets for real-time updates
  });

  const [closeChat, { isLoading: isClosing }] = useCloseChatMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = historyData || [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleClose = async () => {
    if (
      window.confirm("Are you sure you want to close this support session?")
    ) {
      await closeChat(chat.id);
      if (onClose) onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50/20">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)] opacity-30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] p-4 bg-[var(--color-surface)] backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          {chat.user?.imageUrl ? (
            <div className="h-10 w-10 overflow-hidden rounded-full border border-[var(--border)]">
              <img
                src={chat.user.imageUrl}
                alt={chat.user.firstName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
              <UserIcon size={20} />
            </div>
          )}
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)]">
              {chat.user
                ? `${chat.user.firstName} ${chat.user.lastName}`
                : "Customer Support"}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-green-600 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Live Conversation
            </div>
          </div>
        </div>

        <button
          onClick={handleClose}
          disabled={isClosing}
          className="flex items-center gap-2 rounded-md bg-orange-50 px-4 py-2.5 text-xs font-bold transition-all hover:bg-orange-500 hover:text-white disabled:opacity-50 mr-16 disabled:cursor-not-allowed cursor-pointer"
        >
          {isClosing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <XCircle size={14} />
          )}
          End Session
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-4 bg-[var(--color-surface)]"
      >
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-[var(--color-text-secondary)]/30 group">
            <div className="mb-6 rounded-full bg-[var(--color-muted)] p-10 group-hover:scale-110 group-hover:bg-[var(--primary)]/5 transition-all duration-500">
              <MessageSquare size={60} strokeWidth={1} />
            </div>
            <h4 className="text-xl font-black text-[var(--color-text-primary)] uppercase tracking-tighter italic">
              Silent Channel
            </h4>
            <p className="mt-2 max-w-[240px] text-sm font-medium leading-relaxed">
              No messages have been exchanged in this session yet. Break the
              ice!
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderType === "ADMIN";
            const isSystem = msg.senderType === "SYSTEM";

            // Date Grouping Logic
            const showDateHeader =
              idx === 0 ||
              format(new Date(messages[idx - 1].createdAt), "yyyy-MM-dd") !==
                format(new Date(msg.createdAt), "yyyy-MM-dd");

            if (isSystem) {
              const isCustomerOnly =
                /currently \d+th in the queue/i.test(msg.content) ||
                /make sure you have your order ID/i.test(msg.content) ||
                /Please wait while a moderator joins/i.test(msg.content);

              if (isCustomerOnly) return null;

              return (
                <div
                  key={msg.id}
                  className="flex justify-center p-2 animate-in fade-in slide-in-from-bottom-1 duration-500"
                >
                  <span className="rounded-full bg-[var(--color-muted)] border border-[var(--border)] px-4 py-1.5 text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.1em] shadow-sm">
                    {msg.content}
                  </span>
                </div>
              );
            }

            const isRead =
              isMe &&
              lastReadAt &&
              new Date(msg.createdAt) <= new Date(lastReadAt);

            return (
              <React.Fragment key={msg.id}>
                {showDateHeader && (
                  <div className="flex items-center gap-4 py-4">
                    <div className="h-px flex-1 bg-[var(--border)]" />
                    <span className="text-[10px] font-black text-[var(--color-text-secondary)]/40 uppercase tracking-[0.2em]">
                      {format(new Date(msg.createdAt), "MMMM d, yyyy")}
                    </span>
                    <div className="h-px flex-1 bg-[var(--border)]" />
                  </div>
                )}
                <div
                  className={`flex w-full group ${isMe ? "justify-end" : "justify-start"} animate-in ${isMe ? "slide-in-from-right-4" : "slide-in-from-left-4"} duration-300`}
                >
                  <div
                    className={`flex max-w-[85%] flex-col gap-1.5 ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`relative px-4 py-2.5 text-[14px] shadow-sm transition-all duration-300 ${
                        isMe
                          ? "bg-[var(--primary)] text-white rounded-2xl rounded-br-sm hover:shadow-md hover:shadow-[var(--primary)]/20"
                          : "bg-white text-[var(--color-text-primary)] border border-[var(--border)] rounded-2xl rounded-bl-sm hover:shadow-md hover:shadow-black/5"
                      }`}
                    >
                      {msg.type === "IMAGE" && msg.attachmentUrl && (
                        <div className="mb-3 -mx-2 -mt-1 overflow-hidden rounded-lg border border-black/5">
                          <img
                            src={msg.attachmentUrl}
                            alt="attachment"
                            className="max-h-80 rounded-lg object-contain cursor-zoom-in hover:scale-[1.02] transition-transform"
                            onClick={() =>
                              window.open(msg.attachmentUrl, "_blank")
                            }
                          />
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-relaxed font-medium">
                        {msg.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 px-1 transition-all">
                      <span className="text-[10px] font-bold text-[var(--color-text-secondary)]/40 tabular-nums">
                        {format(new Date(msg.createdAt), "HH:mm")}
                      </span>
                      {isMe && (
                        <div className="flex items-center gap-1">
                          <div
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${isRead ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400 opacity-60"}`}
                          >
                            <CheckCircle size={8} strokeWidth={4} />
                            {isRead ? "Seen" : "Sent"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};
