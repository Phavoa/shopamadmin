import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "@/lib/auth/authUtils";

export interface AppVersionPolicy {
  id: string;
  platform: "ios" | "android";
  latestBuildNumber: number;
  softUpdateBuildNumber: number;
  minimumSupportedBuildNumber: number;
  forceMessage: string;
  softMessage: string;
  storeUrl: string;
  uxMetadata: Record<string, any>;
  isActive: boolean;
  isMaintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
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

export const appVersionsApi = createApi({
  reducerPath: "appVersionsApi",
  baseQuery,
  tagTypes: ["AppVersionPolicy", "Maintenance"],
  endpoints: (builder) => ({
    getAppVersionPolicies: builder.query<any, "ios" | "android">({
      query: (platform) => ({
        url: `/admin/app-version-policies?platform=${platform}`,
        method: "GET",
      }),
      providesTags: ["AppVersionPolicy", "Maintenance"],
    }),

    deployAppVersionPolicy: builder.mutation<ApiResponse<any>, Partial<AppVersionPolicy>>({
      query: (body) => ({
        url: `/admin/app-version-policies`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AppVersionPolicy"],
    }),

    rollbackAppVersionPolicy: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/admin/app-version-policies/rollback/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["AppVersionPolicy"],
    }),

    toggleMaintenanceMode: builder.mutation<ApiResponse<any>, { platform: "ios" | "android", isMaintenanceMode: boolean, message?: string }>({
      query: (body) => ({
        url: `/admin/app-version-policies/maintenance`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Maintenance"],
    }),
  }),
});

export const {
  useGetAppVersionPoliciesQuery,
  useDeployAppVersionPolicyMutation,
  useRollbackAppVersionPolicyMutation,
  useToggleMaintenanceModeMutation,
} = appVersionsApi;
