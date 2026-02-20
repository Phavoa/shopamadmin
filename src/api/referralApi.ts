import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "@/lib/auth/authUtils";

// ─── Milestone Types ────────────────────────────────────────────────────────

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

export interface CreateMilestoneRequest {
  thresholdKobo: string;
  rewardKobo: string;
  label: string;
  order: number;
  active: boolean;
}

export interface UpdateMilestoneRequest {
  thresholdKobo?: string;
  rewardKobo?: string;
  label?: string;
  order?: number;
  active?: boolean;
}

// ─── Referral Types ──────────────────────────────────────────────────────────

export interface Referee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  referee: Referee;
  cumulativeSpendKobo: string;
  totalRewardsKobo: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Reward Types ────────────────────────────────────────────────────────────

export type RewardStatus = "PENDING" | "PAID" | "CANCELLED";

export interface ReferralReward {
  id: string;
  referrerId: string;
  referralId: string;
  milestoneId: string;
  amountKobo: string;
  status: RewardStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Summary Type ────────────────────────────────────────────────────────────

export interface ReferralSummary {
  totalReferrals: number;
  totalEarnedKobo: string;
}

// ─── Paginated Response ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  prevCursor?: string;
  total?: number;
}

// ─── Shared Query Params ─────────────────────────────────────────────────────

export interface BaseListParams {
  populate?: string[];
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

export interface ListMilestonesParams extends BaseListParams {
  active?: boolean;
}

export interface ListReferralsParams extends BaseListParams {
  referrerId?: string;
}

export interface ListRewardsParams extends BaseListParams {
  referrerId?: string;
  status?: RewardStatus;
  paidOnly?: boolean;
}

// ─── API Setup (mirrors adminApi pattern) ────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

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

const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh", method: "POST", body: { refreshToken } },
          api,
          extraOptions
        );

        if (refreshResult?.data && typeof refreshResult.data === "object") {
          const refreshData = refreshResult.data as {
            accessToken: string;
            refreshToken?: string;
          };
          authStorage.setTokens(refreshData.accessToken, refreshData.refreshToken);
          result = await baseQuery(args, api, extraOptions);
          return result;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }

    if (result?.error?.status === 401) {
      authStorage.clearTokens();
    }
  }

  return result;
};

// ─── Referral API Slice ───────────────────────────────────────────────────────

export const referralApi = createApi({
  reducerPath: "referralApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Milestone", "Referral", "Reward"],
  endpoints: (builder) => ({

    // ── Milestones ────────────────────────────────────────────────────────────

    // POST /api/referrals/milestones
    createMilestone: builder.mutation<
      ApiResponse<ReferralMilestone>,
      CreateMilestoneRequest
    >({
      query: (body) => ({
        url: "/referrals/milestones",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Milestone"],
    }),

    // GET /api/referrals/milestones
    getMilestones: builder.query<
      ApiResponse<PaginatedResponse<ReferralMilestone>>,
      ListMilestonesParams
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
                type: "Milestone" as const,
                id,
              })),
              { type: "Milestone" as const, id: "LIST" },
            ]
          : [{ type: "Milestone" as const, id: "LIST" }],
    }),

    // PATCH /api/referrals/milestones/{id}
    updateMilestone: builder.mutation<
      ApiResponse<ReferralMilestone>,
      { id: string; data: UpdateMilestoneRequest }
    >({
      query: ({ id, data }) => ({
        url: `/referrals/milestones/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Milestone", id },
        "Milestone",
      ],
    }),

    // ── Referrals ─────────────────────────────────────────────────────────────

    // GET /api/referrals/me  (current user as referrer)
    getMyReferrals: builder.query<
      ApiResponse<PaginatedResponse<Referral>>,
      ListReferralsParams
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
              { type: "Referral" as const, id: "MY_LIST" },
            ]
          : [{ type: "Referral" as const, id: "MY_LIST" }],
    }),

    // GET /api/referrals/get-all-referrals  (admin: all referrals)
    getAllReferrals: builder.query<
      ApiResponse<PaginatedResponse<Referral>>,
      ListReferralsParams
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
              { type: "Referral" as const, id: "ALL_LIST" },
            ]
          : [{ type: "Referral" as const, id: "ALL_LIST" }],
    }),

    // ── Rewards ───────────────────────────────────────────────────────────────

    // GET /api/referrals/me/rewards
    getMyRewards: builder.query<
      ApiResponse<PaginatedResponse<ReferralReward>>,
      ListRewardsParams
    >({
      query: (params = {}) => ({
        url: "/referrals/me/rewards",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Reward" as const,
                id,
              })),
              { type: "Reward" as const, id: "LIST" },
            ]
          : [{ type: "Reward" as const, id: "LIST" }],
    }),

    // GET /api/referrals/me/summary
    getMyReferralSummary: builder.query<
      ApiResponse<ReferralSummary>,
      void
    >({
      query: () => ({
        url: "/referrals/me/summary",
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),
  }),
});

// ─── Export Hooks ─────────────────────────────────────────────────────────────

export const {
  // Milestones
  useCreateMilestoneMutation,
  useGetMilestonesQuery,
  useLazyGetMilestonesQuery,
  useUpdateMilestoneMutation,
  // Referrals
  useGetMyReferralsQuery,
  useLazyGetMyReferralsQuery,
  useGetAllReferralsQuery,
  useLazyGetAllReferralsQuery,
  // Rewards
  useGetMyRewardsQuery,
  useLazyGetMyRewardsQuery,
  useGetMyReferralSummaryQuery,
} = referralApi;