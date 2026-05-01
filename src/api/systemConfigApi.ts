import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "@/lib/auth/authUtils";

export interface SystemConfig {
  key: string;
  value: string;
  updatedAt: string;
}

export interface ListSystemConfigsParams {
  populate?: string[];
  q?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

export interface ListSystemConfigsResponse {
  items: SystemConfig[];
  nextCursor: string | null;
  prevCursor: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
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

export const systemConfigApi = createApi({
  reducerPath: "systemConfigApi",
  baseQuery,
  tagTypes: ["SystemConfig"],
  endpoints: (builder) => ({
    getSystemConfigs: builder.query<ApiResponse<ListSystemConfigsResponse>, ListSystemConfigsParams | void>({
      query: (params) => ({
        url: "/admin/system-config",
        method: "GET",
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ key }) => ({
                type: "SystemConfig" as const,
                id: key,
              })),
              { type: "SystemConfig" as const, id: "LIST" },
            ]
          : [{ type: "SystemConfig" as const, id: "LIST" }],
    }),

    getSystemConfigByKey: builder.query<ApiResponse<SystemConfig>, string>({
      query: (key) => ({
        url: `/admin/system-config/${key}`,
        method: "GET",
      }),
      providesTags: (result, error, key) => [
        { type: "SystemConfig", id: key },
      ],
    }),

    updateSystemConfig: builder.mutation<ApiResponse<SystemConfig>, { key: string; value: string }>({
      query: ({ key, value }) => ({
        url: `/admin/system-config/${key}`,
        method: "PUT",
        body: { value },
      }),
      invalidatesTags: (result, error, { key }) => [
        { type: "SystemConfig", id: key },
        { type: "SystemConfig", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSystemConfigsQuery,
  useGetSystemConfigByKeyQuery,
  useUpdateSystemConfigMutation,
} = systemConfigApi;
