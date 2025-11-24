import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "../lib/auth/authUtils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

// Types based on the API specification
export interface Shipment {
  id: string;
  orderId: string;
  status: string;
  trackingCode: string;
  orderCode: string;
  assignedRiderId?: string | null;
  events: ShipmentEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentEvent {
  id: string;
  status: string;
  note: string;
  createdAt: string;
}

export interface RiderAssignmentRequest {
  riderId: string;
}

export interface ShipmentStatusUpdateRequest {
  trackingCode?: string;
  orderCode?: string;
  status: string;
  note?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
  traceId: string;
}

// Allowed shipment statuses based on the API spec
export type ShipmentStatus =
  | "AWAITING_SELLER_SHIPMENT"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "FAILED_DELIVERY"
  | "RETURNED";

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

export const shipmentApi = createApi({
  reducerPath: "shipmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Shipment"],
  endpoints: (builder) => ({
    // Assign rider to shipment
    assignRiderToShipment: builder.mutation<
      ApiResponse<{ message: string }>,
      { orderId: string; data: RiderAssignmentRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/shipments/${orderId}/assign-rider`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Shipment"],
    }),

    // Update shipment status by order ID
    updateShipmentStatus: builder.mutation<
      ApiResponse<{ message: string }>,
      { orderId: string; data: ShipmentStatusUpdateRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/shipments/${orderId}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Shipment"],
    }),

    // Update shipment status by order code or tracking code
    updateShipmentStatusByCode: builder.mutation<
      ApiResponse<{ message: string }>,
      {
        data: Omit<
          ShipmentStatusUpdateRequest,
          "trackingCode" | "orderCode"
        > & {
          trackingCode?: string;
          orderCode?: string;
        };
      }
    >({
      query: ({ data }) => ({
        url: "/shipments/update-status-by-order-or-tacking-code",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Shipment"],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useAssignRiderToShipmentMutation,
  useUpdateShipmentStatusMutation,
  useUpdateShipmentStatusByCodeMutation,
} = shipmentApi;
