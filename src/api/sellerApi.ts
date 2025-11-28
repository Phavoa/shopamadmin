const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

export interface SellerProfileVM {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPhone: string;
  status: string;
  tier: string;
  shopName: string;
  bio: string;
  logoUrl: string;
  businessName: string;
  businessCategory: string;
  govIdUrl: string;
  businessDocUrl: string;
  locationState: string;
  locationCity: string;
  totalSales: string;
  createdAt: string;
  updatedAt: string;
  nextStep: string;
  nextEndpoint: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
  traceId: string;
}

export interface SellerListParams {
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "totalSales" | "shopName";
  sortDir?: "asc" | "desc";
  status?: "PENDING" | "UNDER_REVIEW" | "ACTIVE" | "SUSPENDED";
  tier?: "A" | "B" | "C";
  state?: string;
  city?: string;
  minTotalSalesKobo?: string;
  hasLogo?: boolean;
  populate?: string;
}

export interface SellerListResponse {
  items: SellerProfileVM[];
  nextCursor?: string;
  prevCursor?: string;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
}

export interface SellerUpdatePayload {
  shopName?: string;
  bio?: string;
  businessName?: string;
  businessCategory?: string;
  govIdUrl?: string;
  businessDocUrl?: string;
  locationState?: string;
  locationCity?: string;
}

export interface SellerApplyPayload {
  shopName: string;
  bio: string;
  businessName: string;
  businessCategory: string;
  govIdUrl: string;
  businessDocUrl: string;
  locationState: string;
  locationCity: string;
}

export interface UserProfileVM {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  defaultAddress?: never;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  blocks: string[];
  blockedBy: string[];
  seller?: SellerProfileVM;
}

export const approveSeller = async (
  userId: string
): Promise<ApiResponse<SellerProfileVM>> => {
  const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
  const response = await fetch(`${API_BASE_URL}/seller/approve/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to approve seller: ${response.statusText}`);
  }

  return response.json();
};

export const suspendSeller = async (
  userId: string
): Promise<ApiResponse<SellerProfileVM>> => {
  const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
  const response = await fetch(`${API_BASE_URL}/seller/suspend/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to suspend seller: ${response.statusText}`);
  }

  return response.json();
};

export const getSellers = async (
  params: SellerListParams = {}
): Promise<ApiResponse<SellerListResponse>> => {
  const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

  const url = new URL(`${API_BASE_URL}/seller`);

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
    throw new Error(`Failed to fetch sellers: ${response.statusText}`);
  }

  return response.json();
};

export const getSellerById = async (
  userId: string
): Promise<ApiResponse<SellerListResponse>> => {
  const token = localStorage.getItem("authToken");

  const url = new URL(`${API_BASE_URL}/seller`);
  url.searchParams.append("q", userId);
  url.searchParams.append("populate", "user,products");
  url.searchParams.append("limit", "1");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch seller: ${response.statusText}`);
  }

  return response.json();
};

export const getSellerMe = async (): Promise<ApiResponse<SellerProfileVM>> => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/seller/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch seller profile: ${response.statusText}`);
  }

  return response.json();
};

export const updateSellerMe = async (
  payload: SellerUpdatePayload
): Promise<ApiResponse<SellerProfileVM>> => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/seller/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update seller profile: ${response.statusText}`);
  }

  return response.json();
};

export const applyToBecomeSeller = async (
  payload: SellerApplyPayload
): Promise<ApiResponse<SellerProfileVM>> => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/seller/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to apply to become seller: ${response.statusText}`);
  }

  return response.json();
};

export const submitSellerApplication = async (): Promise<ApiResponse<SellerProfileVM>> => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/seller/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to submit seller application: ${response.statusText}`);
  }

  return response.json();
};

export const getUserById = async (userId: string): Promise<UserProfileVM> => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  return response.json();
};