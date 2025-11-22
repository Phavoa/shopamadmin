// Common types for user-related API endpoints

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  deliveryZoneId?: string;
  deliveryZone?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface SellerProfile {
  userId: string;
  status: "PENDING" | "UNDER_REVIEW" | "ACTIVE" | "SUSPENDED";
  tier: "A" | "B" | "C";
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
  defaultAddress?: Address;
  followersCount?: number;
  followingCount?: number;
  followers?: string[];
  following?: string[];
  blocks?: string[];
  blockedBy?: string[];
  seller?: SellerProfile;
}

// PUT /api/user/me request types
export interface UpdateProfileAddress {
  id?: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
  deliveryZoneId?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phone?: string;
  address?: UpdateProfileAddress;
}

// GET /api/user query parameters
export interface ListUsersParams {
  populate?: string[];
  q?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "lastName" | "sellerTotalSales";
  sortDir?: "asc" | "desc";
  hasSeller?: boolean;
  sellerStatus?: "PENDING" | "UNDER_REVIEW" | "ACTIVE" | "SUSPENDED";
  sellerTier?: "A" | "B" | "C";
  state?: string;
  city?: string;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  message: string;
  data: {
    items: T[];
    nextCursor?: string;
    prevCursor?: string;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
    q?: string;
    sortBy?: string;
    sortDir?: string;
  };
  statusCode: number;
}

// GET /api/user/{id}/followers and /api/user/{id}/following query parameters
export interface ListFollowersParams {
  populate?: string[];
  q?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

// GET /api/user/{id}/relationship response
export interface RelationshipResponse {
  isFollowing: boolean;
  isFollower: boolean;
  isBlocked: boolean;
  blockedByThem: boolean;
}

// Generic OK response for follow/block operations
export interface OkResponse {
  ok: boolean;
}

// API Response types for specific endpoints
export type GetMyProfileResponse = UserProfileVM;
export type UpdateMyProfileResponse = UserProfileVM;
export type ListUsersResponse = PaginatedResponse<UserProfileVM>;
export type FollowUserResponse = OkResponse;
export type UnfollowUserResponse = OkResponse;
export type BlockUserResponse = OkResponse;
export type UnblockUserResponse = OkResponse;
export type ListFollowersResponse = PaginatedResponse<UserProfileVM>;
export type ListFollowingResponse = PaginatedResponse<UserProfileVM>;
export type GetRelationshipResponse = RelationshipResponse;
