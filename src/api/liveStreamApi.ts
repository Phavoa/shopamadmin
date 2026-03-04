import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "@/lib/auth/authUtils";
import { LiveStreamTier } from "./slotApi"; // Import from slotApi

// --- Interfaces based on API Response ---

export interface LiveStreamSeller {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
}

export interface LiveStreamItem {
  id: string;
  streamId: string;
  title: string;
  description: string;
  images: string[];
  startingPrice: string;
  reservePrice: string | null;
  position: number;
  status: "PENDING" | "SOLD" | "UNSOLD"; // Inferring status
  createdAt: string;
  updatedAt: string;
}

export interface LiveStream {
  id: string;
  status: "SCHEDULED" | "LIVE" | "ENDED"; // Inferring status
  title: string;
  startedAt: string | null;
  endedAt: string | null;
  hlsPlaylistPath: string | null;
  liveHlsPlaylistPath: string | null;
  scheduledStartAt: string;
  scheduledEndAt: string;
  categoryIds: string[];
  seller?: LiveStreamSeller;
  tier?: LiveStreamTier;
  items?: LiveStreamItem[];
}

export interface LiveStreamsListResponse {
  items: LiveStream[];
  nextCursor: string | null;
  prevCursor: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
  populate: string[];
  totalCount?: number;
}

// ─── Endpoint 3: Post-stream insights ────────────────────────────────────────────────
export interface TopBuyer {
  name: string;
  amountSpent: string; // kobo string
}

export interface StreamInsights {
  totalSales: string;          // kobo string (BigInt)
  productsSold: number;
  topBuyers: TopBuyer[];
  peakWatchers: number;
  avgWatchTimeMinutes: number;
}

// ─── Endpoint 4: Stream details + seller metrics ────────────────────────────────────
export interface StandbySeller {
  id: string;
  userId: string;
  shopName: string;
  businessName: string;
  logoUrl: string;
  reliabilityScore: number;
}

export interface StreamDetails {
  reliabilityScore: number;    // 0-100
  queuedProducts: number;
  lastNoShow: number;
  activeStrikes: number;
  standbySellers: StandbySeller[];
}

// --- Request Params ---

export interface GetLiveStreamsParams {
  populate?: string | string[];
  q?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt";
  sortDir?: "asc" | "desc";
  sellerId?: string;
  status?: string;
  intent?: string;
  scheduledStartFrom?: string;
  scheduledStartTo?: string;
  scheduledEndFrom?: string;
  scheduledEndTo?: string;
  categoryIds?: string[];
  tier?: string;
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

export const liveStreamApi = createApi({
  reducerPath: "liveStreamApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["LiveStream"],
  endpoints: (builder) => ({
    getLiveStreams: builder.query<
      ApiResponse<LiveStreamsListResponse>,
      GetLiveStreamsParams
    >({
      query: (params = {}) => {
        const url = new URL(`${API_BASE_URL}/streams`);

        // Handle populate parameter (can be array or CSV)
        if (params.populate) {
          const populateValue = Array.isArray(params.populate)
            ? params.populate.join(",")
            : params.populate;
          url.searchParams.set("populate", populateValue);
        }

        // Handle categoryIds parameter (array)
        if (params.categoryIds) {
          params.categoryIds.forEach((id) =>
            url.searchParams.append("categoryIds", id),
          );
        }

        // Add other parameters
        Object.entries(params).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            key !== "populate" &&
            key !== "categoryIds"
          ) {
            url.searchParams.set(key, value.toString());
          }
        });

        return {
          url: url.toString().replace(API_BASE_URL, ""),
          method: "GET",
        };
      },
      providesTags: ["LiveStream"],
    }),
    getLiveStreamById: builder.query<ApiResponse<LiveStream>, string>({
      query: (id) => `/streams/${id}`,
      providesTags: (result, error, id) => [{ type: "LiveStream", id }],
    }),

    // Endpoint 3: POST-STREAM INSIGHTS
    // GET /streams/admin/insights/:id
    getStreamInsights: builder.query<ApiResponse<StreamInsights>, string>({
      query: (streamId) => ({
        url: `/streams/admin/insights/${streamId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LiveStream", id: `insights-${id}` }],
    }),

    // Endpoint 4: STREAM DETAILS + SELLER METRICS
    // GET /streams/:id/details
    getStreamDetails: builder.query<ApiResponse<StreamDetails>, string>({
      query: (streamId) => ({
        url: `/streams/${streamId}/details`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LiveStream", id: `details-${id}` }],
    }),
  }),
});

export const {
  useGetLiveStreamsQuery,
  useLazyGetLiveStreamsQuery,
  useGetLiveStreamByIdQuery,
  useGetStreamInsightsQuery,
  useLazyGetStreamInsightsQuery,
  useGetStreamDetailsQuery,
  useLazyGetStreamDetailsQuery,
} = liveStreamApi;
