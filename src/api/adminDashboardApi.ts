import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "@/lib/auth/authUtils";

// ─── Types based on actual API response ──────────────────────────────────────

export interface FinancialStats {
  gmv: {
    today: string;
    yesterday: string;
    percentChange: number;
  };
  orders: {
    today: number;
    yesterday: number;
    percentChange: number;
  };
  livestreams: {
    activeCount: number;
    totalViewers: number;
  };
  shopamRevenue: {
    total: string;
    breakdown: {
      tier1_6pct: string;
      tier2_5pct: string;
      tier3_4pct: string;
    };
  };
  escrowBalance: string;
  payoutsPending: string;
  vatRevenue: string;
  livestreamRevenue: {
    totalAmount: string;
    totalSellersPaid: number;
  };
}

// ─── Base setup (mirrors adminApi pattern) ────────────────────────────────────

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
  extraOptions: Parameters<typeof baseQuery>[2],
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST", body: { refreshToken } },
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
          // Sync with localStorage for compatibility
          localStorage.setItem("authToken", refreshData.accessToken);
          if (refreshData.refreshToken) {
            localStorage.setItem("refreshToken", refreshData.refreshToken);
          }
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

// ─── Admin Dashboard API Slice ────────────────────────────────────────────────

export const adminDashboardApi = createApi({
  reducerPath: "adminDashboardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["FinancialStats"],
  endpoints: (builder) => ({
    // GET /api/admin/dashboard/financials
    getFinancialStats: builder.query<ApiResponse<FinancialStats>, void>({
      query: () => ({
        url: "/admin/dashboard/financials",
        method: "GET",
      }),
      providesTags: ["FinancialStats"],
    }),
  }),
});

export const { useGetFinancialStatsQuery, useLazyGetFinancialStatsQuery } =
  adminDashboardApi;
