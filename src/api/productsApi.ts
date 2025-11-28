import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "../lib/auth/authUtils";

// Types based on API documentation and actual response
export interface CreateProductRequest {
  title: string;
  description: string;
  price: string;
  stockQty: number;
  images?: string[];
  thumbnailUrl?: string;
  categoryIds?: string[];
  categorySlugs?: string[];
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  price?: string;
  stockQty?: number;
  images?: string[];
  thumbnailUrl?: string;
  categoryIds?: string[];
  categorySlugs?: string[];
  basePrice?: string; // Admin only
  status?: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED"; // Admin only
  priceChangeNote?: string; // For price changes
}

export interface ProductImage {
  id: string;
  url: string;
  position: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface SellerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  imageUrl?: string | null;
}

export interface SellerProfile {
  userId: string;
  status: string;
  shopName: string;
  logoUrl?: string;
  businessName: string;
  locationState: string;
  locationCity: string;
  user: SellerUser;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: string;
  basePrice: string;
  currency: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  slug: string;
  thumbnailUrl?: string;
  imageIds: string[];
  categoryIds: string[];
  images?: ProductImage[];
  categories?: ProductCategory[];
  stockQty: number;
  createdAt: string;
  updatedAt: string;
  // Populated fields when requested
  sellerProfile?: SellerProfile;
  wishlisted?: boolean;
}

export interface ProductsListParams {
  populate?: string[]; // e.g., ["images", "categories.category", "seller", "seller.user"]
  q?: string; // Search term
  limit?: number; // 1-50 (default 20)
  after?: string; // Opaque cursor for forward paging
  before?: string; // Opaque cursor for backward paging
  sortBy?: "createdAt" | "price" | "title";
  sortDir?: "asc" | "desc";
  status?: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  sellerId?: string; // Filter by sellerId (SellerProfile.userId)
  categoryId?: string; // Single id or CSV
  categorySlug?: string; // Single slug or CSV
  wishlistedOnly?: boolean; // If true, only products the current user has wishlisted
}

export interface ProductsListResponse {
  items: Product[];
  nextCursor?: string;
  prevCursor?: string;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
  sortBy: string;
  sortDir: string;
  totalCount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
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

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "Products"],
  endpoints: (builder) => ({
    // Create product (seller)
    createProduct: builder.mutation<ApiResponse<Product>, CreateProductRequest>(
      {
        query: (productData) => ({
          url: "/products",
          method: "POST",
          body: productData,
        }),
        invalidatesTags: ["Products", "Product"],
      }
    ),

    // List products (public, keyset pagination + nested populate)
    getProducts: builder.query<
      ApiResponse<ProductsListResponse>,
      ProductsListParams
    >({
      query: (params = {}) => {
        const url = new URL(`${API_BASE_URL}/products`);

        // Handle populate parameter (can be array or CSV)
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
      providesTags: ["Products"],
    }),

    // Update product (partial). Role-aware price rules.
    updateProduct: builder.mutation<
      ApiResponse<Product>,
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Product", id },
      ],
    }),

    // Get product by id (public)
    getProduct: builder.query<
      ApiResponse<Product>,
      { id: string; populate?: string[] }
    >({
      query: ({ id, populate }) => {
        const url = new URL(`${API_BASE_URL}/products/${id}`);

        if (populate && populate.length > 0) {
          const populateValue = Array.isArray(populate)
            ? populate.join(",")
            : populate;
          url.searchParams.set("populate", populateValue);
        }

        return {
          url: url.toString().replace(API_BASE_URL, ""),
          method: "GET",
        };
      },
      providesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    // Archive product (soft delete)
    archiveProduct: builder.mutation<ApiResponse<Product>, { id: string }>({
      query: ({ id }) => ({
        url: `/products/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Product", id },
      ],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useUpdateProductMutation,
  useGetProductQuery,
  useLazyGetProductQuery,
  useArchiveProductMutation,
} = productsApi;
