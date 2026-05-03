import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "@/lib/auth/authUtils";

export interface NotificationTemplateBase {
  id: string;
  key: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate extends NotificationTemplateBase {
  subject: string;
  htmlBody: string;
}

export interface SmsTemplate extends NotificationTemplateBase {
  body: string;
}

export interface PushTemplate extends NotificationTemplateBase {
  title: string;
  body: string;
}

export interface ListParams {
  populate?: string[];
  q?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface ListResponse<T> {
  items: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token =
      authStorage.getAccessToken() || localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const notificationTemplatesApi = createApi({
  reducerPath: "notificationTemplatesApi",
  baseQuery,
  tagTypes: ["EmailTemplate", "SmsTemplate", "PushTemplate"],
  endpoints: (builder) => ({
    // Email Templates
    getEmailTemplates: builder.query<ApiResponse<ListResponse<EmailTemplate>>, ListParams | void>({
      query: (params) => ({
        url: "/admin/notifications/templates/email",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) => {
        const items = result?.data?.items || (result as any)?.items;
        return items
          ? [
              ...items.map(({ id }: { id: string }) => ({ type: "EmailTemplate" as const, id })),
              { type: "EmailTemplate", id: "LIST" },
            ]
          : [{ type: "EmailTemplate", id: "LIST" }];
      },
    }),
    updateEmailTemplate: builder.mutation<ApiResponse<EmailTemplate>, { id: string; body: Partial<EmailTemplate> }>({
      query: ({ id, body }) => ({
        url: `/admin/notifications/templates/email/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "EmailTemplate", id },
        { type: "EmailTemplate", id: "LIST" },
      ],
    }),

    // SMS Templates
    getSmsTemplates: builder.query<ApiResponse<ListResponse<SmsTemplate>>, ListParams | void>({
      query: (params) => ({
        url: "/admin/notifications/templates/sms",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) => {
        const items = result?.data?.items || (result as any)?.items;
        return items
          ? [
              ...items.map(({ id }: { id: string }) => ({ type: "SmsTemplate" as const, id })),
              { type: "SmsTemplate", id: "LIST" },
            ]
          : [{ type: "SmsTemplate", id: "LIST" }];
      },
    }),
    updateSmsTemplate: builder.mutation<ApiResponse<SmsTemplate>, { id: string; body: Partial<SmsTemplate> }>({
      query: ({ id, body }) => ({
        url: `/admin/notifications/templates/sms/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SmsTemplate", id },
        { type: "SmsTemplate", id: "LIST" },
      ],
    }),

    // Push Templates
    getPushTemplates: builder.query<ApiResponse<ListResponse<PushTemplate>>, ListParams | void>({
      query: (params) => ({
        url: "/admin/notifications/templates/push",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) => {
        const items = result?.data?.items || (result as any)?.items;
        return items
          ? [
              ...items.map(({ id }: { id: string }) => ({ type: "PushTemplate" as const, id })),
              { type: "PushTemplate", id: "LIST" },
            ]
          : [{ type: "PushTemplate", id: "LIST" }];
      },
    }),
    updatePushTemplate: builder.mutation<ApiResponse<PushTemplate>, { id: string; body: Partial<PushTemplate> }>({
      query: ({ id, body }) => ({
        url: `/admin/notifications/templates/push/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PushTemplate", id },
        { type: "PushTemplate", id: "LIST" },
      ],
    }),
    sendTestPush: builder.mutation<{ success: number; failure: number; invalidTokens: string[] }, { title: string; body: string; data?: any }>({
      query: (body) => ({
        url: "/notifications/push/test",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetEmailTemplatesQuery,
  useUpdateEmailTemplateMutation,
  useGetSmsTemplatesQuery,
  useUpdateSmsTemplateMutation,
  useGetPushTemplatesQuery,
  useUpdatePushTemplateMutation,
  useSendTestPushMutation,
} = notificationTemplatesApi;
