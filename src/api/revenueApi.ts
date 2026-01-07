// revenueApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Types for revenue data
export interface ShopAmRevenue {
  sixPercent: number;
  fivePercent: number;
  threePercent: number;
  total: number;
}

export interface VatRevenue {
  vatCollected: number;
  vatRate: number;
  applicableTransactions: number;
}

export interface LivestreamRevenue {
  totalFees: number;
  totalSellers: number;
  averageFee: number;
}

export interface RevenueMetrics {
  shopAmRevenue: ShopAmRevenue;
  vatRevenue: VatRevenue;
  livestreamRevenue: LivestreamRevenue;
}

// Create the revenue API
export const revenueApi = createApi({
  reducerPath: "revenueApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/revenue",
  }),
  tagTypes: ["Revenue"],
  endpoints: (builder) => ({
    getRevenueMetrics: builder.query<RevenueMetrics, void>({
      queryFn: async (): Promise<
        { data: RevenueMetrics } | { error: FetchBaseQueryError }
      > => {
        try {
          // Using dummy data as requested
          const dummyData: RevenueMetrics = {
            shopAmRevenue: {
              sixPercent: 1250000, // ₦1.25M from 6% commission
              fivePercent: 980000, // ₦980K from 5% commission
              threePercent: 450000, // ₦450K from 3% commission
              total: 2680000, // ₦2.68M total
            },
            vatRevenue: {
              vatCollected: 850000, // ₦850K VAT collected
              vatRate: 7.5,
              applicableTransactions: 1250,
            },
            livestreamRevenue: {
              totalFees: 1560000, // ₦1.56M from livestream fees
              totalSellers: 78, // 78 sellers
              averageFee: 20000, // ₦20K average fee per seller
            },
          };

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          return { data: dummyData };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Failed to fetch revenue metrics",
            },
          };
        }
      },
      providesTags: ["Revenue"],
    }),

    getShopAmRevenue: builder.query<ShopAmRevenue, void>({
      queryFn: async (): Promise<
        { data: ShopAmRevenue } | { error: FetchBaseQueryError }
      > => {
        try {
          const dummyData: ShopAmRevenue = {
            sixPercent: 1250000,
            fivePercent: 980000,
            threePercent: 450000,
            total: 2680000,
          };

          await new Promise((resolve) => setTimeout(resolve, 300));
          return { data: dummyData };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Failed to fetch ShopAm revenue",
            },
          };
        }
      },
      providesTags: ["Revenue"],
    }),

    getVatRevenue: builder.query<VatRevenue, void>({
      queryFn: async (): Promise<
        { data: VatRevenue } | { error: FetchBaseQueryError }
      > => {
        try {
          const dummyData: VatRevenue = {
            vatCollected: 850000,
            vatRate: 7.5,
            applicableTransactions: 1250,
          };

          await new Promise((resolve) => setTimeout(resolve, 300));
          return { data: dummyData };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Failed to fetch VAT revenue",
            },
          };
        }
      },
      providesTags: ["Revenue"],
    }),

    getLivestreamRevenue: builder.query<LivestreamRevenue, void>({
      queryFn: async (): Promise<
        { data: LivestreamRevenue } | { error: FetchBaseQueryError }
      > => {
        try {
          const dummyData: LivestreamRevenue = {
            totalFees: 1560000,
            totalSellers: 78,
            averageFee: 20000,
          };

          await new Promise((resolve) => setTimeout(resolve, 300));
          return { data: dummyData };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Failed to fetch livestream revenue",
            },
          };
        }
      },
      providesTags: ["Revenue"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetRevenueMetricsQuery,
  useGetShopAmRevenueQuery,
  useGetVatRevenueQuery,
  useGetLivestreamRevenueQuery,
} = revenueApi;
