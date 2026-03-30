export type ConversationStatus = "WAITING" | "OPEN" | "CLOSED";
export type MessageSenderType = "USER" | "ADMIN" | "SYSTEM";
export type MessageType = "TEXT" | "IMAGE" | "VOICE" | "VIDEO";

export interface SupportUser {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  referralCode?: string;
  createdAt?: string;
}

export interface SupportMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: MessageSenderType;
  senderName?: string;
  content: string;
  type: MessageType;
  attachmentUrl?: string;
  createdAt: string;
}

export interface SupportConversation {
  id: string;
  userId: string;
  adminId?: string;
  adminName?: string;
  status: ConversationStatus;
  user?: SupportUser;
  lastMessage?: SupportMessage;
  createdAt: string;
  updatedAt: string;
}

export interface SupportQueueItem extends SupportConversation {
  queuePosition?: number;
}
