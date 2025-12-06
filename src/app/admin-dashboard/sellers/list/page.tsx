"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getSellers,
  getUserById,
  SellerProfileVM,
  SellerListParams,
} from "@/api/sellerApi";
import {
  issueStrike,
  issueSuspension,
  getUserDisciplineSummary,
} from "@/api/disciplineApi";
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
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "react-hot-toast";

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

  // Modal states
  const [suspendModal, setSuspendModal] = useState(false);
  const [strikeModal, setStrikeModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(
    null
  );

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

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

      const displaySellers: DisplaySeller[] = await Promise.all(
        sellersData.map(async (seller: SellerProfileVM, index: number) => {
          const user = userProfiles[index];
          let strikes = 0;
          let status = seller.status.toLowerCase();
          let activeSuspensions = 0;

          try {
            const disciplineResponse = await getUserDisciplineSummary(
              seller.userId
            );
            strikes = disciplineResponse.activeStrikes;
            activeSuspensions = disciplineResponse.activeSuspensions;

            // Determine status based on discipline data
            if (activeSuspensions > 0) {
              status = "suspended";
            } else if (strikes >= 3) {
              status = "suspended"; // Auto-suspended due to 3 strikes
            } else if (strikes > 0) {
              status = `${strikes}/3 strike${strikes > 1 ? "s" : ""}`;
            } else {
              // Use the original seller status if no strikes/suspensions
              status = seller.status.toLowerCase();
            }
          } catch (error) {
            console.error(
              "Failed to fetch discipline summary for seller:",
              seller.userId
            );
            // If fetching discipline fails, use original status
            status = seller.status.toLowerCase();
            strikes = 0;
          }

          return {
            id: seller.userId,
            name: user ? `${user.firstName} ${user.lastName}` : seller.shopName,
            email: user ? user.email : seller.userEmail,
            status,
            tier: getTierDisplayName(seller.tier),
            shopName: seller.shopName,
            businessCategory: seller.businessCategory,
            location: `${seller.locationCity}, ${seller.locationState}`,
            totalSales: seller.totalSales,
            createdAt: seller.createdAt,
            reliability: "95%",
            strikes,
            lastLive: "Aug 30 (Bronze, 210 viewers)",
            walletBalance: "₦340,000",
            totalOrders: 452,
            completedOrders: 400,
            activeListings: 35,
            nextSlot: "Sep 6, 2025 14:00 (Bronze)",
          };
        })
      );
      setSellers(displaySellers);
      setNextCursor(response.data.nextCursor);
      setPrevCursor(response.data.prevCursor);
      setHasNext(response.data.hasNext);
      setHasPrev(response.data.hasPrev);
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
      setError("Failed to load sellers. Please try again.");
      toast.error("Failed to load sellers");
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
      toast.error("Please fill in all fields");
      return;
    }

    setConfirmTitle("Confirm Suspension");
    setConfirmDescription(
      `Are you sure you want to suspend ${selectedSeller.name} for ${duration} days?`
    );
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);

        await issueSuspension(
          selectedSeller.id,
          reason,
          parseInt(duration),
          "SELLER"
        );

        setSuspendModal(false);
        setReason("");
        setDuration("");
        setSelectedSeller(null);

        toast.success("Seller suspended successfully!");

        // Refresh seller list
        await fetchSellers();
      } catch (err: unknown) {
        console.error("Error suspending seller:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to suspend seller"
        );
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
  };

  // Open Strike Modal
  const openStrikeModal = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
    setStrikeModal(true);
  };

  // Handle Strike
  const handleStrike = async () => {
    if (!selectedSeller || !reason) {
      toast.error("Please enter a reason");
      return;
    }

    setConfirmTitle("Confirm Strike");
    setConfirmDescription(
      `Are you sure you want to issue a strike to ${selectedSeller.name}?`
    );
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);

        const response = await issueStrike(selectedSeller.id, reason, "SELLER");

        setStrikeModal(false);
        setReason("");
        setSelectedSeller(null);

        toast.success(response.message || "Strike issued successfully!");

        // Refresh seller list
        await fetchSellers();
      } catch (err: unknown) {
        console.error("Error issuing strike:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to issue strike"
        );
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
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
    </PageWrapper>
  );
};

export default Page;
