// Type definitions to fix import errors
// Place this file at: @/api/orderApiRTK.d.ts or @/api/orderApiRTK.ts

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  qty: number;
  unitPriceKobo: string;
  lineTotalKobo: string;
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
  shipToSnapshot: {
    lga: string;
    state: string;
  } | null;
  shipFromSnapshot: Record<string, never> | null;
  deliverySnapshot: Record<string, never> | null;
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