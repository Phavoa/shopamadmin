import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "@/lib/auth/authUtils";

// --- Interfaces based on API Response ---

export interface LiveStreamTier {
  id: string;
  key: string;
  name: string;
  description: string;
  durationMinutes: number;
  maxViewers: number;
  minTotalSales: string;
  allowedIntents: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TiersListResponse {
  items: LiveStreamTier[];
  nextCursor: string | null;
  prevCursor: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
  populate: string[];
}

// --- Request Params ---

export interface GetLivestreamTiersParams {
  populate?: string | string[];
  q?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt";
  sortDir?: "asc" | "desc";
  isActive?: boolean;
  key?: string;
  allowedIntents?: string[];
}

export interface UpdateTierRequest {
  name?: string;
  description?: string;
  durationMinutes?: number;
  maxViewers?: number;
  minTotalSales?: string | number;
  allowedIntents?: string[];
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

/**
 * Base query with authentication
 */
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

/**
 * Base query with reauthentication
 */
const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2],
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try to refresh token
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

          // Store new tokens in localStorage
          authStorage.setTokens(
            refreshData.accessToken,
            refreshData.refreshToken,
          );

          // Retry the original query
          result = await baseQuery(args, api, extraOptions);
          return result;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }

    // If refresh failed or no refresh token, logout
    if (result?.error?.status === 401) {
      authStorage.clearTokens();
    }
  }

  return result;
};

export const slotApi = createApi({
  reducerPath: "slotApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Tier"],
  endpoints: (builder) => ({
    getLivestreamTiers: builder.query<
      ApiResponse<TiersListResponse>,
      GetLivestreamTiersParams
    >({
      query: (params = {}) => {
        const url = new URL(`${API_BASE_URL}/slots/livestream-tiers`);

        // Handle populate parameter (can be array or CSV)
        if (params.populate) {
          const populateValue = Array.isArray(params.populate)
            ? params.populate.join(",")
            : params.populate;
          url.searchParams.set("populate", populateValue);
        }

        // Handle allowedIntents parameter (array)
        if (params.allowedIntents) {
          params.allowedIntents.forEach((intent) =>
            url.searchParams.append("allowedIntents[]", intent),
          );
        }

        // Add other parameters
        Object.entries(params).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            key !== "populate" &&
            key !== "allowedIntents"
          ) {
            url.searchParams.set(key, value.toString());
          }
        });

        return {
          url: url.toString().replace(API_BASE_URL, ""),
          method: "GET",
        };
      },
      providesTags: ["Tier"],
    }),

    updateLivestreamTier: builder.mutation<
      ApiResponse<LiveStreamTier>,
      { id: string; data: UpdateTierRequest }
    >({
      query: ({ id, data }) => ({
        url: `/slots/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Tier",
        { type: "Tier", id },
      ],
    }),
  }),
});

export const {
  useGetLivestreamTiersQuery,
  useLazyGetLivestreamTiersQuery,
  useUpdateLivestreamTierMutation,
} = slotApi;
