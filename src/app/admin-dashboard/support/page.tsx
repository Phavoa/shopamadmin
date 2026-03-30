"use client";

import React, { useState } from "react";
import { SupportChatQueue } from "@/components/support/SupportChatQueue";
import { ActiveChatSidebar } from "@/components/support/ActiveChatSidebar";
import { ChatPane } from "@/components/support/ChatPane";
import { MessageInput } from "@/components/support/MessageInput";
import { useSupportChat } from "@/hooks/useSupportChat";
import { SupportConversation } from "@/types/support";
import { Headphones, Users, MessageSquare, LayoutGrid, Info, Layout } from "lucide-react";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { useEffect } from "react";
import { UserDetailsPanel } from "@/components/support/UserDetailsPanel";

export default function SupportDashboard() {
  const [selectedChat, setSelectedChat] = useState<SupportConversation | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "queue">("active");
  const [showDetails, setShowDetails] = useState(true);

  const dispatch = useDispatch();
  const { isConnected, sendMessage, markAsRead, lastReadAt } = useSupportChat(selectedChat?.id);

  useEffect(() => {
    dispatch(setHeaderTitle("Support Chat"));
  }, [dispatch]);

  const handleSendMessage = (content: string, type: "TEXT" | "IMAGE", attachmentUrl?: string) => {
    if (selectedChat) {
      sendMessage({
        conversationId: selectedChat.id,
        content,
        type,
        attachmentUrl,
      });
    }
  };

  const handleSelectChat = (chat: SupportConversation) => {
    setSelectedChat(chat);
    markAsRead(chat.id);
  };

  return (
    <div className="flex h-[calc(100vh-var(--header-height)-var(--space-lg))] w-full overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] shadow-[var(--shadow-level1)] mt-2">
      {/* 1. Unified Navigation Panel (Left) */}
      <div className="flex w-80 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20">
              <Headphones size={18} />
            </div>
            <h1 className="text-base font-black text-[var(--color-text-primary)] tracking-tighter uppercase">Support</h1>
          </div>
          <div className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-200" title="System Online" />
        </div>

        {/* Filter Tabs */}
        <div className="flex p-3 gap-0.5 bg-[var(--color-muted)]/50 m-3 rounded-[var(--radius-md)] border border-[var(--border)]/50">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "active"
                ? "bg-white text-[var(--primary)] shadow-sm shadow-black/5"
                : "text-[var(--color-text-secondary)]/60 hover:text-[var(--color-text-primary)]"
            }`}
          >
            <MessageSquare size={12} strokeWidth={3} />
            My Chats
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "queue"
                ? "bg-white text-[var(--primary)] shadow-sm shadow-black/5"
                : "text-[var(--color-text-secondary)]/60 hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Users size={12} strokeWidth={3} />
            Incoming
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === "active" ? (
            <ActiveChatSidebar
              activeId={selectedChat?.id}
              onSelect={handleSelectChat}
            />
          ) : (
            <SupportChatQueue />
          )}
        </div>
        
        <div className="p-4 border-t border-[var(--border)] bg-white/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
              <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} shadow-sm`} />
              {isConnected ? "Connected" : "Disconnected"}
            </div>
            <button className="p-1 px-2 rounded-md border border-[var(--border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-all">
               <Info size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Focused Workspace (Middle) */}
      <div className="flex flex-1 flex-col bg-[var(--color-surface)] relative">
        {selectedChat ? (
          <>
            {/* Context Header */}
            <div className="absolute top-4 right-4 z-20">
               <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className={`p-2 rounded-xl border transition-all ${showDetails ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20" : "bg-white border-[var(--border)] text-[var(--color-text-secondary)] shadow-sm hover:border-[var(--primary)] hover:text-[var(--primary)]"}`}
               >
                  <Layout size={18} />
               </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatPane 
                chat={selectedChat} 
                onClose={() => setSelectedChat(null)} 
                lastReadAt={lastReadAt}
              />
            </div>
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={!isConnected}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-[var(--color-text-secondary)] space-y-6">
            <div className="relative">
              <div className="absolute inset-0 scale-[1.5] bg-[var(--primary)]/5 blur-3xl rounded-full" />
              <div className="relative p-12 rounded-[var(--radius-lg)] bg-[var(--color-muted)]/30 text-[var(--primary)]/20">
                <LayoutGrid size={100} strokeWidth={1} />
              </div>
            </div>
            <div className="max-w-sm">
              <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-2 tracking-tighter uppercase italic">Ready for Response</h2>
              <p className="text-sm leading-relaxed">
                Your support workspace is primed. Focus on active inquiries or claim a new customer from the queue to start helping.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. User Intelligence Panel (Right) */}
      {selectedChat && showDetails && (
        <div className="w-[340px] shrink-0 h-full border-l border-[var(--border)]">
           <UserDetailsPanel chat={selectedChat} />
        </div>
      )}
    </div>
  );
}
