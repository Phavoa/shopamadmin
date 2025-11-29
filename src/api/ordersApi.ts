const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

// Import the auth storage utility
import { authStorage } from "../lib/auth/authUtils";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

export interface OrderPayment {
  id: string;
  amount: number;
  status: string;
  method: string;
  createdAt: string;
}

export interface OrderShipment {
  id: string;
  trackingNumber?: string;
  status: string;
  carrier?: string;
  estimatedDelivery?: string;
  events?: ShipmentEvent[];
}

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  status: string;
  description: string;
  location?: string;
}

export interface OrderBuyer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface OrderSeller {
  id: string;
  userId: string;
  shopName: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface OrderCheckoutSession {
  id: string;
  paymentStatus: string;
  totalAmount: number;
  sessionUrl?: string;
}

export interface OrderLot {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface OrderVM {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payments: OrderPayment[];
  buyer: OrderBuyer;
  seller: OrderSeller;
  shipment?: OrderShipment;
  checkoutSession?: OrderCheckoutSession;
  lot?: OrderLot;
  deliveryType?: "pickup" | "delivery";
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
  traceId: string;
}

export interface OrdersListParams {
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
}

export interface OrdersListResponse {
  items: OrderVM[];
  nextCursor?: string;
  prevCursor?: string;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
  totalCount?: number;
}

export const getOrders = async (
  params: OrdersListParams = {}
): Promise<ApiResponse<OrdersListResponse>> => {
  const token = authStorage.getAccessToken();

  const url = new URL(`${API_BASE_URL}/orders`);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (key === "populate" && Array.isArray(value)) {
        // Handle array parameters for populate
        value.forEach((item) => {
          url.searchParams.append("populate", item);
        });
      } else {
        url.searchParams.append(key, value.toString());
      }
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  return response.json();
};

export const getOrderById = async (
  orderId: string,
  populate?: string[]
): Promise<ApiResponse<OrderVM>> => {
  const token = authStorage.getAccessToken();

  const url = new URL(`${API_BASE_URL}/orders/${orderId}`);

  // Add populate parameters if provided
  if (populate && populate.length > 0) {
    populate.forEach((item) => {
      url.searchParams.append("populate", item);
    });
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }

  return response.json();
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  notes?: string
): Promise<ApiResponse<OrderVM>> => {
  const token = authStorage.getAccessToken();

  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
      notes,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update order status: ${response.statusText}`);
  }

  return response.json();
};

export const getOrdersByBuyer = async (
  buyerId: string,
  params: Omit<OrdersListParams, "buyerId"> = {}
): Promise<ApiResponse<OrdersListResponse>> => {
  return getOrders({
    ...params,
    buyerId,
  });
};

export const getOrdersBySeller = async (
  sellerId: string,
  params: Omit<OrdersListParams, "sellerId"> = {}
): Promise<ApiResponse<OrdersListResponse>> => {
  return getOrders({
    ...params,
    sellerId,
  });
};

export const getPickupOrders = async (
  params: Omit<OrdersListParams, "pickup"> = {}
): Promise<ApiResponse<OrdersListResponse>> => {
  return getOrders({
    ...params,
    pickup: true,
  });
};

export const getDeliveryOrders = async (
  params: Omit<OrdersListParams, "delivery"> = {}
): Promise<ApiResponse<OrdersListResponse>> => {
  return getOrders({
    ...params,
    delivery: true,
  });
};

export const searchOrders = async (
  searchTerm: string,
  params: Omit<OrdersListParams, "q"> = {}
): Promise<ApiResponse<OrdersListResponse>> => {
  return getOrders({
    ...params,
    q: searchTerm,
  });
};

export interface OrderStatistics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  inTransitOrders: number;
  returnedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
}

export const getOrderStatisticsBySeller = async (
  sellerId: string
): Promise<ApiResponse<OrderStatistics>> => {
  console.log("seller ID", sellerId);
  try {
    // Fetch all orders for the seller (we'll need to handle pagination if needed)
    const response = await getOrdersBySeller(sellerId, { limit: 1000 }); // Adjust limit as needed

    if (!response.success || !response.data.items) {
      throw new Error("Failed to fetch orders for statistics");
    }

    const orders = response.data.items;

    // Calculate statistics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) =>
        order.status.toLowerCase() === "completed" ||
        order.status.toLowerCase() === "delivered"
    ).length;
    const pendingOrders = orders.filter(
      (order) =>
        order.status.toLowerCase() === "pending" ||
        order.status.toLowerCase() === "processing"
    ).length;
    const cancelledOrders = orders.filter(
      (order) =>
        order.status.toLowerCase() === "cancelled" ||
        order.status.toLowerCase() === "canceled"
    ).length;
    const inTransitOrders = orders.filter(
      (order) =>
        order.status.toLowerCase() === "shipped" ||
        order.status.toLowerCase() === "in_transit" ||
        order.status.toLowerCase() === "out_for_delivery"
    ).length;
    const returnedOrders = orders.filter(
      (order) => order.status.toLowerCase() === "returned"
    ).length;

    const totalRevenue = orders
      .filter(
        (order) =>
          order.status.toLowerCase() === "completed" ||
          order.status.toLowerCase() === "delivered"
      )
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const averageOrderValue =
      completedOrders > 0 ? totalRevenue / completedOrders : 0;
    const completionRate =
      totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    const statistics: OrderStatistics = {
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      inTransitOrders,
      returnedOrders,
      totalRevenue,
      averageOrderValue,
      completionRate,
    };

    return {
      success: true,
      data: statistics,
      message: "Order statistics calculated successfully",
      statusCode: 200,
      timestamp: new Date().toISOString(),
      traceId: "",
    };
  } catch (error) {
    console.error("Error calculating order statistics:", error);
    throw error;
  }
};
