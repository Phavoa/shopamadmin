import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "@/lib/auth/authUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertDomain = "FINANCE" | "DISPUTES" | "SECURITY" | "SYSTEM";

export interface SystemAlert {
  id: string;
  domain: AlertDomain;
  message: string;
  referenceId?: string;
  actionLink?: string;
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Matches the actual Swagger response — cursor-based, items at top level
export interface SystemAlertsListResponse {
  items: SystemAlert[];
  nextCursor: string | null;
  prevCursor: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  q?: string;
  sortBy?: string;
  sortDir?: string;
}

export interface SystemAlertsParams {
  domain?: AlertDomain;
  isResolved?: boolean;
  limit?: number;
  after?: string;  // cursor forward
  before?: string; // cursor backward
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

// The resolve mutation returns the alert directly (no envelope)
export type ResolveAlertResponse = SystemAlert;

// The list endpoint may or may not use the standard { message, data } envelope.
// We handle both shapes via transformResponse.
export interface SystemAlertsApiResponse {
  items: SystemAlert[];
  nextCursor: string | null;
  prevCursor: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
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

// ─── System Alerts API Slice ──────────────────────────────────────────────────

export const systemAlertsApi = createApi({
  reducerPath: "systemAlertsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["SystemAlert"],
  endpoints: (builder) => ({

    // GET /admin/system-alerts
    getSystemAlerts: builder.query<SystemAlertsApiResponse, SystemAlertsParams>({
      query: (params = {}) => ({
        url: "/admin/system-alerts",
        method: "GET",
        params,
      }),
      // The API returns the list at the top level (no data envelope per Swagger)
      transformResponse: (raw: unknown): SystemAlertsApiResponse => {
        // Handle potential { message, data, statusCode } envelope
        const r = raw as Record<string, unknown>;
        const list = (r.data ?? r) as SystemAlertsListResponse;
        return {
          items: list.items ?? [],
          nextCursor: list.nextCursor ?? null,
          prevCursor: list.prevCursor ?? null,
          pageSize: list.pageSize ?? 0,
          hasNext: list.hasNext ?? false,
          hasPrev: list.hasPrev ?? false,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: "SystemAlert" as const,
                id,
              })),
              { type: "SystemAlert", id: "LIST" },
            ]
          : [{ type: "SystemAlert", id: "LIST" }],
    }),

    // PATCH /admin/system-alerts/:id/resolve
    resolveSystemAlert: builder.mutation<ResolveAlertResponse, string>({
      query: (id) => ({
        url: `/admin/system-alerts/${id}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "SystemAlert", id },
        { type: "SystemAlert", id: "LIST" },
      ],
    }),

  }),
});

export const {
  useGetSystemAlertsQuery,
  useLazyGetSystemAlertsQuery,
  useResolveSystemAlertMutation,
} = systemAlertsApi;