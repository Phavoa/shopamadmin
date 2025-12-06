const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

export interface BuyerProfileVM {
  id: string;
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
  verified?: boolean;
  imageUrl?: string;
  followersCount?: number;
  followingCount?: number;
}

export interface UserProfileVM {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  followersCount?: number;
  followingCount?: number;
  seller?: {
    userId: string;
    status: string;
    locationState: string;
    locationCity: string;
    totalSales: string;
  };
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp?: string;
  traceId?: string;
}

export interface BuyerListParams {
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "lastName";
  sortDir?: "asc" | "desc";
  hasSeller?: boolean;
  sellerStatus?: "PENDING" | "UNDER_REVIEW" | "ACTIVE" | "SUSPENDED";
  state?: string;
  city?: string;
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

// Helper function to get token from Redux persist store
const getAuthToken = (): string | null => {
  try {
    const persistRoot = localStorage.getItem("persist:root");
    if (!persistRoot) return null;

    const parsedRoot = JSON.parse(persistRoot);
    if (!parsedRoot.auth) return null;

    const authData = JSON.parse(parsedRoot.auth);
    return authData.accessToken || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Transform user data to buyer format
const transformUserToBuyer = (user: UserProfileVM): BuyerProfileVM => {
  return {
    id: user.id,
    userId: user.id,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userEmail: user.email,
    userPhone: user.phone,
    status: user.seller?.status || "ACTIVE",
    locationState: user.seller?.locationState || "N/A",
    locationCity: user.seller?.locationCity || "N/A",
    totalPurchases: user.seller?.totalSales || "0",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    verified: user.verified,
    imageUrl: user.imageUrl,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
  };
};

// Get list of buyers (users without seller profiles)
export const getBuyers = async (
  params: BuyerListParams = {}
): Promise<ApiResponse<BuyerListResponse>> => {
  const token = getAuthToken();
  const url = new URL(`${API_BASE_URL}/user`);

  // Set hasSeller to false to get only buyers (users without seller profiles)
  const queryParams = {
    ...params,
    hasSeller: false,
  };

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value.toString());
    }
  });

  console.log("🔍 Fetching buyers from URL:", url.toString());
  console.log("🔑 Auth token:", token ? "✅ Exists" : "❌ Missing");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  console.log("📡 Response status:", response.status);
  console.log("📡 Response ok:", response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ API Error Response:", errorText);
    throw new Error(
      `Failed to fetch buyers: ${response.statusText} - ${errorText}`
    );
  }

  const responseData = await response.json();
  console.log("✅ API Success Response:", responseData);

  // Transform the response to match our BuyerListResponse format
  const transformedData: BuyerListResponse = {
    items: responseData.data.items.map(transformUserToBuyer),
    nextCursor: responseData.data.nextCursor,
    prevCursor: responseData.data.prevCursor,
    pageSize: responseData.data.pageSize,
    hasNext: responseData.data.hasNext,
    hasPrev: responseData.data.hasPrev,
    sortBy: responseData.data.sortBy,
    sortDir: responseData.data.sortDir,
  };

  return {
    success: true,
    data: transformedData,
    message: responseData.message,
    statusCode: responseData.statusCode,
  };
};

// Get single buyer by ID
export const getBuyerById = async (
  userId: string
): Promise<ApiResponse<BuyerProfileVM>> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch buyer: ${response.statusText} - ${errorText}`
    );
  }

  const responseData = await response.json();
  const buyer = transformUserToBuyer(responseData.data || responseData);

  return {
    success: true,
    data: buyer,
    message: "User retrieved",
    statusCode: 200,
  };
};

// Get user details by ID
export const getUserById = async (
  userId: string
): Promise<ApiResponse<UserProfileVM>> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch user: ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
};

// Suspend a buyer (user)
export const suspendBuyer = async (
  userId: string
): Promise<ApiResponse<unknown>> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/seller/suspend/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to suspend buyer: ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
};

// Verify a buyer - Note: You'll need to create an admin endpoint for this
// For now, this is a placeholder that needs a proper admin verification endpoint
export const verifyBuyer = async (
  userId: string
): Promise<ApiResponse<unknown>> => {
  const token = getAuthToken();

  // This endpoint needs to be created on your backend
  // It should be something like POST /api/admin/user/{userId}/verify
  const response = await fetch(`${API_BASE_URL}/user/${userId}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to verify buyer: ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
};

// Get suspended buyers (users with SUSPENDED seller status)
export const getSuspendedBuyers = async (
  params: BuyerListParams = {}
): Promise<ApiResponse<BuyerListResponse>> => {
  return getBuyers({
    ...params,
    sellerStatus: "SUSPENDED",
  });
};
