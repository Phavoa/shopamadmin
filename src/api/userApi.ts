import type { ApiResponse, User } from "../types/auth";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateUser } from "../features/auth/authSlice";

import { UpdateProfileRequest, ListUsersParams } from "../types/user";
import { authStorage } from "@/lib/auth/authUtils";

export interface UserRelationship {
  isFollowing: boolean;
  isFollower: boolean;
  isBlocked: boolean;
  blockedByThem: boolean;
}

export interface FollowResponse {
  ok: boolean;
}

export interface StateData {
  state: string;
  alias: string;
  lgas: string[];
}

export interface StatesResponse {
  states: StateData[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

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
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
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
        localStorage.setItem("authToken", refreshData.accessToken);
        if (refreshData.refreshToken) {
          localStorage.setItem("refreshToken", refreshData.refreshToken);
        }
        // Retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
      }
    }
  }

  return result;
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Relationship"],
  endpoints: (builder) => ({
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateMe: builder.mutation<ApiResponse<User>, UpdateProfileRequest>({
      query: (body) => ({
        url: "/user/me",
        method: "PUT",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data.data));
        } catch (err) {
          console.error("Update me error:", err);
        }
      },
      invalidatesTags: ["User"],
    }),

    // Get user by sellerId (handles both userId and sellerProfile.userId)
    getUserBySellerId: builder.query<ApiResponse<User>, string>({
      async queryFn(sellerId, _api, _extraOptions, baseQuery) {
        console.log("🔍 getUserBySellerId - Looking for sellerId:", sellerId);

        // Fetch all users with seller profiles
        const result = (await baseQuery({
          url: `/user`,
          method: "GET",
          params: {
            hasSeller: true,
            populate: "sellerProfile",
            limit: 100,
          },
        })) as { data?: ApiResponse<{ items: User[] }> };

        if (result.data?.data?.items) {
          const users = result.data.data.items;
          console.log("🔍 Total users fetched:", users.length);

          // Try to find user by multiple criteria
          const user = users.find((u: User) => {
            // Match by user.id
            if (u.id === sellerId) {
              console.log("✅ Found by user.id");
              return true;
            }
            // Match by seller.userId
            if (u.seller?.userId === sellerId) {
              console.log("✅ Found by seller.userId");
              return true;
            }
            return false;
          });

          if (user) {
            console.log("✅ Found user:", {
              userId: user.id,
              name: `${user.firstName} ${user.lastName}`,
              sellerUserId: user.seller?.userId,
            });

            return {
              data: {
                data: user,
                statusCode: 200,
                message: "User found",
              },
            };
          }

          console.error("❌ User not found. Searched for:", sellerId);
          console.log(
            "Available IDs:",
            users.map((u) => ({
              userId: u.id,
              sellerUserId: u.seller?.userId,
            }))
          );
        }

        return {
          error: {
            status: 404,
            data: { message: "Seller not found" },
          },
        };
      },
      providesTags: (result, error, sellerId) => [
        { type: "User", id: sellerId },
      ],
    }),

    // Get relationship - finds correct userId first
    getUserRelationship: builder.query<UserRelationship, string>({
      async queryFn(sellerId, _api, _extraOptions, baseQuery) {
        // First get the user to find their actual userId
        const userResult = (await baseQuery({
          url: `/user`,
          method: "GET",
          params: {
            hasSeller: true,
            populate: "sellerProfile",
            limit: 100,
          },
        })) as { data?: ApiResponse<{ items: User[] }> };

        if (userResult.data?.data?.items) {
          const user = userResult.data.data.items.find(
            (u: User) => u.id === sellerId || u.seller?.userId === sellerId
          );

          if (user) {
            // Now get relationship using the correct userId
            const relationshipResult = (await baseQuery({
              url: `/user/${user.id}/relationship`,
              method: "GET",
            })) as { data?: UserRelationship };

            if (relationshipResult.data) {
              return { data: relationshipResult.data };
            }
          }
        }

        // Return default values if not found
        return {
          data: {
            isFollowing: false,
            isFollower: false,
            isBlocked: false,
            blockedByThem: false,
          },
        };
      },
      providesTags: (result, error, sellerId) => [
        { type: "Relationship", id: sellerId },
      ],
    }),

    // Follow user - finds correct userId first
    followUser: builder.mutation<FollowResponse, string>({
      async queryFn(sellerId, _api, _extraOptions, baseQuery) {
        // Get user first to find correct userId
        const userResult = (await baseQuery({
          url: `/user`,
          method: "GET",
          params: {
            hasSeller: true,
            populate: "sellerProfile",
            limit: 100,
          },
        })) as { data?: ApiResponse<{ items: User[] }> };

        if (userResult.data?.data?.items) {
          const user = userResult.data.data.items.find(
            (u: User) => u.id === sellerId || u.seller?.userId === sellerId
          );

          if (user) {
            console.log("🔍 Following user:", user.id);
            const result = (await baseQuery({
              url: `/user/${user.id}/follow`,
              method: "POST",
            })) as { data?: FollowResponse };

            if (result.data) {
              return { data: result.data };
            }
          }
        }

        return { error: { status: 400, data: { message: "User not found" } } };
      },
      invalidatesTags: (result, error, sellerId) => [
        { type: "Relationship", id: sellerId },
        { type: "User", id: sellerId },
        "User",
        "Relationship",
      ],
    }),

    // Unfollow user - finds correct userId first
    unfollowUser: builder.mutation<FollowResponse, string>({
      async queryFn(sellerId, _api, _extraOptions, baseQuery) {
        // Get user first to find correct userId
        const userResult = (await baseQuery({
          url: `/user`,
          method: "GET",
          params: {
            hasSeller: true,
            populate: "sellerProfile",
            limit: 100,
          },
        })) as { data?: ApiResponse<{ items: User[] }> };

        if (userResult.data?.data?.items) {
          const user = userResult.data.data.items.find(
            (u: User) => u.id === sellerId || u.seller?.userId === sellerId
          );

          if (user) {
            console.log("🔍 Unfollowing user:", user.id);
            const result = (await baseQuery({
              url: `/user/${user.id}/follow`,
              method: "DELETE",
            })) as { data?: FollowResponse };

            if (result.data) {
              return { data: result.data };
            }
          }
        }

        return { error: { status: 400, data: { message: "User not found" } } };
      },
      invalidatesTags: (result, error, sellerId) => [
        { type: "Relationship", id: sellerId },
        { type: "User", id: sellerId },
        "User",
        "Relationship",
      ],
    }),

    getStates: builder.query<StatesResponse, void>({
      query: () => ({
        url: "/user/states",
        method: "GET",
      }),
    }),

    // Get all users
    /**
     * GET /api/user
     * List users (keyset pagination + optional populate)
     *
     * Lists users with keyset pagination (opaque after/before cursors).
     *
     * Search & Filters:
     * - q: case-insensitive match across firstName, lastName, email, phone
     * - hasSeller: filter users that (do/do not) have a seller profile
     * - sellerStatus, sellerTier, state, city: apply seller-related filters (when present)
     *
     * Sorting:
     * - sortBy: one of createdAt, lastName, sellerTotalSales (relation sort by sellerProfile.totalSales)
     * - sortDir: asc | desc (default desc). Stable tiebreaker on id is applied.
     *
     * Counts:
     * - Each user always includes followersCount and followingCount
     *
     * Populate (expand related data) — allowed:
     * - sellerProfile, addresses
     * - Social graph (id-only arrays by default): followers, following, blocks, blockedBy
     *
     * Tip: If you don't pass populate, the response still includes id-only arrays for these social relations (capped) due to repo configuration.
     */
    getUsers: builder.query<ApiResponse<{ items: User[] }>, ListUsersParams>({
      query: (params = {}) => ({
        url: "/user",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "User" as const,
                id,
              })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),

    // Get user by ID
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useGetUserBySellerIdQuery,
  useLazyGetUserBySellerIdQuery,
  useGetUserRelationshipQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetStatesQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
} = userApi;
