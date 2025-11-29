"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useGetUserByIdQuery } from "@/api/userApi";
import { getOrderStatisticsBySeller, OrderStatistics } from "@/api/ordersApi";
import { useGetProductsQuery } from "@/api/productsApi";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import {
  AnimatedWrapper,
  PageWrapper,
} from "@/components/shared/AnimatedWrapper";
import SellerProfileCard from "@/components/sellers/SellerProfileCard";
import LivestreamTierManagement from "@/components/sellers/LivestreamTierManagement";
import SellerProfileSkeleton from "@/components/sellers/SellerProfileSkeleton";
import { SellerProfile } from "@/types/user";

// Type for display seller data
interface DisplaySeller {
  id: string;
  name: string;
  email: string;
  status: string;
  tier: string;
  shopName: string;
  businessCategory: string;
  location: string;
  totalSales: string;
  createdAt: string;
  reliability?: string;
  strikes?: number;
  lastLive?: string;
  walletBalance?: string;
  totalOrders?: number;
  completedOrders?: number;
  activeListings?: number;
  nextSlot?: string;
}

const SellerProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const sellerId = params.id as string;

  // State for order statistics
  const [orderStatistics, setOrderStatistics] =
    useState<OrderStatistics | null>(null);
  const [orderStatsLoading, setOrderStatsLoading] = useState(false);
  const [orderStatsError, setOrderStatsError] = useState<string | null>(null);

  // State for active listings count
  const [activeListingsCount, setActiveListingsCount] = useState(0);

  // Use RTK Query to fetch user data with seller information
  const {
    data: userResponse,
    isLoading,
    error: queryError,
  } = useGetUserByIdQuery(sellerId);

  useEffect(() => {
    dispatch(setHeaderTitle("Seller Profile"));
  }, [dispatch]);

  // Process user data for display
  const user = userResponse?.data;
  const seller = user?.seller;

  // Fetch order statistics when seller data is available
  useEffect(() => {
    const fetchOrderStatistics = async () => {
      if (!seller?.userId) return;

      setOrderStatsLoading(true);
      setOrderStatsError(null);

      try {
        const response = await getOrderStatisticsBySeller(seller.userId);
        if (response.success) {
          setOrderStatistics(response.data);
        } else {
          setOrderStatsError("Failed to fetch order statistics");
        }
      } catch (error) {
        console.error("Error fetching order statistics:", error);
        setOrderStatsError("Error fetching order statistics");
      } finally {
        setOrderStatsLoading(false);
      }
    };

    fetchOrderStatistics();
  }, [seller?.userId]);

  // Use RTK Query to fetch products for active listings count
  const productsQueryParams = seller?.userId
    ? { sellerId: seller.userId, limit: 1000 }
    : { limit: 1000 };

  const {
    data: productsResponse,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery(productsQueryParams, {
    skip: !seller?.userId,
  });

  // Calculate active listings count when products data is available
  useEffect(() => {
    if (productsResponse?.data?.items) {
      const activeProducts = productsResponse.data.items.filter(
        (product) => product.status === "ACTIVE"
      );
      setActiveListingsCount(activeProducts.length);
    }
  }, [productsResponse?.data?.items]);

  // Create display seller object from API response
  const displaySeller: DisplaySeller | null =
    user && seller
      ? {
          id: seller.userId,
          name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
          email: user.email,
          status: seller.status.toLowerCase(),
          tier: seller.tier,
          shopName: seller.shopName,
          businessCategory: seller.businessCategory,
          location: `${seller.locationCity}, ${seller.locationState}`,
          totalSales: seller.totalSales,
          createdAt: seller.createdAt,
          reliability: "95%", // From user.followersCount calculation if needed
          strikes: 0, // Dummy - would need separate API
          lastLive: "Aug 30 (Bronze, 210 viewers)", // Dummy - would need separate API
          walletBalance: "₦340,000", // Dummy - would need separate API
          totalOrders: orderStatistics?.totalOrders || 0,
          completedOrders: orderStatistics?.completedOrders || 0,
          activeListings: activeListingsCount,
          nextSlot: "Sep 6, 2025 14:00 (Bronze)", // Dummy - would need separate API
        }
      : null;

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return <SellerProfileSkeleton />;
  }

  // Error state
  if (queryError || !displaySeller) {
    const errorMessage = queryError
      ? "Failed to load seller profile. Please try again."
      : "Seller not found";

    return (
      <PageWrapper className="min-h-screen bg-white">
        <div className="px-6 py-4">
          <button
            onClick={handleBack}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Sellers List
          </button>

          <div className="flex items-center justify-center h-64">
            <div className="text-red-600">{errorMessage}</div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Main profile view
  return (
    <PageWrapper className="min-h-screen">
      {/* Back Button */}
      <div className="px-6 py-4">
        <AnimatedWrapper animation="slideLeft" delay={0.1}>
          <button
            onClick={handleBack}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Sellers List
          </button>
        </AnimatedWrapper>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <AnimatedWrapper animation="fadeIn" delay={0.2}>
          <div className="grid grid-cols-12 gap-6">
            {/* Left Side - Seller Profile */}
            <SellerProfileCard
              displaySeller={displaySeller}
              user={user}
              seller={seller}
              orderStatistics={orderStatistics}
              orderStatsLoading={orderStatsLoading}
              orderStatsError={orderStatsError}
              activeListingsCount={activeListingsCount}
              productsLoading={productsLoading}
              productsError={productsError}
            />

            {/* Right Side - Actions */}
            <LivestreamTierManagement
              displaySeller={displaySeller}
              user={user}
              seller={seller}
            />
          </div>
        </AnimatedWrapper>
      </div>
    </PageWrapper>
  );
};

export default SellerProfilePage;
