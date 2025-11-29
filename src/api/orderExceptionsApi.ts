import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "../lib/auth/authUtils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

// Types based on the API response
export interface OrderException {
  id: string;
  orderId: string;
  exceptionType: string;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "REJECTED";
  description: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  buyerNotes?: string;
  resolutionNotes?: string;
  evidenceRequests?: EvidenceRequest[];
}

export interface EvidenceRequest {
  id: string;
  note: string;
  createdAt: string;
  adminId: string;
}

export interface AdminResolveDto {
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "REJECTED";
}

export interface RequestMoreEvidenceDto {
  note: string;
}

export interface OrderExceptionListResponse {
  items: OrderException[];
  nextCursor: string | null;
  prevCursor: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
  populate: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
  traceId: string;
}

export interface GetOrderExceptionsParams {
  populate?: string[];
  addresses?: boolean;
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
  orderId?: string;
  buyerId?: string;
  sellerId?: string;
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

export const orderExceptionsApi = createApi({
  reducerPath: "orderExceptionsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["OrderException"],
  endpoints: (builder) => ({
    // Get order exceptions list
    getOrderExceptions: builder.query<
      ApiResponse<OrderExceptionListResponse>,
      { orderId: string; params?: GetOrderExceptionsParams }
    >({
      query: ({ orderId, params = {} }) => ({
        url: `/orders/${orderId}/exceptions`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "OrderException" as const,
                id,
              })),
              { type: "OrderException" as const, id: "LIST" },
            ]
          : [{ type: "OrderException" as const, id: "LIST" }],
    }),

    // Request more evidence from buyer
    requestMoreEvidence: builder.mutation<
      ApiResponse<OrderException>,
      { orderId: string; exId: string; data: RequestMoreEvidenceDto }
    >({
      query: ({ orderId, exId, data }) => ({
        url: `/orders/${orderId}/exceptions/${exId}/admin/request-more`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { exId }) => [
        { type: "OrderException", id: exId },
        "OrderException",
      ],
    }),

    // Resolve the exception
    resolveException: builder.mutation<
      ApiResponse<OrderException>,
      { orderId: string; exId: string; data: AdminResolveDto }
    >({
      query: ({ orderId, exId, data }) => ({
        url: `/orders/${orderId}/exceptions/${exId}/admin/resolve`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { exId }) => [
        { type: "OrderException", id: exId },
        "OrderException",
      ],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useGetOrderExceptionsQuery,
  useLazyGetOrderExceptionsQuery,
  useRequestMoreEvidenceMutation,
  useResolveExceptionMutation,
} = orderExceptionsApi;
