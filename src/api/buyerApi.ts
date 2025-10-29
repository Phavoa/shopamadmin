const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

export interface BuyerProfileVM {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  status: string;
  locationState: string;
  locationCity: string;
  totalPurchases: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
  traceId: string;
}

export interface BuyerListParams {
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "totalPurchases" | "userFirstName";
  sortDir?: "asc" | "desc";
  status?: "ACTIVE" | "SUSPENDED";
  state?: string;
  city?: string;
  minTotalPurchasesKobo?: string;
}

export interface BuyerListResponse {
  items: BuyerProfileVM[];
  nextCursor?: string;
  prevCursor?: string;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
}

export const getBuyers = async (
  params: BuyerListParams = {}
): Promise<ApiResponse<BuyerListResponse>> => {
  const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

  const url = new URL(`${API_BASE_URL}/buyer`);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value.toString());
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
    throw new Error(`Failed to fetch buyers: ${response.statusText}`);
  }

  return response.json();
};
