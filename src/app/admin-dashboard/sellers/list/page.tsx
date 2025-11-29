"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getSellers,
  getUserById,
  SellerProfileVM,
  SellerListParams,
} from "@/api/sellerApi";
import { useDispatch, useSelector } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { selectSearchQuery } from "@/features/search";
import { getTierDisplayName } from "@/lib/tierUtils";
import SellersTable from "@/components/sellers/SellersTable";
import SellersPagination from "@/components/sellers/SellersPagination";
import {
  AnimatedWrapper,
  PageWrapper,
  StaggerContainer,
} from "@/components/shared/AnimatedWrapper";

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

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);

  const [sellers, setSellers] = useState<DisplaySeller[]>([]);
  const [fetchingSellers, setFetchingSellers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [prevCursor, setPrevCursor] = useState<string | undefined>();
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(setHeaderTitle("Seller List"));
  }, [dispatch]);

  const fetchSellers = async (params: SellerListParams = {}) => {
    try {
      setFetchingSellers(true);
      setError(null);

      const response = await getSellers({
        ...params,
        limit: 9, // Match the previous sellersPerPage
      });
      const sellersData = response.data.items;

      // Fetch user profiles for names
      const userPromises = sellersData.map((seller) =>
        getUserById(seller.userId).catch(() => null)
      );
      const userResults = await Promise.allSettled(userPromises);
      const userProfiles = userResults.map((result) =>
        result.status === "fulfilled" ? result.value : null
      );

      const displaySellers: DisplaySeller[] = sellersData.map(
        (seller: SellerProfileVM, index: number) => {
          const user = userProfiles[index];
          return {
            id: seller.userId,
            name: user ? `${user.firstName} ${user.lastName}` : "Unknown User",
            email: user ? user.email : seller.userEmail,
            status: seller.status.toLowerCase(),
            tier: getTierDisplayName(seller.tier),
            shopName: seller.shopName,
            businessCategory: seller.businessCategory,
            location: `${seller.locationCity}, ${seller.locationState}`,
            totalSales: seller.totalSales,
            createdAt: seller.createdAt,
            reliability: "95%", // Dummy, as not in API
            strikes: 0, // Dummy
            lastLive: "Aug 30 (Bronze, 210 viewers)", // Dummy
            walletBalance: "₦340,000", // Dummy
            totalOrders: 452, // Dummy
            completedOrders: 400, // Dummy
            activeListings: 35, // Dummy
            nextSlot: "Sep 6, 2025 14:00 (Bronze)", // Dummy
          };
        }
      );
      setSellers(displaySellers);
      setNextCursor(response.data.nextCursor);
      setPrevCursor(response.data.prevCursor);
      setHasNext(response.data.hasNext);
      setHasPrev(response.data.hasPrev);
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
      setError("Failed to load sellers. Please try again.");
    } finally {
      setFetchingSellers(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    // Reset page number when search changes
    setCurrentPage(1);
    // Reset cursors when search changes
    setNextCursor(undefined);
    setPrevCursor(undefined);
    fetchSellers({ q: searchQuery || undefined });
  }, [searchQuery]);

  const handleViewSeller = (seller: DisplaySeller) => {
    router.push(`/admin-dashboard/sellers/${seller.id}`);
  };

  const handleSuspend = async () => {
    // Refresh the seller list after suspending a seller
    await fetchSellers();
  };

  // Pagination functions
  const handleNextPage = () => {
    if (hasNext && nextCursor) {
      setCurrentPage((prev) => prev + 1);
      fetchSellers({ after: nextCursor, q: searchQuery || undefined });
    }
  };

  const handlePrevPage = () => {
    if (hasPrev && prevCursor) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
      fetchSellers({ before: prevCursor, q: searchQuery || undefined });
    }
  };

  return (
    <PageWrapper className="min-h-screen px-6 py-8">
      <AnimatedWrapper animation="fadeIn" delay={0.1}>
        <SellersTable
          sellers={sellers}
          fetchingSellers={fetchingSellers}
          error={error}
          onViewSeller={handleViewSeller}
          onSuspend={handleSuspend}
        />
      </AnimatedWrapper>

      <AnimatedWrapper animation="slideUp" delay={0.2}>
        <SellersPagination
          sellers={sellers}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          currentPage={currentPage}
        />
      </AnimatedWrapper>
    </PageWrapper>
  );
};

export default Page;
