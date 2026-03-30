import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import type { 
  SupportConversation, 
  SupportMessage, 
  SupportQueueItem 
} from "../types/support";
import { authStorage } from "@/lib/auth/authUtils";
import { setCredentials, clearCredentials } from "../features/auth/authSlice";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = authStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2],
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult?.data && typeof refreshResult.data === "object") {
          const refreshData = refreshResult.data as {
            accessToken: string;
            refreshToken?: string;
          };

          authStorage.setTokens(
            refreshData.accessToken,
            refreshData.refreshToken,
          );
          
          api.dispatch(
            setCredentials({
              accessToken: refreshData.accessToken,
              refreshToken: refreshData.refreshToken,
            }),
          );

          result = await baseQuery(args, api, extraOptions);
          return result;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }

    if (result?.error?.status === 401) {
      authStorage.clearTokens();
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const supportChatApi = createApi({
  reducerPath: "supportChatApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["SupportChat", "SupportQueue"],
  endpoints: (builder) => ({
    // Get the queue of waiting users
    getQueue: builder.query<SupportQueueItem[], void>({
      query: () => ({
        url: "/support-chat/queue",
        method: "GET",
        params: { populate: "user" },
      }),
      transformResponse: (response: any) => {
        if (response.data?.items) return response.data.items;
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ["SupportQueue"],
    }),

    // Get active chats for the current admin
    getActiveChats: builder.query<SupportConversation[], void>({
      query: () => ({
        url: "/support-chat/active",
        method: "GET",
        params: { populate: "user" },
      }),
      transformResponse: (response: any) => {
        if (response.data?.items) return response.data.items;
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ["SupportChat"],
    }),

    // Get chat history for a specific conversation
    getChatHistory: builder.query<SupportMessage[], string>({
      query: (conversationId) => ({
        url: `/support-chat/history/${conversationId}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (response.data?.items) return response.data.items;
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: (result, error, id) => [{ type: "SupportChat", id }],
    }),

    // Get a specific conversation by ID
    getChatById: builder.query<SupportConversation, string>({
      query: (id) => ({
        url: `/support-chat/${id}`,
        method: "GET",
        params: { populate: "user" },
      }),
      providesTags: (result, error, id) => [{ type: "SupportChat", id }],
    }),

    // Claim a conversation from the queue
    claimChat: builder.mutation<SupportConversation, string>({
      query: (conversationId) => ({
        url: `/support-chat/claim/${conversationId}`,
        method: "POST",
      }),
      invalidatesTags: ["SupportQueue", "SupportChat"],
    }),

    // Close a conversation
    closeChat: builder.mutation<{ ok: boolean }, string>({
      query: (conversationId) => ({
        url: `/support-chat/close/${conversationId}`,
        method: "POST",
      }),
      invalidatesTags: ["SupportChat", "SupportQueue"],
    }),

    // Transfer a conversation
    transferChat: builder.mutation<{ ok: boolean }, { conversationId: string; newAdminId: string }>({
      query: (body) => ({
        url: `/support-chat/transfer`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["SupportChat", "SupportQueue"],
    }),

    // Get archived/all conversations
    getArchiveChats: builder.query<SupportConversation[], Record<string, any> | void>({
      query: (params) => ({
        url: "/support-chat/all",
        method: "GET",
        params: { populate: "user", ...(params || {}) },
      }),
      transformResponse: (response: any) => {
        if (response.data?.items) return response.data.items;
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ["SupportChat"],
    }),
  }),
});

export const {
  useGetQueueQuery,
  useGetActiveChatsQuery,
  useGetChatHistoryQuery,
  useGetChatByIdQuery,
  useClaimChatMutation,
  useCloseChatMutation,
  useTransferChatMutation,
  useGetArchiveChatsQuery,
} = supportChatApi;
