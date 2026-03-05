import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "@/lib/auth/authUtils";

// ─── Types based on documentation ───────────────────────────────────────────

export interface FeeConfig {
  walletFeeKobo: string;
  withdrawalFeeKobo: string;
  subscriptionFeeKobo: string;
  subscriptionEnabled: boolean;
  referralEnabled: boolean;
  effectiveFrom: string;
  gracePeriodDays: number;
  whoCanPublish: string;
  draft: any;
}

export interface SaveFeeConfigRequest {
  walletFeeKobo: number;
  withdrawalFeeKobo: number;
  subscriptionFeeKobo: number;
  subscriptionEnabled: boolean;
  referralEnabled: boolean;
  gracePeriodDays: number;
  whoCanPublish: string;
}

export interface PublishFeeConfigRequest {
  effectiveFrom: string;
  isFinanceAdmin: boolean;
}

export interface SimulateRevenueParams {
  expectedMonthlyGmvKobo: string;
  splitShoppingPercent?: number;
  splitLivestreamPercent?: number;
  avgCommissionPercent?: number;
  estimatedMonthlyWithdrawals?: number;
  estimatedNewUsers?: number;
}

export interface SimulationResult {
  projectedPlatformRevenueKobo: string;
  shoppingGmvPortionKobo: string;
  projectedPayoutFeesKobo: string;
  // Based on UI screenshot/needs, might need more fields if API returns them
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = authStorage.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST", body: { refreshToken } },
          api,
          extraOptions
        );
        if (refreshResult?.data && typeof refreshResult.data === "object") {
          const refreshData = refreshResult.data as {
            accessToken: string;
            refreshToken?: string;
          };
          authStorage.setTokens(refreshData.accessToken, refreshData.refreshToken);
          result = await baseQuery(args, api, extraOptions);
          return result;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }
    if (result?.error?.status === 401) {
      authStorage.clearTokens();
    }
  }

  return result;
};

// ─── Fee Configuration API Slice ─────────────────────────────────────────────

export const feeConfigApi = createApi({
  reducerPath: "feeConfigApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["FeeConfig"],
  endpoints: (builder) => ({
    // GET /api/admin/fee-config
    getFeeConfig: builder.query<ApiResponse<FeeConfig>, void>({
      query: () => ({
        url: "/admin/fee-config",
        method: "GET",
      }),
      providesTags: ["FeeConfig"],
    }),

    // PATCH /api/admin/fee-config
    saveDraft: builder.mutation<ApiResponse<any>, SaveFeeConfigRequest>({
      query: (body) => ({
        url: "/admin/fee-config",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["FeeConfig"],
    }),

    // POST /api/admin/fee-config/publish
    publishConfig: builder.mutation<ApiResponse<any>, PublishFeeConfigRequest>({
      query: (body) => ({
        url: "/admin/fee-config/publish",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FeeConfig"],
    }),

    // GET /api/admin/fee-config/simulate
    simulateRevenue: builder.query<ApiResponse<SimulationResult>, SimulateRevenueParams>({
      query: (params) => ({
        url: "/admin/fee-config/simulate",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetFeeConfigQuery,
  useSaveDraftMutation,
  usePublishConfigMutation,
  useSimulateRevenueQuery,
  useLazySimulateRevenueQuery,
} = feeConfigApi;
