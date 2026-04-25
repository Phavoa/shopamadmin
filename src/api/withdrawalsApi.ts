import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "../types/auth";
import { authStorage } from "@/lib/auth/authUtils";

export interface Withdrawal {
  id: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    addresses?: any[];
  };
  sellerId?: string;
  seller?: {
    sellerTotalSales: string;
  };
  bankDetail?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  amountKobo: string;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED" | "APPROVED" | "REJECTED" | "ON_HOLD";
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListWithdrawalsParams {
  populate?: string[] | string;
  sellerId?: string;
  q?: string;
  phone?: string;
  limit?: number;
  after?: string;
  before?: string;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
  userId?: string;
  walletId?: string;
  status?: string;
}

export interface ReviewWithdrawalRequest {
  action: "APPROVE" | "REJECT" | "HOLD";
  reason?: string;
}

export interface BulkReviewWithdrawalRequest {
  ids: string[];
  action: "APPROVE" | "REJECT" | "HOLD";
  reason?: string;
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

export const withdrawalsApi = createApi({
  reducerPath: "withdrawalsApi",
  baseQuery: baseQuery,
  tagTypes: ["Withdrawal"],
  endpoints: (builder) => ({
    getWithdrawals: builder.query<ApiResponse<{ items: Withdrawal[]; nextCursor?: string; hasNext: boolean }>, ListWithdrawalsParams>({
      query: (params) => ({
        url: "/admin/withdrawals",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Withdrawal" as const, id })),
              { type: "Withdrawal", id: "LIST" },
            ]
          : [{ type: "Withdrawal", id: "LIST" }],
    }),

    reviewWithdrawal: builder.mutation<ApiResponse<Withdrawal>, { id: string; body: ReviewWithdrawalRequest }>({
      query: ({ id, body }) => ({
        url: `/admin/withdrawals/${id}/review`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Withdrawal", id }, { type: "Withdrawal", id: "LIST" }],
    }),

    bulkReviewWithdrawals: builder.mutation<ApiResponse<any>, BulkReviewWithdrawalRequest>({
      query: (body) => ({
        url: "/admin/withdrawals/bulk-review",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Withdrawal", id: "LIST" }],
    }),
  }),
});

export const {
  useGetWithdrawalsQuery,
  useReviewWithdrawalMutation,
  useBulkReviewWithdrawalsMutation,
} = withdrawalsApi;
