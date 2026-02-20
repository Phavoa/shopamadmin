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
  useIssueStrikeMutation,
  useIssueSuspensionMutation,
  useGetDisciplineRecordsQuery,
} from "@/api/disciplineApi";
import { useDispatch, useSelector } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { selectSearchQuery } from "@/features/search";
import { getTierDisplayName } from "@/lib/tierUtils";
import SellersTable from "@/components/sellers/SellersTable";
import SellersPagination from "@/components/sellers/SellersPagination";
import SuspendSellerModal from "@/components/sellers/SuspendSellerModal";
import IssueStrikeModal from "@/components/sellers/IssueStrikeModal";
import { AnimatedWrapper, PageWrapper } from "@/components/shared/AnimatedWrapper";
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

  const [suspendModal, setSuspendModal] = useState(false);
  const [strikeModal, setStrikeModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(null);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ RTK Query mutations
  const [issueStrike] = useIssueStrikeMutation();
  const [issueSuspension] = useIssueSuspensionMutation();

  // ✅ Fetch all SELLER discipline records once — use to derive status per seller
  const { data: disciplineData } = useGetDisciplineRecordsQuery({
    role: "SELLER",
    status: "ACTIVE",
    limit: 200,
  });
  const disciplineRecords = disciplineData?.data?.items ?? [];

  // Helper: get strike count + suspension status for a seller from already-fetched records
  const getDisciplineStatus = (userId: string) => {
    const userRecords = disciplineRecords.filter((r) => r.userId === userId);
    const activeStrikes = userRecords.filter((r) => r.type === "STRIKE" && r.status === "ACTIVE").length;
    const isSuspended = userRecords.some((r) => r.type === "SUSPENSION" && r.status === "ACTIVE");
    return { activeStrikes, isSuspended };
  };

  useEffect(() => {
    dispatch(setHeaderTitle("Seller List"));
  }, [dispatch]);

  const fetchSellers = async (params: SellerListParams = {}) => {
    try {
      setFetchingSellers(true);
      setError(null);

      const response = await getSellers({ ...params, limit: 9 });
      const sellersData = response.data.items;

      const userPromises = sellersData.map((seller) =>
        getUserById(seller.userId).catch(() => null)
      );
      const userResults = await Promise.allSettled(userPromises);
      const userProfiles = userResults.map((r) =>
        r.status === "fulfilled" ? r.value : null
      );

      const displaySellers: DisplaySeller[] = sellersData.map(
        (seller: SellerProfileVM, index: number) => {
          const user = userProfiles[index];
          const { activeStrikes, isSuspended } = getDisciplineStatus(seller.userId);

          let status = seller.status.toLowerCase();
          if (isSuspended) {
            status = "suspended";
          } else if (activeStrikes >= 3) {
            status = "suspended";
          } else if (activeStrikes > 0) {
            status = `${activeStrikes}/3 strike${activeStrikes > 1 ? "s" : ""}`;
          }

          return {
            id: seller.userId,
            name:
              user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : seller.shopName || "Unknown Seller",
            email: user ? user.email : seller.userEmail,
            status,
            tier: getTierDisplayName(seller.tier),
            shopName: seller.shopName,
            businessCategory: seller.businessCategory,
            location: `${seller.locationCity}, ${seller.locationState}`,
            totalSales: seller.totalSales,
            createdAt: seller.createdAt,
            reliability: "95%",
            strikes: activeStrikes,
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
    } catch (err) {
      console.error("Failed to fetch sellers:", err);
      setError("Failed to load sellers. Please try again.");
      toast.error("Failed to load sellers");
    } finally {
      setFetchingSellers(false);
    }
  };

  useEffect(() => {
    const handleFocus = () => fetchSellers();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => { fetchSellers(); }, []);

  useEffect(() => {
    setCurrentPage(1);
    setNextCursor(undefined);
    setPrevCursor(undefined);
    fetchSellers({ q: searchQuery || undefined });
  }, [searchQuery]);

  // Re-derive seller statuses when discipline data loads
  useEffect(() => {
    if (disciplineRecords.length > 0 && sellers.length > 0) {
      setSellers((prev) =>
        prev.map((seller) => {
          const { activeStrikes, isSuspended } = getDisciplineStatus(seller.id);
          let status = isSuspended
            ? "suspended"
            : activeStrikes >= 3
            ? "suspended"
            : activeStrikes > 0
            ? `${activeStrikes}/3 strike${activeStrikes > 1 ? "s" : ""}`
            : seller.status;
          return { ...seller, status, strikes: activeStrikes };
        })
      );
    }
  }, [disciplineData]);

  const handleViewSeller = (seller: DisplaySeller) => {
    router.push(`/admin-dashboard/sellers/${seller.id}`);
  };

  const openSuspendModal = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
    setSuspendModal(true);
  };

  const handleSuspend = async () => {
    if (!selectedSeller || !reason || !duration) {
      toast.error("Please fill in all fields");
      return;
    }
    setConfirmTitle("Confirm Suspension");
    setConfirmDescription(`Suspend ${selectedSeller.name} for ${duration} days?`);
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);
        await issueSuspension({
          userId: selectedSeller.id,
          data: { role: "SELLER", durationDays: parseInt(duration), reason },
        }).unwrap();
        setSellers((prev) =>
          prev.map((s) => s.id === selectedSeller.id ? { ...s, status: "suspended" } : s)
        );
        setSuspendModal(false);
        setReason("");
        setDuration("");
        setSelectedSeller(null);
        toast.success("Seller suspended successfully!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to suspend seller");
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
  };

  const openStrikeModal = (seller: DisplaySeller) => {
    setSelectedSeller(seller);
    setStrikeModal(true);
  };

  const handleStrike = async () => {
    if (!selectedSeller || !reason) {
      toast.error("Please enter a reason");
      return;
    }
    setConfirmTitle("Confirm Strike");
    setConfirmDescription(`Issue a strike to ${selectedSeller.name}?`);
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);

        const currentStrikes = selectedSeller.strikes ?? 0;

        if (currentStrikes >= 2) {
          // 3rd strike → auto suspend
          await issueSuspension({
            userId: selectedSeller.id,
            data: { role: "SELLER", durationDays: 30, reason },
          }).unwrap();
          toast.success(`${selectedSeller.name} suspended (3rd strike)`);
          setSellers((prev) =>
            prev.map((s) => s.id === selectedSeller.id ? { ...s, status: "suspended", strikes: 3 } : s)
          );
        } else {
          await issueStrike({
            userId: selectedSeller.id,
            data: { role: "SELLER", reason },
          }).unwrap();
          const newCount = currentStrikes + 1;
          toast.success(`Strike ${newCount}/3 issued to ${selectedSeller.name}`);
          setSellers((prev) =>
            prev.map((s) =>
              s.id === selectedSeller.id
                ? {
                    ...s,
                    strikes: newCount,
                    status: newCount >= 3 ? "suspended" : `${newCount}/3 strike${newCount > 1 ? "s" : ""}`,
                  }
                : s
            )
          );
        }

        setStrikeModal(false);
        setReason("");
        setSelectedSeller(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to issue strike");
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
  };

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