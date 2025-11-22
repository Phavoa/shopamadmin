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
 * Hub types
 */
export interface Hub {
  id: string;
  name: string;
  state: string;
  address: string;
  city: string;
  phone: string;
  deliveryZoneId: string;
  deliveryZone?: {
    id: string;
    code: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateHubRequest {
  name: string;
  state: string;
  address: string;
  city: string;
  phone: string;
  deliveryZoneId: string;
}

export interface UpdateHubRequest {
  name?: string;
  state?: string;
  address?: string;
  city?: string;
  phone?: string;
  deliveryZoneId?: string;
}

export interface ListHubsParams {
  populate?: string[];
  deliveryZoneId?: string[];
  city?: string;
  state?: string;
  limit?: number;
  page?: number;
}

export interface HubListResponse {
  message: string;
  data: Hub[];
  statusCode: number;
}

export const hubApi = createApi({
  reducerPath: "hubApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Hub"],
  endpoints: (builder) => ({
    // Create a new hub
    // POST /api/hubs
    createHub: builder.mutation<ApiResponse<Hub>, CreateHubRequest>({
      query: (hubData) => ({
        url: "/hubs",
        method: "POST",
        body: hubData,
      }),
      invalidatesTags: ["Hub"],
    }),

    // List all hubs with filtering and population
    // GET /api/hubs
    getHubs: builder.query<HubListResponse, ListHubsParams>({
      query: (params = {}) => ({
        url: "/hubs",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Hub" as const,
                id,
              })),
              { type: "Hub" as const, id: "LIST" },
            ]
          : [{ type: "Hub" as const, id: "LIST" }],
    }),

    // Update a hub by ID
    // PATCH /api/hubs/{id}
    updateHub: builder.mutation<
      ApiResponse<Hub>,
      { id: string; data: UpdateHubRequest }
    >({
      query: ({ id, data }) => ({
        url: `/hubs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Hub", id }, "Hub"],
    }),

    // Get hub by ID with optional population
    // GET /api/hubs/{id}
    getHubById: builder.query<
      ApiResponse<Hub>,
      { id: string; populate?: string[] }
    >({
      query: ({ id, populate }) => ({
        url: `/hubs/${id}`,
        method: "GET",
        params: populate ? { populate } : undefined,
      }),
      providesTags: (result, error, { id }) => [{ type: "Hub", id }],
    }),

    // Delete a hub by ID
    // DELETE /api/hubs/{id}
    deleteHub: builder.mutation<ApiResponse<{ ok: boolean }>, string>({
      query: (id) => ({
        url: `/hubs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Hub", id }, "Hub"],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useCreateHubMutation,
  useGetHubsQuery,
  useUpdateHubMutation,
  useGetHubByIdQuery,
  useLazyGetHubByIdQuery,
  useDeleteHubMutation,
} = hubApi;
