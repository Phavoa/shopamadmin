import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { authStorage } from "@/lib/auth/authUtils";
import type { SupportMessage, MessageType } from "@/types/support";
import { supportChatApi } from "@/api/supportChatApi";
import { useDispatch } from "react-redux";
import { useNotifications } from "./useNotifications";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://shapam-ecomerce-backend.onrender.com/api";

const resolveWsUrl = (apiUrl: string) => {
  try {
    const url = new URL(apiUrl.trim());
    // Remove the /api suffix if it exists in the pathname
    const pathname = url.pathname.replace(/\/api\/?$/, "");
    return `${url.protocol}//${url.host}${pathname}`;
  } catch (e) {
    return apiUrl.trim().replace(/\/api\/?$/, "");
  }
};

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || resolveWsUrl(API_URL);

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  type: MessageType;
  attachmentUrl?: string;
}

export function useSupportChat(conversationId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastReadAt, setLastReadAt] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { showInfo } = useNotifications();

  useEffect(() => {
    const token = authStorage.getAccessToken();
    if (!token) return;

    if (!socketRef.current) {
      console.log("Initializing Support WebSocket connection...");
      console.log("- URL:", WS_URL);
      console.log("- Token Present:", !!token);
      console.log("- Token (first 5 chars):", token.substring(0, 5) + "...");

      const socket = io(WS_URL, {
        auth: { token },
        query: { token }, // Fallback for some server configurations
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 20000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to Support WebSocket");
        socket.emit("join_admins");
      });

      socket.on("connect_error", (err) => {
        console.error("Support WebSocket Connection Error (connect_error):", err.message);
        console.error("Error Details:", err);
        setIsConnected(false);
      });

      socket.on("error", (err) => {
        console.error("Support WebSocket General Error (error):", err);
      });

      socket.on("reconnect_attempt", (attempt) => {
        console.log("Support WebSocket Attempting reconnection...", attempt);
      });

      socket.on("reconnect_error", (err) => {
        console.error("Support WebSocket Reconnection Error:", err.message);
      });

      socket.on("disconnect", (reason) => {
        setIsConnected(false);
        console.log("Disconnected from Support WebSocket. Reason:", reason);
        if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, you need to reconnect manually
          socket.connect();
        }
      });

      socket.on("support_queue_updated", () => {
        showInfo("Support queue updated", { duration: 3000 });
        dispatch(supportChatApi.util.invalidateTags(["SupportQueue"]) as any);
      });

      socket.on("support_msg", (message: SupportMessage) => {
        dispatch(
          supportChatApi.util.updateQueryData(
            "getChatHistory",
            message.conversationId,
            (draft) => {
              if (draft && Array.isArray(draft)) {
                if (!draft.some((m: SupportMessage) => m.id === message.id)) {
                  draft.push(message);
                }
              }
            }
          ) as any
        );
        dispatch(supportChatApi.util.invalidateTags(["SupportChat"]) as any);
      });
    }

    return () => {
      // We only disconnect if the hook itself is unmounted or if we explicitly want to
      // For now, let's keep it connected to avoid flickering
    };
  }, [dispatch]);

  // Separate effect for joining conversation rooms
  useEffect(() => {
    const socket = socketRef.current;
    if (socket && isConnected && conversationId) {
      socket.emit("join_support", { conversationId });
      
      const handleRead = ({ conversationId: cid, readAt }: { conversationId: string, readAt: string }) => {
        if (cid === conversationId) {
          setLastReadAt(readAt);
        }
      };

      const handleTransferred = ({ conversationId: cid, newAdminId }: { conversationId: string, newAdminId: string }) => {
        if (cid === conversationId) {
          dispatch(supportChatApi.util.invalidateTags(["SupportChat"]) as any);
        }
      };

      socket.on("support_read", handleRead);
      socket.on("support_transferred", handleTransferred);

      return () => {
        socket.off("support_read", handleRead);
        socket.off("support_transferred", handleTransferred);
        // Optional: socket.emit("leave_support", { conversationId });
      };
    }
  }, [conversationId, isConnected, dispatch]);

  // Global socket cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = useCallback((payload: SendMessagePayload) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("send_support_msg", payload);
    }
  }, [isConnected]);

  const markAsRead = useCallback((conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("support_mark_read", { conversationId });
    }
  }, [isConnected]);

  return {
    isConnected,
    sendMessage,
    markAsRead,
    lastReadAt,
  };
}
