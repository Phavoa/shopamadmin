import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "@/lib/auth/authUtils";

// --- Interfaces ---

export interface LivestreamCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLivestreamCategoryRequest {
  name: string;
  image?: string;
  slug?: string;
  description?: string;
}

export interface UpdateLivestreamCategoryRequest {
  name?: string;
  image?: string;
  slug?: string;
  description?: string;
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
  items: LivestreamCategory[];
  nextCursor?: string | null;
  prevCursor?: string | null;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  statusCode?: number;
}

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

export const livestreamCategoriesApi = createApi({
  reducerPath: "livestreamCategoriesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["LivestreamCategory", "LivestreamCategories"],
  endpoints: (builder) => ({
    // List livestream categories
    getLivestreamCategories: builder.query<
      ApiResponse<LivestreamCategoriesListResponse>,
      LivestreamCategoriesListParams
    >({
      query: (params = {}) => {
        const url = new URL(`${API_BASE_URL}/streams/categories`);

        // Handle populate array
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

    // Get single livestream category by id or slug
    getLivestreamCategory: builder.query<
      ApiResponse<LivestreamCategory>,
      string
    >({
      query: (idOrSlug) => `/streams/categories/${idOrSlug}`,
      providesTags: (result, error, idOrSlug) => [
        { type: "LivestreamCategory", id: idOrSlug },
      ],
    }),

    // Create livestream category (ADMIN)
    createLivestreamCategory: builder.mutation<
      ApiResponse<LivestreamCategory>,
      CreateLivestreamCategoryRequest
    >({
      query: (body) => ({
        url: "/streams/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LivestreamCategories"],
    }),

    // Update livestream category (ADMIN)
    updateLivestreamCategory: builder.mutation<
      ApiResponse<LivestreamCategory>,
      { idOrSlug: string; data: UpdateLivestreamCategoryRequest }
    >({
      query: ({ idOrSlug, data }) => ({
        url: `/streams/categories/${idOrSlug}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { idOrSlug }) => [
        "LivestreamCategories",
        { type: "LivestreamCategory", id: idOrSlug },
      ],
    }),

    // Delete livestream category (ADMIN)
    deleteLivestreamCategory: builder.mutation<
      ApiResponse<{ ok: boolean; id: string }>,
      string
    >({
      query: (idOrSlug) => ({
        url: `/streams/categories/${idOrSlug}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, idOrSlug) => [
        "LivestreamCategories",
        { type: "LivestreamCategory", id: idOrSlug },
      ],
    }),
  }),
});

export const {
  useGetLivestreamCategoriesQuery,
  useLazyGetLivestreamCategoriesQuery,
  useGetLivestreamCategoryQuery,
  useCreateLivestreamCategoryMutation,
  useUpdateLivestreamCategoryMutation,
  useDeleteLivestreamCategoryMutation,
} = livestreamCategoriesApi;
