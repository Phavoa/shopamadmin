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
import SuspendSellerModal from "@/components/sellers/SuspendSellerModal";
import IssueStrikeModal from "@/components/sellers/IssueStrikeModal";
import {
  AnimatedWrapper,
  PageWrapper,
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

interface StrikeData {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  shopName: string;
  reason: string;
  strikeCount: number;
  status: string;
  date: string;
}

interface SuspensionData {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  shopName: string;
  reason: string;
  duration: string;
  status: string;
  date: string;
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

  // Modal states
  const [suspendModal, setSuspendModal] = useState(false);
  const [strikeModal, setStrikeModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(null);
  
  // Form states
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(setHeaderTitle("Seller List"));
  }, [dispatch]);

  const fetchSellers = async (params: SellerListParams = {}) => {
    try {
      setFetchingSellers(true);
      setError(null);

      const response = await getSellers({
        ...params,
        limit: 9,
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
            name: user ? `${user.firstName} ${user.lastName}` : seller.shopName,
            email: user ? user.email : seller.userEmail,
            status: seller.status.toLowerCase(),
            tier: getTierDisplayName(seller.tier),
            shopName: seller.shopName,
            businessCategory: seller.businessCategory,
            location: `${seller.locationCity}, ${seller.locationState}`,
            totalSales: seller.totalSales,
            createdAt: seller.createdAt,
            reliability: "95%",
            strikes: 0,
            lastLive: "Aug 30 (Bronze, 210 viewers)",
            walletBalance: "₦340,000",
            totalOrders: 452,
            completedOrders: 400,
            activeListings: 35,
            nextSlot: "Sep 6, 2025 14:00 (Bronze)",
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
    setCurrentPage(1);
    setNextCursor(undefined);
    setPrevCursor(undefined);
    fetchSellers({ q: searchQuery || undefined });
  }, [searchQuery]);

  const handleViewSeller = (seller: DisplaySeller) => {
    router.push(`/admin-dashboard/sellers/${seller.id}`);
  };

  // Open Suspend Modal
  const openSuspendModal = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
    setSuspendModal(true);
  };

  // Handle Suspend
  const handleSuspend = async () => {
    if (!selectedSeller || !reason || !duration) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setActionLoading(true);

      // TODO: Replace with actual API call when backend is ready
      // await suspendSeller(selectedSeller.id, { reason, duration });

      // Store suspension data (localStorage for now)
      const suspensionData: SuspensionData = {
        sellerId: selectedSeller.id,
        sellerName: selectedSeller.name,
        sellerEmail: selectedSeller.email,
        shopName: selectedSeller.shopName,
        reason,
        duration,
        status: "Suspended",
        date: new Date().toISOString(),
      };

      console.log("Suspension Data:", suspensionData);

      const existingData: SuspensionData[] = JSON.parse(
        localStorage.getItem("seller_suspensions") || "[]"
      );
      localStorage.setItem(
        "seller_suspensions",
        JSON.stringify([...existingData, suspensionData])
      );

      setSuspendModal(false);
      setReason("");
      setDuration("");
      setSelectedSeller(null);
      alert("Seller suspended successfully!");
      
      // Refresh seller list
      await fetchSellers();
    } catch (err) {
      console.error("Error suspending seller:", err);
      alert("Failed to suspend seller");
    } finally {
      setActionLoading(false);
    }
  };

  // Open Strike Modal
  const openStrikeModal = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
    setStrikeModal(true);
  };

  // Handle Strike
  const handleStrike = async () => {
    if (!selectedSeller || !reason) {
      alert("Please enter a reason");
      return;
    }

    try {
      setActionLoading(true);

      // TODO: Replace with actual API call when backend is ready
      // await issueSellerstrike(selectedSeller.id, { reason });

      // Get existing strikes
      const existingStrikes: StrikeData[] = JSON.parse(
        localStorage.getItem("seller_strikes") || "[]"
      );
      const sellerStrikes = existingStrikes.filter(
        (s: StrikeData) => s.sellerId === selectedSeller.id
      );

      const newStrikeCount = sellerStrikes.length + 1;
      const status =
        newStrikeCount >= 3 ? "Suspended" : `Strike(${newStrikeCount}/3)`;

      const strikeData = {
        sellerId: selectedSeller.id,
        sellerName: selectedSeller.name,
        sellerEmail: selectedSeller.email,
        shopName: selectedSeller.shopName,
        reason,
        strikeCount: newStrikeCount,
        status,
        date: new Date().toISOString(),
      };

      console.log("Strike Data:", strikeData);

      // Store strike
      localStorage.setItem(
        "seller_strikes",
        JSON.stringify([...existingStrikes, strikeData])
      );

      // If 3 strikes, also add to suspensions
      if (newStrikeCount >= 3) {
        const existingSuspensions: SuspensionData[] = JSON.parse(
          localStorage.getItem("seller_suspensions") || "[]"
        );
        localStorage.setItem(
          "seller_suspensions",
          JSON.stringify([...existingSuspensions, strikeData])
        );
      }

      setStrikeModal(false);
      setReason("");
      setSelectedSeller(null);
      alert(
        `Strike issued! (${newStrikeCount}/3)${
          newStrikeCount >= 3 ? " - Seller suspended" : ""
        }`
      );
      
      // Refresh seller list
      await fetchSellers();
    } catch (err) {
      console.error("Error issuing strike:", err);
      alert("Failed to issue strike");
    } finally {
      setActionLoading(false);
    }
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
          onSuspendSeller={openSuspendModal}
          onStrikeSeller={openStrikeModal}
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

      {/* Modals */}
      <SuspendSellerModal
        isOpen={suspendModal}
        selectedSeller={selectedSeller}
        reason={reason}
        duration={duration}
        actionLoading={actionLoading}
        onOpenChange={setSuspendModal}
        onReasonChange={setReason}
        onDurationChange={setDuration}
        onSuspend={handleSuspend}
      />

      <IssueStrikeModal
        isOpen={strikeModal}
        selectedSeller={selectedSeller}
        reason={reason}
        actionLoading={actionLoading}
        onOpenChange={setStrikeModal}
        onReasonChange={setReason}
        onIssueStrike={handleStrike}
      />
    </PageWrapper>
  );
};

export default Page;