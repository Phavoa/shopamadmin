import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "@/lib/auth/authUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RevenueReportSummary {
  totalGmvKobo: string;
  totalCommissionKobo: string;
  totalRefundsKobo: string;
  netShopamRevenueKobo: string;
  blendedCommissionRate: number;
}

export interface RevenueReportItem {
  reportId: string;
  sellerId: string;
  sellerName: string;
  shopName: string;
  totalOrders: number;
  gmvKobo: string;
  commissionRate: number;
  commissionKobo: string;
  refundsKobo: string;
  netRevenueKobo: string;
  period: string;
}

export interface RevenueReportListResponse {
  summary: RevenueReportSummary;
  items: RevenueReportItem[];
  total: number;
  page: number;
  limit: number;
}

export type ReportPeriod =
  | "today"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

export interface RevenueReportParams {
  period?: ReportPeriod;
  from?: string;        // ISO date
  to?: string;          // ISO date
  groupBy?: "week" | "month";
  sellerId?: string;
  page?: number;
  limit?: number;
}

// Export params are the same minus page/limit
export type RevenueReportExportParams = Omit<RevenueReportParams, "page" | "limit">;

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

export const revenueReportsApi = createApi({
  reducerPath: "revenueReportsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["RevenueReport"],
  endpoints: (builder) => ({

    // GET /api/admin/dashboard/revenue-reports
    getRevenueReports: builder.query<
      { data: RevenueReportListResponse },
      RevenueReportParams
    >({
      query: (params = {}) => ({
        url: "/admin/dashboard/revenue-reports",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "RevenueReport", id: "LIST" }],
    }),

    // GET /api/admin/dashboard/revenue-reports/export  → text/csv blob
    // We don't use RTK Query for the CSV download — we expose a helper instead.
    // (See exportRevenueReportCsv below)
  }),
});

export const {
  useGetRevenueReportsQuery,
  useLazyGetRevenueReportsQuery,
} = revenueReportsApi;

// ─── CSV Export helper (non-RTK, returns a Blob) ─────────────────────────────

export const exportRevenueReportCsv = async (
  params: RevenueReportExportParams
): Promise<void> => {
  const token = authStorage.getAccessToken();
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.set(k, String(v));
  });

  const res = await fetch(
    `${API_BASE_URL}/admin/dashboard/revenue-reports/export?${query.toString()}`,
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
  link.download = `revenue-report-${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
