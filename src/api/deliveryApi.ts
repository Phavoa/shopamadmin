import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "../lib/auth/authUtils";

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
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try to refresh token
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data && typeof refreshResult.data === "object") {
        const refreshData = refreshResult.data as {
          accessToken: string;
          refreshToken?: string;
        };

        // Store new tokens in localStorage
        authStorage.setTokens(
          refreshData.accessToken,
          refreshData.refreshToken
        );

        // Retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout
        authStorage.clearTokens();
      }
    }
  }

  return result;
};

/**
 * Delivery Zone types
 */
export interface DeliveryZone {
  id: string;
  code: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SeedZonesRequest {
  reset?: boolean;
  defaultPriceKobo: string;
}

export interface UpdateZoneRequest {
  name?: string;
  active?: boolean;
}

/**
 * Delivery Price types
 */
export interface DeliveryPrice {
  id: string;
  originZoneId: string;
  originZone?: {
    id: string;
    code: string;
    name: string;
  };
  destinationZoneId: string;
  destinationZone?: {
    id: string;
    code: string;
    name: string;
  };
  priceKobo: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePriceRequest {
  active?: boolean;
  priceKobo?: string;
}

/**
 * List parameters
 */
export interface ListZonesParams {
  populate?: string[];
  sellerId?: string[];
  addresses?: string;
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "lastName" | "sellerTotalSales";
  sortDir?: "asc" | "desc";
}

export interface ListPricesParams {
  populate?: string[];
  sellerId?: string[];
  addresses?: string;
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
  originZoneId?: string;
  destinationZoneId?: string;
}

/**
 * API Response types
 */
export interface ZonesListResponse {
  success?: boolean;
  message: string;
  data: {
    items: DeliveryZone[];
    nextCursor?: string | null;
    prevCursor?: string | null;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
    sortBy: string;
    sortDir: string;
    populate: string[];
  };
  statusCode: number;
  timestamp?: string;
  traceId?: string;
}

export interface PricesListResponse {
  message: string;
  data: DeliveryPrice[] | string;
  statusCode: number;
}

export const deliveryApi = createApi({
  reducerPath: "deliveryApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["DeliveryZone", "DeliveryPrice"],
  endpoints: (builder) => ({
    // Seed zones + pricing matrix
    // POST /api/delivery/zones/seed
    seedZones: builder.mutation<ApiResponse<{ ok: boolean }>, SeedZonesRequest>(
      {
        query: (seedData) => ({
          url: "/delivery/zones/seed",
          method: "POST",
          body: seedData,
        }),
        invalidatesTags: ["DeliveryZone", "DeliveryPrice"],
      }
    ),

    // List zones
    // GET /api/delivery/zones
    getZones: builder.query<ZonesListResponse, ListZonesParams>({
      query: (params = {}) => ({
        url: "/delivery/zones",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "DeliveryZone" as const,
                id,
              })),
              { type: "DeliveryZone" as const, id: "LIST" },
            ]
          : [{ type: "DeliveryZone" as const, id: "LIST" }],
    }),

    // Update zone info
    // PATCH /api/delivery/zones/{id}
    updateZone: builder.mutation<
      ApiResponse<DeliveryZone>,
      { id: string; data: UpdateZoneRequest }
    >({
      query: ({ id, data }) => ({
        url: `/delivery/zones/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DeliveryZone", id },
        "DeliveryZone",
      ],
    }),

    // List zone-to-zone prices
    // GET /api/delivery/prices
    getPrices: builder.query<PricesListResponse, ListPricesParams>({
      query: (params = {}) => ({
        url: "/delivery/prices",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result && Array.isArray(result.data)
          ? [
              ...result.data.map(({ id }) => ({
                type: "DeliveryPrice" as const,
                id,
              })),
              { type: "DeliveryPrice" as const, id: "LIST" },
            ]
          : [{ type: "DeliveryPrice" as const, id: "LIST" }],
    }),

    // Update price and zone mapping
    // PATCH /api/delivery/{id}
    updatePrice: builder.mutation<
      ApiResponse<DeliveryPrice>,
      { id: string; data: UpdatePriceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/delivery/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DeliveryPrice", id },
        "DeliveryPrice",
      ],
    }),

    // Get zone by ID with optional population
    // GET /api/delivery/zones/{id}
    getZoneById: builder.query<
      ApiResponse<DeliveryZone>,
      { id: string; populate?: string[] }
    >({
      query: ({ id, populate }) => ({
        url: `/delivery/zones/${id}`,
        method: "GET",
        params: populate ? { populate } : undefined,
      }),
      providesTags: (result, error, { id }) => [{ type: "DeliveryZone", id }],
    }),

    // Get price by ID with optional population
    // GET /api/delivery/prices/{id}
    getPriceById: builder.query<
      ApiResponse<DeliveryPrice>,
      { id: string; populate?: string[] }
    >({
      query: ({ id, populate }) => ({
        url: `/delivery/prices/${id}`,
        method: "GET",
        params: populate ? { populate } : undefined,
      }),
      providesTags: (result, error, { id }) => [{ type: "DeliveryPrice", id }],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useSeedZonesMutation,
  useGetZonesQuery,
  useUpdateZoneMutation,
  useGetPricesQuery,
  useUpdatePriceMutation,
  useGetZoneByIdQuery,
  useGetPriceByIdQuery,
} = deliveryApi;
