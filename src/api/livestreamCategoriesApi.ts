import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "@/lib/auth/authUtils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LivestreamCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface CreateLivestreamCategoryRequest {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateLivestreamCategoryRequest {
  name?: string;
  description?: string;
  image?: string;
}

export interface LivestreamCategoriesListParams {
  populate?: string[];
  q?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

export interface LivestreamCategoriesListResponse {
  items?: LivestreamCategory[];
  data?: LivestreamCategory[];
  nextCursor?: string;
  prevCursor?: string;
  pageSize?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  sortBy?: string;
  sortDir?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
  statusCode?: number;
}

export interface GetLivestreamCategoriesApiResponse {
  message: string;
  data: LivestreamCategory[];
  statusCode: number;
}

export interface CreateLivestreamCategoryApiResponse {
  message: string;
  data: LivestreamCategory;
  statusCode: number;
}

export interface UpdateLivestreamCategoryApiResponse {
  message: string;
  data: LivestreamCategory;
  statusCode: number;
}

export interface DeleteLivestreamCategoryApiResponse {
  message: string;
}

// ─── API Base ─────────────────────────────────────────────────────────────────

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
  extraOptions: Parameters<typeof baseQuery>[2],
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
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
          extraOptions,
        );

        if (refreshResult?.data && typeof refreshResult.data === "object") {
          const refreshData = refreshResult.data as {
            accessToken: string;
            refreshToken?: string;
          };

          authStorage.setTokens(
            refreshData.accessToken,
            refreshData.refreshToken,
          );

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

// ─── RTK Query API ────────────────────────────────────────────────────────────

export const livestreamCategoriesApi = createApi({
  reducerPath: "livestreamCategoriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["LivestreamCategory", "LivestreamCategories"],
  endpoints: (builder) => ({
    // POST /api/streams/categories — Admin only
    createLivestreamCategory: builder.mutation<
      CreateLivestreamCategoryApiResponse,
      CreateLivestreamCategoryRequest
    >({
      query: (body) => ({
        url: "/streams/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LivestreamCategories", "LivestreamCategory"],
    }),

    // GET /api/streams/categories
    getLivestreamCategories: builder.query<
      GetLivestreamCategoriesApiResponse,
      LivestreamCategoriesListParams
    >({
      query: (params = {}) => {
        const url = new URL(`${API_BASE_URL}/streams/categories`);

        if (params.populate) {
          const populateValue = Array.isArray(params.populate)
            ? params.populate.join(",")
            : params.populate;
          url.searchParams.set("populate", populateValue as string);
        }

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
      providesTags: ["LivestreamCategories"],
    }),

    // PUT /api/streams/categories/:id — Admin only
    updateLivestreamCategory: builder.mutation<
      UpdateLivestreamCategoryApiResponse,
      { id: string; data: UpdateLivestreamCategoryRequest }
    >({
      query: ({ id, data }) => ({
        url: `/streams/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "LivestreamCategories",
        { type: "LivestreamCategory", id },
      ],
    }),

    // DELETE /api/streams/:id/categories — Admin only
    deleteLivestreamCategory: builder.mutation<
      DeleteLivestreamCategoryApiResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/streams/${id}/categories`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        "LivestreamCategories",
        { type: "LivestreamCategory", id },
      ],
    }),
  }),
});

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const {
  useCreateLivestreamCategoryMutation,
  useGetLivestreamCategoriesQuery,
  useLazyGetLivestreamCategoriesQuery,
  useUpdateLivestreamCategoryMutation,
  useDeleteLivestreamCategoryMutation,
} = livestreamCategoriesApi;
