import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "../lib/auth/authUtils";

// Types based on API documentation
export interface CreateCategoryRequest {
  name: string;
  image?: string; // Optional category image URL
  slug?: string; // Optional, will be generated from name if omitted
}

export interface UpdateCategoryRequest {
  name?: string;
  image?: string; // Optional category image URL
  slug?: string; // Optional, will be re-derived from name if name changes and slug not provided
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string; // Optional category image URL
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesListParams {
  populate?: string[]; // Currently no populatable relations for categories
  q?: string; // Search by name (case-insensitive contains)
  limit?: number; // 1-50 (default 20)
  after?: string; // Opaque cursor for forward paging
  before?: string; // Opaque cursor for backward paging
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

export interface CategoriesListResponse {
  items: Category[];
  nextCursor?: string;
  prevCursor?: string;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  q?: string;
  sortBy: string;
  sortDir: string;
}

export interface DeleteCategoryResponse {
  ok: boolean;
  id: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
  statusCode?: number;
}

// Specific response types to match API documentation
export interface CreateCategoryApiResponse extends ApiResponse<Category> {
  message: "Category created";
  statusCode: 201;
}

export interface UpdateCategoryApiResponse extends ApiResponse<Category> {
  message: "Category updated";
  statusCode: 200;
}

export interface DeleteCategoryApiResponse
  extends ApiResponse<DeleteCategoryResponse> {
  message: "Category deleted";
  statusCode: 200;
}

export interface GetCategoryApiResponse extends ApiResponse<Category> {
  message: "Category retrieved";
  statusCode: 200;
}

export interface GetCategoriesApiResponse
  extends ApiResponse<CategoriesListResponse> {
  message: "Categories retrieved";
  statusCode: 200;
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
  }

  return result;
};

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Category", "Categories"],
  endpoints: (builder) => ({
    // Create category (ADMIN – temporarily public)
    createCategory: builder.mutation<
      CreateCategoryApiResponse,
      CreateCategoryRequest
    >({
      query: (categoryData) => ({
        url: "/categories",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Categories", "Category"],
    }),

    // List categories (public, keyset pagination)
    getCategories: builder.query<
      GetCategoriesApiResponse,
      CategoriesListParams
    >({
      query: (params = {}) => {
        const url = new URL(`${API_BASE_URL}/categories`);

        // Handle populate parameter (currently no populatable relations)
        if (params.populate) {
          const populateValue = Array.isArray(params.populate)
            ? params.populate.join(",")
            : params.populate;
          url.searchParams.set("populate", populateValue);
        }

        // Add other parameters
        Object.entries(params).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            key !== "populate"
          ) {
            url.searchParams.set(key, value.toString());
          }
        });

        return {
          url: url.toString().replace(API_BASE_URL, ""),
          method: "GET",
        };
      },
      providesTags: ["Categories"],
    }),

    // Update category by id or slug (ADMIN – temp public)
    updateCategory: builder.mutation<
      UpdateCategoryApiResponse,
      { idOrSlug: string; data: UpdateCategoryRequest }
    >({
      query: ({ idOrSlug, data }) => ({
        url: `/categories/${idOrSlug}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { idOrSlug }) => [
        "Categories",
        { type: "Category", id: idOrSlug },
      ],
    }),

    // Get category by id or slug (public)
    getCategory: builder.query<GetCategoryApiResponse, { idOrSlug: string }>({
      query: ({ idOrSlug }) => ({
        url: `/categories/${idOrSlug}`,
        method: "GET",
      }),
      providesTags: (result, error, { idOrSlug }) => [
        { type: "Category", id: idOrSlug },
      ],
    }),

    // Delete category by id or slug (ADMIN – temp public)
    deleteCategory: builder.mutation<
      DeleteCategoryApiResponse,
      { idOrSlug: string }
    >({
      query: ({ idOrSlug }) => ({
        url: `/categories/${idOrSlug}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { idOrSlug }) => [
        "Categories",
        { type: "Category", id: idOrSlug },
      ],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useUpdateCategoryMutation,
  useGetCategoryQuery,
  useLazyGetCategoryQuery,
  useDeleteCategoryMutation,
} = categoriesApi;
