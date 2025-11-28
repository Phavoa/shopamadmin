import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "@/lib/auth/authUtils";

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "HUB_ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CreateAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "HUB_ADMIN";
}

export interface UpdateAdminRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "HUB_ADMIN";
}

export interface ListAdminsParams {
  populate?: string[];
  sellerId?: string;
  addresses?: boolean;
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
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

          // Store new tokens in localStorage
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

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    // Create new admin
    createAdmin: builder.mutation<ApiResponse<Admin>, CreateAdminRequest>({
      query: (adminData) => ({
        url: "/admin",
        method: "POST",
        body: adminData,
      }),
      invalidatesTags: ["Admin"],
    }),

    // List administrators
    getAdmins: builder.query<ApiResponse<{ items: Admin[] }>, ListAdminsParams>(
      {
        query: (params = {}) => ({
          url: "/admin",
          method: "GET",
          params,
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.data.items.map(({ id }) => ({
                  type: "Admin" as const,
                  id,
                })),
                { type: "Admin" as const, id: "LIST" },
              ]
            : [{ type: "Admin" as const, id: "LIST" }],
      }
    ),

    // Get admin by id
    getAdminById: builder.query<ApiResponse<Admin>, string>({
      query: (adminId) => ({
        url: `/admin/${adminId}`,
        method: "GET",
      }),
      providesTags: (result, error, adminId) => [
        { type: "Admin", id: adminId },
      ],
    }),

    // Update admin (role change = SUPER ADMIN only)
    updateAdmin: builder.mutation<
      ApiResponse<Admin>,
      { id: string; data: UpdateAdminRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Admin", id },
        "Admin",
      ],
    }),

    // Remove admin (soft delete)
    deleteAdmin: builder.mutation<ApiResponse<{ ok: boolean }>, string>({
      query: (adminId) => ({
        url: `/admin/${adminId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, adminId) => [
        { type: "Admin", id: adminId },
        "Admin",
      ],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useCreateAdminMutation,
  useGetAdminsQuery,
  useLazyGetAdminsQuery,
  useGetAdminByIdQuery,
  useLazyGetAdminByIdQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
