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

// ─── Finance Overview VM (endpoint 20) ───────────────────────────────────────

export type FinanceOverviewPeriod = "today" | "week" | "month" | "year" | "all" | "custom";

export interface FinanceOverviewParams {
  period?: FinanceOverviewPeriod;
  from?: string; // ISO date, for custom period
  to?: string;   // ISO date, for custom period
}

export interface TrendPoint {
  label: string;
  value: string; // amount in kobo
}

export interface FinanceAlert {
  type: string;
  title: string;
  subtitle: string;
  actionLabel: string;
}

export interface FinanceOverviewVM {
  gmvToday: {
    amount: string;
    percentChange: number;
    comparedToLabel: string;
  };
  escrowBalance: {
    amount: string;
    subtitle: string;
  };
  payoutsProcessed: {
    count: number;
    totalAmount: string;
    periodLabel: string;
  };
  shopamRevenue: {
    amount: string;
    subtitle: string;
  };
  revenueTrend: TrendPoint[];   // daily/weekly data points for the bar chart
  payoutVolume: TrendPoint[];   // weekly payout volume data
  alerts: FinanceAlert[];
}

// ─── Base setup ───────────────────────────────────────────────────────────────

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

// ─── Admin Dashboard API Slice ────────────────────────────────────────────────

export const adminDashboardApi = createApi({
  reducerPath: "adminDashboardApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["FinancialStats", "FinanceOverview"],
  endpoints: (builder) => ({

    // GET /api/admin/dashboard/financials
    getFinancialStats: builder.query<ApiResponse<FinancialStats>, void>({
      query: () => ({
        url: "/admin/dashboard/financials",
        method: "GET",
      }),
      providesTags: ["FinancialStats"],
    }),

    // GET /api/admin/dashboard/finance-overview  (endpoint 20)
    getFinanceOverview: builder.query<ApiResponse<FinanceOverviewVM>, FinanceOverviewParams>({
      query: (params = {}) => ({
        url: "/admin/dashboard/finance-overview",
        method: "GET",
        params,
      }),
      providesTags: ["FinanceOverview"],
    }),

  }),
});

export const {
  useGetFinancialStatsQuery,
  useLazyGetFinancialStatsQuery,
  useGetFinanceOverviewQuery,
  useLazyGetFinanceOverviewQuery,
} = adminDashboardApi;