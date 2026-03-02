"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/api/userApi";
import {
  useIssueStrikeMutation,
  useIssueSuspensionMutation,
  useGetDisciplineRecordsQuery,
} from "@/api/disciplineApi";
import type { Buyer, SelectedBuyerForAction } from "@/types/buyer";
import { useSelector, useDispatch } from "react-redux";
import { selectSearchQuery } from "@/features/search";
import {
  BuyersListLayout,
  BuyerLoadingState,
  BuyerErrorState,
  SuspendBuyerModal,
  IssueStrikeModal,
} from "@/components/buyers";
import { AnimatedWrapper, PageWrapper } from "@/components/shared/AnimatedWrapper";
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

  const [suspendModal, setSuspendModal] = useState(false);
  const [strikeModal, setStrikeModal] = useState(false);
  const [selectedBuyerForAction, setSelectedBuyerForAction] = useState<SelectedBuyerForAction | null>(null);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [buyerStats, setBuyerStats] = useState<Record<string, { totalOrders: number; totalSpend: number }>>({});

  // ✅ Fetch real buyer stats in the background for all buyers at once
  useEffect(() => {
    const fetchAllStats = async () => {
      const missingIds = buyers
        .map(b => b.id)
        .filter(id => !buyerStats[id]);
      
      if (missingIds.length === 0) return;

      const { getOrdersByBuyer } = await import("@/api/ordersApi");
      
      const results = await Promise.all(
        missingIds.map(async (id) => {
          try {
            const resp = await getOrdersByBuyer(id, { limit: 50 });
            if (resp.data?.items) {
              const orders = resp.data.items;
              // Sum up total orders and spend (assuming totalAmount might be in kobo)
              const totalOrders = orders.length;
              const totalSpendKobo = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
              // Most amounts in this system are kobo, but let's be safe and check if we should show major unit
              return { id, stats: { totalOrders, totalSpend: Math.round(totalSpendKobo / 100) } };
            }
          } catch (err) {
            console.error(`Failed stats for ${id}:`, err);
          }
          return { id, stats: { totalOrders: 0, totalSpend: 0 } };
        })
      );

      const newStats = { ...buyerStats };
      results.forEach(({ id, stats }) => {
        newStats[id] = stats;
      });
      setBuyerStats(newStats);
    };

    if (buyers.length > 0) {
      fetchAllStats();
    }
  }, [buyers]);

  // ✅ RTK Query mutations
  const [issueStrike] = useIssueStrikeMutation();
  const [issueSuspension] = useIssueSuspensionMutation();

  // ✅ Fetch all BUYER discipline records once — no per-user fetching
  const { data: disciplineData } = useGetDisciplineRecordsQuery({
    role: "BUYER",
    // Remove status: "ACTIVE" to fetch appeals/all records for accurate summary
    limit: 200,
  });
  const disciplineRecords = disciplineData?.data?.items ?? [];

  const getDisciplineStatus = (userId: string) => {
    const userRecords = disciplineRecords.filter((r) => r.userId === userId);
    const activeStrikes = userRecords.filter((r) => r.type === "STRIKE" && r.status === "ACTIVE").length;
    // A suspension is active if it's "ACTIVE" OR if it's been appealed but not approved yet
    const isSuspended = userRecords.some(
      (r) => 
        r.type === "SUSPENSION" && 
        (r.status === "ACTIVE" || (r.appealStatus !== "APPROVED" && r.appealText))
    );
    return { activeStrikes, isSuspended };
  };

  useEffect(() => {
    dispatch(setHeaderTitle("Buyer List"));
  }, [dispatch]);

  const buyersPerPage = 20;

  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery({
    populate: ["sellerProfile", "addresses", "followers", "following", "blocks", "blockedBy"],
    limit: buyersPerPage,
    sortBy: "createdAt" as const,
    sortDir: "desc" as const,
    ...(searchQuery && { q: searchQuery }),
  });

  // Transform users — no async discipline calls per user anymore
  useEffect(() => {
    if (!usersData?.data?.items) {
      setBuyers([]);
      return;
    }

    const transformed = usersData.data.items.map((user) => {
      const { activeStrikes, isSuspended } = getDisciplineStatus(user.id);

      let status = "Active";
      if (isSuspended || activeStrikes >= 3) {
        status = "Suspended";
      } else if (activeStrikes > 0) {
        status = `Strike ${activeStrikes}/3`;
      }

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
      } catch {}

      const stats = buyerStats[user.id] || { totalOrders: 0, totalSpend: 0 };

      return {
        ...user,
        name: `${user.firstName} ${user.lastName}`,
        verified: user.isVerified || false,
        totalOrders: stats.totalOrders,
        totalSpend: `₦${stats.totalSpend.toLocaleString()}`,
        lastActivity,
        strikes: activeStrikes,
        status,
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
      };
    });

    setBuyers(transformed);
  }, [usersData, disciplineData, buyerStats]); // re-run when discipline or stats load

  // ✅ Fetch real buyer stats in the background
  useEffect(() => {
    if (buyers.length > 0) {
      buyers.forEach(async (buyer) => {
        // Only fetch if we don't have stats yet for this buyer
        if (!buyerStats[buyer.id]) {
          const stats = await fetchStatsForBuyer(buyer.id);
          setBuyerStats((prev) => ({ ...prev, [buyer.id]: stats }));
        }
      });
    }
  }, [buyers]);

  React.useEffect(() => {
    const handleFocus = () => refetch();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetch]);

  React.useEffect(() => {
    if (usersData?.data && typeof usersData.data === "object" && "nextCursor" in usersData.data) {
      const p = usersData.data as unknown as { nextCursor?: string; hasNext: boolean };
      setNextCursor(p.nextCursor);
      setHasNext(p.hasNext);
    }
  }, [usersData]);

  React.useEffect(() => {
    setCurrentPage(1);
    setNextCursor(undefined);
    setHasNext(false);
  }, [searchQuery]);

  const handleNextPage = () => { if (hasNext && nextCursor) setCurrentPage(currentPage + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleViewBuyer = (buyer: Buyer) => router.push(`/admin-dashboard/buyers/${buyer.id}`);

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
    setConfirmDescription(`Suspend ${selectedBuyerForAction.name} for ${duration} days?`);
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);
        await issueSuspension({
          userId: selectedBuyerForAction.id,
          data: { role: "BUYER", durationDays: parseInt(duration), reason },
        }).unwrap();
        setBuyers((prev) =>
          prev.map((b) => b.id === selectedBuyerForAction.id ? { ...b, status: "Suspended" } : b)
        );
        setSuspendModal(false);
        setReason("");
        setDuration("");
        setSelectedBuyerForAction(null);
        toast.success("Buyer suspended successfully!");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to suspend buyer");
        refetch();
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
  };

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
    setConfirmDescription(`Issue a strike to ${selectedBuyerForAction.name}?`);
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);

        const currentBuyer = buyers.find((b) => b.id === selectedBuyerForAction.id);
        const currentStrikes = currentBuyer?.strikes ?? 0;

        if (currentStrikes >= 2) {
          await issueSuspension({
            userId: selectedBuyerForAction.id,
            data: { role: "BUYER", durationDays: 30, reason },
          }).unwrap();
          toast.success(`${selectedBuyerForAction.name} suspended (3rd strike)`);
          setBuyers((prev) =>
            prev.map((b) => b.id === selectedBuyerForAction.id ? { ...b, status: "Suspended", strikes: 3 } : b)
          );
        } else {
          await issueStrike({
            userId: selectedBuyerForAction.id,
            data: { role: "BUYER", reason },
          }).unwrap();
          const newCount = currentStrikes + 1;
          toast.success(`Strike ${newCount}/3 issued to ${selectedBuyerForAction.name}`);
          setBuyers((prev) =>
            prev.map((b) =>
              b.id === selectedBuyerForAction.id
                ? { ...b, strikes: newCount, status: newCount >= 3 ? "Suspended" : `Strike ${newCount}/3` }
                : b
            )
          );
        }

        setStrikeModal(false);
        setReason("");
        setSelectedBuyerForAction(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to issue strike");
        refetch();
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
  };

  if (isLoading) return <BuyerLoadingState />;
  if (error) return <BuyerErrorState onRetry={refetch} />;

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