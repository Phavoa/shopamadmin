import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "@/lib/auth/authUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WeeklyKpi {
  weeklyGmvKobo: string;
  weeklyGmvChangePercent: number;
  weeklyOrders: number;
  weeklyOrdersChangePercent: number;
  activeSellers: number;
  netRevenueKobo: string;
}

export interface TopSeller {
  sellerId: string;
  shopName: string;
  revenueKobo: string;
}

export interface WeeklyLivestream {
  totalHours: number;
  avgViewers: number;
  itemsSold: number;
  top3Sellers: TopSeller[];
  shipments: number;
  onTimeDeliveryPct: number;
  avgDeliveryTimeDays: number;
  activeRiders: number;
}

export interface WeeklyDisputes {
  opened: number;
  resolvedPct: number;
  pending: number;
  avgResolutionDays: number;
}

export interface WeeklyShopping {
  gmvKobo: string;
  orders: number;
  top3Sellers: TopSeller[];
  disputes: WeeklyDisputes;
}

export interface WeeklySummary {
  period: string;
  kpi: WeeklyKpi;
  livestream: WeeklyLivestream;
  shopping: WeeklyShopping;
}

export type WeeklySummaryPeriod =
  | "today"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

export interface WeeklySummaryParams {
  period?: WeeklySummaryPeriod;
  from?: string;
  to?: string;
}

// ─── Base URL ─────────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = authStorage.getAccessToken();
    if (token) headers.set("authorization", `Bearer ${token}`);
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
          const d = refreshResult.data as {
            accessToken: string;
            refreshToken?: string;
          };
          authStorage.setTokens(d.accessToken, d.refreshToken);
          result = await baseQuery(args, api, extraOptions);
          return result;
        }
      } catch (e) {
        console.error("Token refresh failed:", e);
      }
    }
    if (result?.error?.status === 401) authStorage.clearTokens();
  }
  return result;
};

// ─── API Slice ────────────────────────────────────────────────────────────────

export const weeklySummaryApi = createApi({
  reducerPath: "weeklySummaryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["WeeklySummary"],
  endpoints: (builder) => ({

    // GET /api/admin/dashboard/weekly-summary
    getWeeklySummary: builder.query<
      { data: WeeklySummary },
      WeeklySummaryParams
    >({
      query: (params = {}) => ({
        url: "/admin/dashboard/weekly-summary",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "WeeklySummary", id: "CURRENT" }],
    }),
  }),
});

export const {
  useGetWeeklySummaryQuery,
  useLazyGetWeeklySummaryQuery,
} = weeklySummaryApi;

// ─── CSV Export helper ────────────────────────────────────────────────────────

export const exportWeeklySummaryCsv = async (
  params: WeeklySummaryParams
): Promise<void> => {
  const token = authStorage.getAccessToken();
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.set(k, String(v));
  });

  const res = await fetch(
    `${API_BASE_URL}/admin/dashboard/weekly-summary/export?${query.toString()}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!res.ok) throw new Error("CSV export failed");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  link.download = `weekly-summary-${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
