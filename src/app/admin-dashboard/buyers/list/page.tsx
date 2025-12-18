"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/api/userApi";
import {
  issueStrike,
  issueSuspension,
  getUserDisciplineSummary,
  getUserStrikeCount,
} from "@/api/disciplineApi";
import type { Buyer, SelectedBuyerForAction } from "@/types/buyer";
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
} from "@/components/shared/AnimatedWrapper";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "react-hot-toast";

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

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  // Form state
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // State for buyers with discipline data
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [transforming, setTransforming] = useState(true); // ✅ Loading state for transformation

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

  // Transform users to buyers format with discipline data
  React.useEffect(() => {
    const transformBuyers = async () => {
      setTransforming(true); // ✅ Start loading
      
      if (!usersData?.data?.items) {
        setBuyers([]);
        setTransforming(false); // ✅ Stop loading
        return;
      }

      const transformedBuyers = await Promise.all(
        usersData.data.items.map(async (user) => {
          let strikes = 0;
          let status = "Active";
          let activeSuspensions = 0;

          try {
            const disciplineSummary = await getUserDisciplineSummary(
              user.id,
              "BUYER"
            );

            strikes = disciplineSummary.activeStrikes || 0;
            activeSuspensions = disciplineSummary.activeSuspensions || 0;
            const isSuspended = disciplineSummary.isSuspended || false;

            // Determine status based on discipline data
            if (isSuspended || activeSuspensions > 0) {
              status = "Suspended";
            } else if (strikes >= 3) {
              status = "Suspended"; // Auto-suspended due to 3 strikes
            } else if (strikes > 0) {
              status = `Strike ${strikes}/3`;
            } else {
              status = "Active";
            }
          } catch (error) {
            console.error(
              "Failed to fetch discipline summary for user:",
              user.id
            );
            // If API fails, default to Active
            status = "Active";
            strikes = 0;
          }

          // Format last activity date
          let lastActivity = "N/A";
          try {
            if (user.updatedAt) {
              const date = new Date(user.updatedAt);
              if (!isNaN(date.getTime())) {
                lastActivity = date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
              }
            }
          } catch (err) {
            lastActivity = "N/A";
          }

          return {
            ...user,
            name: `${user.firstName} ${user.lastName}`,
            verified: user.isVerified || false,
            totalOrders: 0,
            totalSpend: "₦0",
            lastActivity,
            strikes,
            status,
            followersCount: user.followersCount || 0,
            followingCount: user.followingCount || 0,
          };
        })
      );

      setBuyers(transformedBuyers);
      setTransforming(false); // ✅ Stop loading
    };

    transformBuyers();
  }, [usersData]);

  // Add this useEffect to refetch when window regains focus
  React.useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetch]);

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
      toast.error("Please fill in all fields");
      return;
    }

    setConfirmTitle("Confirm Suspension");
    setConfirmDescription(
      `Are you sure you want to suspend ${selectedBuyerForAction.name} for ${duration} days?`
    );
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);

        await issueSuspension(
          selectedBuyerForAction.id,
          reason,
          parseInt(duration),
          "BUYER"
        );

        // Update local state immediately for suspension
        setBuyers((prevBuyers) =>
          prevBuyers.map((buyer) =>
            buyer.id === selectedBuyerForAction.id
              ? { ...buyer, status: "Suspended" }
              : buyer
          )
        );

        setSuspendModal(false);
        setReason("");
        setDuration("");
        setSelectedBuyerForAction(null);

        toast.success("Buyer suspended successfully!");
      } catch (err: unknown) {
        console.error("Error suspending buyer:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to suspend buyer"
        );
        refetch();
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
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
      toast.error("Please enter a reason");
      return;
    }

    setConfirmTitle("Confirm Strike");
    setConfirmDescription(
      `Are you sure you want to issue a strike to ${selectedBuyerForAction.name}?`
    );
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);

        // Check current strike count
        const currentStrikeCount = await getUserStrikeCount(
          selectedBuyerForAction.id,
          "BUYER"
        );

        // If this will be the 3rd strike, issue suspension instead
        if (currentStrikeCount >= 2) {
          await issueSuspension(selectedBuyerForAction.id, reason, 30, "BUYER");
          toast.success(
            `${selectedBuyerForAction.name} has been suspended (3rd strike)`
          );

          // Update local state immediately for 3rd strike suspension
          setBuyers((prevBuyers) =>
            prevBuyers.map((buyer) =>
              buyer.id === selectedBuyerForAction.id
                ? { ...buyer, status: "Suspended", strikes: 3 }
                : buyer
            )
          );
        } else {
          await issueStrike(selectedBuyerForAction.id, reason, "BUYER");
          const newStrikeCount = currentStrikeCount + 1;
          toast.success(
            `Strike ${newStrikeCount}/3 issued to ${selectedBuyerForAction.name}`
          );

          // Update local state immediately for strike
          setBuyers((prevBuyers) =>
            prevBuyers.map((buyer) =>
              buyer.id === selectedBuyerForAction.id
                ? {
                    ...buyer,
                    status:
                      newStrikeCount >= 3
                        ? "Suspended"
                        : `Strike ${newStrikeCount}/3`,
                    strikes: newStrikeCount,
                  }
                : buyer
            )
          );
        }

        setStrikeModal(false);
        setReason("");
        setSelectedBuyerForAction(null);
      } catch (err: unknown) {
        console.error("Error issuing strike:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to issue strike"
        );
        refetch();
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
  };

  // ✅ Show loading state while fetching OR transforming data
  if (isLoading || transforming) {
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

        <ConfirmationDialog
          isOpen={confirmDialog}
          onClose={() => setConfirmDialog(false)}
          onConfirm={confirmAction || (() => setConfirmDialog(false))}
          title={confirmTitle}
          description={confirmDescription}
          confirmText={confirmAction ? "Confirm" : "OK"}
          cancelText={confirmAction ? "Cancel" : undefined}
          isLoading={actionLoading}
        />
      </AnimatedWrapper>
    </PageWrapper>
  );
};

export default BuyersListPage;