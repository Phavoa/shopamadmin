import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "../lib/auth/authUtils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

// Types based on the API response
export interface ReferralMilestone {
  id: string;
  thresholdKobo: string;
  rewardKobo: string;
  label: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  code?: string;
  totalSpendKobo: string;
  isValid?: boolean;
  createdAt: string;
  updatedAt: string;
  referee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    imageUrl: string | null;
  };
  referrer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    imageUrl: string | null;
  };
}

export interface ReferralReward {
  id: string;
  referrerId: string;
  referralId: string;
  milestoneId: string;
  amountKobo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  referral: Referral;
  milestone: ReferralMilestone;
}

export interface ReferralSummary {
  totalReferrals: number;
  totalRefereesSpent: string;
  totalRewardsEarned: string;
  activeMilestones: number;
  recentRewards: ReferralReward[];
}

export interface ReferralMilestoneListResponse {
  items: ReferralMilestone[];
  nextCursor: string | null;
  prevCursor: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
  populate: string[];
}

export interface ReferralListResponse {
  items: Referral[];
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
  success?: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp?: string;
  traceId?: string;
}

// Parameter types
export interface CreateMilestoneParams {
  thresholdKobo: string;
  rewardKobo: string;
  label: string;
  order: number;
  active: boolean;
}

export interface UpdateMilestoneParams {
  thresholdKobo?: string;
  rewardKobo?: string;
  label?: string;
  order?: number;
  active?: boolean;
}

export interface GetMilestonesParams {
  populate?: string[];
  sellerId?: string;
  addresses?: string[];
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
  active?: boolean;
}

export interface GetReferralsParams {
  populate?: string[];
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
  referrerId?: string;
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

export const referralApi = createApi({
  reducerPath: "referralApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "ReferralMilestone",
    "Referral",
    "ReferralReward",
    "ReferralSummary",
  ],
  endpoints: (builder) => ({
    // Create referral milestone (ADMIN)
    createMilestone: builder.mutation<
      ApiResponse<ReferralMilestone>,
      CreateMilestoneParams
    >({
      query: (milestoneData) => ({
        url: "/referrals/milestones",
        method: "POST",
        body: milestoneData,
      }),
      invalidatesTags: ["ReferralMilestone"],
    }),

    // Get referral milestones (ADMIN)
    getMilestones: builder.query<
      ApiResponse<ReferralMilestoneListResponse>,
      GetMilestonesParams
    >({
      query: (params = {}) => ({
        url: "/referrals/milestones",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "ReferralMilestone" as const,
                id,
              })),
              { type: "ReferralMilestone" as const, id: "LIST" },
            ]
          : [{ type: "ReferralMilestone" as const, id: "LIST" }],
    }),

    // Update referral milestone (ADMIN)
    updateMilestone: builder.mutation<
      ApiResponse<ReferralMilestone>,
      { id: string; data: UpdateMilestoneParams }
    >({
      query: ({ id, data }) => ({
        url: `/referrals/milestones/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ReferralMilestone", id },
        { type: "ReferralMilestone", id: "LIST" },
      ],
    }),

    // Get my referrals (as referrer)
    getMyReferrals: builder.query<
      ApiResponse<ReferralListResponse>,
      GetReferralsParams
    >({
      query: (params = {}) => ({
        url: "/referrals/me",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Referral" as const,
                id,
              })),
              { type: "Referral" as const, id: "LIST" },
            ]
          : [{ type: "Referral" as const, id: "LIST" }],
    }),

    // Get all referrals (ADMIN)
    getAllReferrals: builder.query<
      ApiResponse<ReferralListResponse>,
      GetReferralsParams
    >({
      query: (params = {}) => ({
        url: "/referrals/get-all-referrals",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Referral" as const,
                id,
              })),
              { type: "Referral" as const, id: "ADMIN_LIST" },
            ]
          : [{ type: "Referral" as const, id: "ADMIN_LIST" }],
    }),

    // Get my referral rewards (as referrer)
    getMyReferralRewards: builder.query<ApiResponse<ReferralReward[]>, void>({
      query: () => ({
        url: "/referrals/me/rewards",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "ReferralReward" as const,
                id,
              })),
              { type: "ReferralReward" as const, id: "LIST" },
            ]
          : [{ type: "ReferralReward" as const, id: "LIST" }],
    }),

    // Get my referral summary (as referrer)
    getMyReferralSummary: builder.query<ApiResponse<ReferralSummary>, void>({
      query: () => ({
        url: "/referrals/me/summary",
        method: "GET",
      }),
      providesTags: ["ReferralSummary"],
    }),

    // Get single milestone by ID
    getMilestoneById: builder.query<
      ApiResponse<ReferralMilestone>,
      { id: string; params?: GetMilestonesParams }
    >({
      query: ({ id, params }) => ({
        url: `/referrals/milestones/${id}`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [
        { type: "ReferralMilestone", id },
      ],
    }),

    // Delete milestone (ADMIN) - Additional endpoint
    deleteMilestone: builder.mutation<ApiResponse<{ ok: boolean }>, string>({
      query: (id) => ({
        url: `/referrals/milestones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ReferralMilestone", id },
        { type: "ReferralMilestone", id: "LIST" },
      ],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useCreateMilestoneMutation,
  useGetMilestonesQuery,
  useUpdateMilestoneMutation,
  useGetMyReferralsQuery,
  useGetAllReferralsQuery,
  useGetMyReferralRewardsQuery,
  useGetMyReferralSummaryQuery,
  useGetMilestoneByIdQuery,
  useDeleteMilestoneMutation,
} = referralApi;
