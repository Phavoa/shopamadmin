"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/api/userApi";
import type { User } from "@/types/auth";
import type { Buyer, StrikeData, SelectedBuyerForAction } from "@/types/buyer";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchQuery } from "@/features/search";

// Import the new components
import {
  BuyersListLayout,
  BuyerLoadingState,
  BuyerErrorState,
  SuspendBuyerModal,
  IssueStrikeModal,
} from "@/components/buyers";
import {
  AnimatedWrapper,
  PageWrapper,
  StaggerContainer,
} from "@/components/shared/AnimatedWrapper";
import { setHeaderTitle } from "@/features/shared/headerSice";

const BuyersListPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasNext, setHasNext] = useState(false);

  // Modals state
  const [suspendModal, setSuspendModal] = useState(false);
  const [strikeModal, setStrikeModal] = useState(false);
  const [selectedBuyerForAction, setSelectedBuyerForAction] =
    useState<SelectedBuyerForAction | null>(null);

  // Form state
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(setHeaderTitle("Buyer List"));
  }, [dispatch]);

  const buyersPerPage = 20;

  // Fetch buyers using useGetUsersQuery
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery({
    populate: [
      "sellerProfile",
      "addresses",
      "followers",
      "following",
      "blocks",
      "blockedBy",
    ],
    limit: buyersPerPage,
    sortBy: "createdAt" as const,
    sortDir: "desc" as const,
    ...(searchQuery && { q: searchQuery }),
  });

  // Transform users to buyers format
  const buyers: Buyer[] =
    usersData?.data?.items?.map((user) => ({
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      verified: user.isVerified || true,
      totalOrders: 0,
      totalSpend: "₦0",
      lastActivity: new Date(user.updatedAt).toLocaleDateString(),
      strikes: 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
    })) || [];

  // Update pagination data
  React.useEffect(() => {
    if (
      usersData?.data &&
      typeof usersData.data === "object" &&
      "nextCursor" in usersData.data
    ) {
      const paginationData = usersData.data as unknown as {
        nextCursor?: string;
        hasNext: boolean;
      };
      setNextCursor(paginationData.nextCursor);
      setHasNext(paginationData.hasNext);
    }
  }, [usersData]);

  // Watch for search query changes and refetch data
  React.useEffect(() => {
    setCurrentPage(1);
    setNextCursor(undefined);
    setHasNext(false);
  }, [searchQuery]);

  const handleNextPage = () => {
    if (hasNext && nextCursor) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewBuyer = (buyer: Buyer) => {
    router.push(`/admin-dashboard/buyers/${buyer.id}`);
  };

  // Handle Suspend
  const openSuspendModal = (buyer: Buyer) => {
    setSelectedBuyerForAction({
      id: buyer.id,
      name: buyer.name || `${buyer.firstName} ${buyer.lastName}`,
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      email: buyer.email,
    });
    setSuspendModal(true);
  };

  const handleSuspend = async () => {
    if (!selectedBuyerForAction || !reason || !duration) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setActionLoading(true);

      // Store suspension data (will connect to backend later)
      const suspensionData = {
        buyerId: selectedBuyerForAction.id,
        buyerName:
          selectedBuyerForAction.name ||
          `${selectedBuyerForAction.firstName} ${selectedBuyerForAction.lastName}`,
        buyerEmail: selectedBuyerForAction.email,
        reason,
        duration,
        status: "Suspended",
        date: new Date().toISOString(),
      };

      console.log("Suspension Data:", suspensionData);

      // Store in localStorage for now (will use API later)
      const existingData = JSON.parse(
        localStorage.getItem("suspensions") || "[]"
      );
      localStorage.setItem(
        "suspensions",
        JSON.stringify([...existingData, suspensionData])
      );

      setSuspendModal(false);
      setReason("");
      setDuration("");
      setSelectedBuyerForAction(null);
      alert("Buyer suspended successfully!");

      // Refresh the list
      refetch();
    } catch (err) {
      console.error("Error suspending buyer:", err);
      alert("Failed to suspend buyer");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Strike
  const openStrikeModal = (buyer: Buyer) => {
    setSelectedBuyerForAction({
      id: buyer.id,
      name: buyer.name || `${buyer.firstName} ${buyer.lastName}`,
      firstName: buyer.firstName,
      lastName: buyer.lastName,
      email: buyer.email,
    });
    setStrikeModal(true);
  };

  const handleStrike = async () => {
    if (!selectedBuyerForAction || !reason) {
      alert("Please enter a reason");
      return;
    }

    try {
      setActionLoading(true);

      // Get existing strikes
      const existingStrikes = JSON.parse(
        localStorage.getItem("strikes") || "[]"
      );
      const buyerStrikes = existingStrikes.filter(
        (s: StrikeData) => s.buyerId === selectedBuyerForAction.id
      );

      const newStrikeCount = buyerStrikes.length + 1;
      const status =
        newStrikeCount >= 3 ? "Suspended" : `Strike(${newStrikeCount}/3)`;

      const strikeData: StrikeData = {
        buyerId: selectedBuyerForAction.id,
        buyerName:
          selectedBuyerForAction.name ||
          `${selectedBuyerForAction.firstName} ${selectedBuyerForAction.lastName}`,
        buyerEmail: selectedBuyerForAction.email,
        reason,
        duration: "",
        strikeCount: newStrikeCount,
        status,
        date: new Date().toISOString(),
      };

      console.log("Strike Data:", strikeData);

      // Store strike
      localStorage.setItem(
        "strikes",
        JSON.stringify([...existingStrikes, strikeData])
      );

      // If 3 strikes, also add to suspensions
      if (newStrikeCount >= 3) {
        const existingSuspensions = JSON.parse(
          localStorage.getItem("suspensions") || "[]"
        );
        localStorage.setItem(
          "suspensions",
          JSON.stringify([...existingSuspensions, strikeData])
        );
      }

      setStrikeModal(false);
      setReason("");
      setSelectedBuyerForAction(null);
      alert(
        `Strike issued! (${newStrikeCount}/3)${
          newStrikeCount >= 3 ? " - Buyer suspended" : ""
        }`
      );

      // Refresh the list
      refetch();
    } catch (err) {
      console.error("Error issuing strike:", err);
      alert("Failed to issue strike");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <BuyerLoadingState />;
  }

  // Error state
  if (error) {
    return <BuyerErrorState onRetry={refetch} />;
  }

  // Main Buyers List View
  return (
    <PageWrapper className="min-h-screen">
      <AnimatedWrapper animation="fadeIn" delay={0.1}>
        <BuyersListLayout
          buyers={buyers}
          currentPage={currentPage}
          hasNext={hasNext}
          isLoading={isLoading}
          onViewBuyer={handleViewBuyer}
          onSuspendBuyer={openSuspendModal}
          onStrikeBuyer={openStrikeModal}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </AnimatedWrapper>

      <AnimatedWrapper animation="slideUp" delay={0.2}>
        {/* Modals */}
        <SuspendBuyerModal
          isOpen={suspendModal}
          selectedBuyer={selectedBuyerForAction}
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
          selectedBuyer={selectedBuyerForAction}
          reason={reason}
          actionLoading={actionLoading}
          onOpenChange={setStrikeModal}
          onReasonChange={setReason}
          onIssueStrike={handleStrike}
        />
      </AnimatedWrapper>
    </PageWrapper>
  );
};

export default BuyersListPage;