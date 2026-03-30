"use client";

import React, { useState, useRef } from "react";
import { Send, Image as ImageIcon, Loader2, X, AlertCircle } from "lucide-react";
import { useUploadFileMutation } from "@/api/filesApi";

interface MessageInputProps {
  onSendMessage: (content: string, type: "TEXT" | "IMAGE", attachmentUrl?: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
}) => {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile] = useUploadFileMutation();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, "TEXT");
      setMessage("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadFile({ file, prefix: "support" }).unwrap();
      if (response.data?.url) {
        onSendMessage("Image attachment", "IMAGE", response.data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-[var(--border)] bg-[var(--color-surface)] p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
      {/* Pro Utility Bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-1.5 text-[10px] font-black text-[var(--color-text-secondary)]/50 uppercase tracking-widest hover:text-[var(--primary)] transition-all">
              <ImageIcon size={14} />
              Images
           </button>
           <div className="h-3 w-px bg-[var(--border)]" />
           <button className="flex items-center gap-1.5 text-[10px] font-black text-[var(--color-text-secondary)]/50 uppercase tracking-widest hover:text-[var(--primary)] transition-all">
              <AlertCircle size={14} />
              Canned Replies
           </button>
        </div>
        
        {!disabled && (
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-ping" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">
               Live Sync
            </span>
          </div>
        )}
      </div>

      <div className={`relative flex items-end gap-3 transition-all p-2 rounded-[var(--radius-lg)] border ring-4 ring-transparent ${
        disabled ? "bg-[var(--color-muted)] border-[var(--border)] opacity-60" : "bg-white border-[var(--border)] shadow-xl shadow-black/[0.02] focus-within:border-[var(--primary)]/50 focus-within:shadow-[var(--primary)]/5 focus-within:ring-[var(--primary)]/5"
      }`}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)]/50 text-[var(--color-text-secondary)] transition-all hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] disabled:opacity-30"
        >
          {uploading ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} strokeWidth={2.5} />}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={disabled ? "Attempting to restore connection..." : "Compose a message..."}
          disabled={disabled || uploading}
          autoFocus
          className="max-h-32 w-full resize-none border-none bg-transparent py-2.5 px-1 text-[13px] font-medium text-[var(--color-text-primary)] focus:ring-0 placeholder:text-[var(--color-text-secondary)]/30 custom-scrollbar disabled:cursor-not-allowed leading-relaxed"
        />

        <button
          onClick={handleSend}
          disabled={disabled || uploading || !message.trim()}
          className={`group flex h-10 w-44 shrink-0 items-center justify-center gap-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all ${
            disabled || uploading || !message.trim()
              ? "bg-gray-200 shadow-none"
              : "bg-[var(--primary)] shadow-[var(--primary)]/20 hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          <Send size={14} fill="currentColor" />
          Transmit
          <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:animate-pulse pointer-events-none" />
        </button>
      </div>

      {disabled && !uploading && (
        <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-black text-red-500 uppercase tracking-[0.2em] animate-pulse">
          <AlertCircle size={12} />
          Network Unstable • Reconnecting Websocket
        </div>
      )}
    </div>
  );
};
