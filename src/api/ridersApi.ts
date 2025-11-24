import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "../lib/auth/authUtils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

// Types based on the API specification
export interface Rider {
  id: string;
  name: string;
  phone: string;
  rideType: string;
  plateNo: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRiderRequest {
  name: string;
  phone: string;
  rideType: string;
  plateNo: string;
  active?: boolean;
}

export interface UpdateRiderRequest {
  name?: string;
  phone?: string;
  rideType?: string;
  plateNo?: string;
  active?: boolean;
}

export interface RiderListResponse {
  items: Rider[];
  nextCursor?: string;
  prevCursor?: string;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
  traceId: string;
}

export interface GetRidersParams {
  populate?: string[];
  q?: string;
  rideType?: string;
  active?: boolean;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface GetRiderByIdParams {
  populate?: string[];
}

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
      try {
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

          // Store new tokens
          authStorage.setTokens(
            refreshData.accessToken,
            refreshData.refreshToken
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

export const ridersApi = createApi({
  reducerPath: "ridersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Rider"],
  endpoints: (builder) => ({
    // Create rider
    createRider: builder.mutation<ApiResponse<Rider>, CreateRiderRequest>({
      query: (riderData) => ({
        url: "/riders",
        method: "POST",
        body: riderData,
      }),
      invalidatesTags: ["Rider"],
    }),

    // Get riders list
    getRiders: builder.query<ApiResponse<RiderListResponse>, GetRidersParams>({
      query: (params = {}) => ({
        url: "/riders",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Rider" as const,
                id,
              })),
              { type: "Rider" as const, id: "LIST" },
            ]
          : [{ type: "Rider" as const, id: "LIST" }],
    }),

    // Get rider by ID
    getRiderById: builder.query<
      ApiResponse<Rider>,
      { id: string; params?: GetRiderByIdParams }
    >({
      query: ({ id, params }) => ({
        url: `/riders/${id}`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: "Rider", id }],
    }),

    // Update rider
    updateRider: builder.mutation<
      ApiResponse<Rider>,
      { id: string; data: UpdateRiderRequest }
    >({
      query: ({ id, data }) => ({
        url: `/riders/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Rider", id },
        "Rider",
      ],
    }),

    // Delete rider
    deleteRider: builder.mutation<ApiResponse<{ ok: boolean }>, string>({
      query: (id) => ({
        url: `/riders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Rider", id }, "Rider"],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useCreateRiderMutation,
  useGetRidersQuery,
  useLazyGetRidersQuery,
  useGetRiderByIdQuery,
  useLazyGetRiderByIdQuery,
  useUpdateRiderMutation,
  useDeleteRiderMutation,
} = ridersApi;
