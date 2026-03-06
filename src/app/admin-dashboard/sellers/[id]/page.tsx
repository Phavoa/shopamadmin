"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useGetUserByIdQuery } from "@/api/userApi";
import { getOrderStatisticsBySeller, OrderStatistics } from "@/api/ordersApi";
import { useGetProductsQuery } from "@/api/productsApi";
import { useLazyGetLiveStreamsQuery } from "@/api/liveStreamApi";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import {
  AnimatedWrapper,
  PageWrapper,
} from "@/components/shared/AnimatedWrapper";
import SellerProfileCard from "@/components/sellers/SellerProfileCard";
import LivestreamTierManagement from "@/components/sellers/LivestreamTierManagement";
import SellerProfileSkeleton from "@/components/sellers/SellerProfileSkeleton";

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
  activeListings?: number;
  nextSlot?: string;
  disciplineStatus?: string;
  totalOrders?: number;
  completedOrders?: number;
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

  const [triggerGetStreams] = useLazyGetLiveStreamsQuery();
  const [lastLiveDate, setLastLiveDate] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setHeaderTitle("Seller Profile"));
  }, [dispatch]);

  // Process user data for display
  const user = userResponse?.data;
  const seller = user?.seller;

  // Fetch order statistics and last live stream when seller data is available
  useEffect(() => {
    const fetchSellerDetails = async () => {
      if (!seller?.id) return; // Use seller.id (database ID) for statistics generally, but check both

      // 1. Order Statistics
      setOrderStatsLoading(true);
      setOrderStatsError(null);

      try {
        // Use the seller profile ID, or user ID depending on endpoint requirement.
        // Based on ordersApi, it uses sellerId.
        const response = await getOrderStatisticsBySeller(seller.id);
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

      // 2. Last Live stream
      try {
        const liveResult = await triggerGetStreams({
          sellerId: seller.userId,
          status: "ENDED",
          limit: 1,
          sortBy: "createdAt",
          sortDir: "desc",
        }).unwrap();

        if (liveResult.data?.items?.length > 0) {
          const stream = liveResult.data.items[0];
          const date = stream.endedAt || stream.startedAt || stream.createdAt;
          if (date) {
            setLastLiveDate(
              new Date(date).toLocaleDateString("en-NG", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            );
          }
        }
      } catch (err) {
        console.error("Error fetching last live:", err);
      }
    };

    fetchSellerDetails();
  }, [seller?.id, seller?.userId, triggerGetStreams]);

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
        (product) => product.status === "ACTIVE",
      );
      setActiveListingsCount(activeProducts.length);
    }
  }, [productsResponse?.data?.items]);

  // Transform RTK Query error to expected format
  const transformedProductsError = React.useMemo(() => {
    if (!productsError) return null;

    if (typeof productsError === "string") return productsError;
    if (productsError instanceof Error) return productsError;
    if (
      "message" in productsError &&
      typeof productsError.message === "string"
    ) {
      return productsError.message;
    }

    return "An error occurred while fetching products";
  }, [productsError]);

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
          reliability: "95%",
          strikes: 0,
          lastLive: lastLiveDate || "None",
          walletBalance: seller.totalSales
            ? `₦${(parseInt(seller.totalSales) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : "₦0.00",
          totalOrders: user.totalOrders ?? orderStatistics?.totalOrders ?? 0,
          completedOrders: orderStatistics?.completedOrders || 0,
          activeListings: activeListingsCount,
          nextSlot: "None", // Would need slotApi logic
          disciplineStatus: user.disciplineStatus,
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
              productsError={transformedProductsError}
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
