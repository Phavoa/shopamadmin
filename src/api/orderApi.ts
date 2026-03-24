import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "../lib/auth/authUtils";
import { Hub } from "./hubApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

// Types based on the API response
export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  qty: number;
  unitPriceKobo: string;
  lineTotalKobo: string;
  status: string;
  fulfillment?: {
    receivedQty: number;
    pendingQty: number;
    status: string;
  };
  exception?: {
    totalRejectedQty: number;
  };
  financial?: {
    payoutPendingKobo: number;
    payoutReleasedKobo: number;
    refundedKobo: number;
  };
  product: {
    id: string;
    sellerId: string;
    title: string;
    description: string;
    basePrice: string;
    price: string;
    pricePrev: string | null;
    priceUpdatedAt: string | null;
    currency: string;
    status: string;
    stockQty: number;
    slug: string;
    thumbnailUrl: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Buyer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl: string | null;
}

export interface SellerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  imageUrl: string | null;
}

export interface SellerProfile {
  userId: string;
  shopName: string;
  logoUrl: string | null;
  businessName: string;
  locationState: string;
  locationCity: string;
  status: string;
  user: SellerUser;
}

export interface CheckoutSession {
  id: string;
  metadata: Record<string, never>;
}

export interface ShipmentEvent {
  id: string;
  status: string;
  note: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  status: string;
  hubId?: string;
  assignedRiderId?: string | null;
  pickupRequestId?: string;
  events: ShipmentEvent[];
  hub?: Hub;
}

export interface AddressSnapshot {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userId: string;
  deliveryZoneId?: string;
  deliveryZone?: {
    id: string;
    code: string;
    name: string;
    active: boolean;
  };
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  source: string;
  status: string;
  escrowStatus: string;
  orderCode: string;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
  shipToSnapshot: AddressSnapshot | null;
  shipFromSnapshot: AddressSnapshot | null;
  deliverySnapshot: Record<string, any> | null;
  isPaid: boolean;
  subtotalKobo: string;
  shippingKobo: string;
  feesKobo: string;
  totalKobo: string;
  itemIds: string[];
  paymentIds: string[];
  items: OrderItem[];
  buyer: Buyer;
  sellerProfile: SellerProfile;
  checkoutSession: CheckoutSession;
  shipment?: Shipment;
  orderExceptions?: any[];
}

export interface OrderListResponse {
  items: Order[];
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

export interface GetOrdersParams {
  populate?: string[];
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
  buyerId?: string;
  sellerId?: string;
  pickup?: boolean;
  delivery?: boolean;
  isLagosOrder?: boolean;
  isNonLagosOrder?: boolean;
}

export interface GetOrderByIdParams {
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

          // Store new tokens
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

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    // Get orders list
    getOrders: builder.query<ApiResponse<OrderListResponse>, GetOrdersParams>({
      query: (params = {}) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Order" as const,
                id,
              })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),

    // Get order by ID
    getOrderById: builder.query<
      ApiResponse<Order>,
      { id: string; params?: GetOrderByIdParams }
    >({
      query: ({ id, params }) => ({
        url: `/orders/${id}`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
    // Cancel order
    cancelOrder: builder.mutation<ApiResponse<Order>, { id: string }>({
      query: ({ id }) => ({
        url: `/orders/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),

    // Bulk reject items
    rejectBulkItems: builder.mutation<
      ApiResponse<any>,
      { orderId: string; items: { itemId: string; qty: number }[] }
    >({
      query: ({ orderId, items }) => ({
        url: `/orders/${orderId}/items/reject-bulk`,
        method: "POST",
        body: { items },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useRejectBulkItemsMutation,
} = orderApi;
