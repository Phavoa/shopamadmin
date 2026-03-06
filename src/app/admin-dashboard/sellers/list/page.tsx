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

  const [suspendModal, setSuspendModal] = useState(false);
  const [strikeModal, setStrikeModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<DisplaySeller | null>(
    null,
  );

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [sellerStats, setSellerStats] = useState<
    Record<
      string,
      { totalOrders: number; totalSales: number; lastLive?: string }
    >
  >({});

  // ✅ RTK Query mutations
  const [issueStrike] = useIssueStrikeMutation();
  const [issueSuspension] = useIssueSuspensionMutation();

  // ✅ Fetch all SELLER discipline records once — use to derive status per seller
  const { data: disciplineData } = useGetDisciplineRecordsQuery({
    role: "SELLER",
    // Remove status: "ACTIVE" to fetch appeals/all records for accurate summary
    limit: 200,
  });
  const disciplineRecords = disciplineData?.data?.items ?? [];

  // Helper: get strike count + suspension status for a seller from already-fetched records
  const getDisciplineStatus = (userId: string) => {
    const userRecords = disciplineRecords.filter((r) => r.userId === userId);
    const activeStrikes = userRecords.filter(
      (r) => r.type === "STRIKE" && r.status === "ACTIVE",
    ).length;
    // A suspension is active if it's "ACTIVE" OR if it's been appealed but not approved yet
    const isSuspended = userRecords.some(
      (r) =>
        r.type === "SUSPENSION" &&
        (r.status === "ACTIVE" ||
          (r.appealStatus !== "APPROVED" && r.appealText)),
    );
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
        getUserById(seller.userId).catch(() => null),
      );
      const userResults = await Promise.allSettled(userPromises);
      const userProfiles = userResults.map((r) =>
        r.status === "fulfilled" ? r.value : null,
      );

      const displaySellers: DisplaySeller[] = sellersData.map(
        (seller: SellerProfileVM, index: number) => {
          const user = userProfiles[index];
          const { activeStrikes, isSuspended } = getDisciplineStatus(
            seller.userId,
          );

          let status = seller.status.toLowerCase();
          if (isSuspended) {
            status = "suspended";
          } else if (activeStrikes >= 3) {
            status = "suspended";
          } else if (activeStrikes > 0) {
            status = `${activeStrikes}/3 strike${activeStrikes > 1 ? "s" : ""}`;
          }

          const stats = sellerStats[seller.userId];
          const totalOrders = (user as any)?.totalOrders || stats?.totalOrders || 0;

          // Prioritize seller.totalSales for the "Wallet" column as per user feedback
          const walletValueKobo = seller.totalSales
            ? parseInt(seller.totalSales)
            : 0;
          const walletNaira = walletValueKobo / 100;

          // finalTotalSales combines background stats and direct field
          const finalTotalSales = Math.max(walletNaira, stats?.totalSales || 0);

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
            totalSales: finalTotalSales.toString(),
            createdAt: seller.createdAt,
            reliability: "95%",
            strikes: activeStrikes,
            lastLive: stats?.lastLive || "None",
            walletBalance: `₦${finalTotalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            totalOrders: totalOrders,
            completedOrders: totalOrders, // Fallback if completed not available
            activeListings: 35,
            nextSlot: "None",
          };
        },
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

  // ✅ Fetch real seller stats in the background (Fallback for #19)
  useEffect(() => {
    const fetchAllSellerStats = async () => {
      // Map seller.id to seller.userId for correct API lookups
      const sellerToUserMap = Object.fromEntries(
        sellers.map((s) => [s.id, s.id]),
      );

      const missingIds = sellers
        .map((s) => s.id)
        .filter((id) => !sellerStats[id]);

      if (missingIds.length === 0) return;

      const { getOrderStatisticsBySeller } = await import("@/api/ordersApi");
      const { authStorage } = await import("@/lib/auth/authUtils");

      const results = await Promise.all(
        missingIds.map(async (id) => {
          const userId = sellerToUserMap[id];
          let statsObj = { totalOrders: 0, totalSales: 0, lastLive: "None" };
          try {
            // 1. Order stats (Uses Seller Profile ID)
            const resp = await getOrderStatisticsBySeller(id);
            if (resp.success && resp.data) {
              statsObj.totalOrders = resp.data.totalOrders;
              statsObj.totalSales = resp.data.totalRevenue / 100;
            }

            // 2. Last Live (Uses User ID)
            const API_BASE_URL =
              process.env.NEXT_PUBLIC_API_URL ||
              "https://shapam-ecomerce-backend.onrender.com/api";
            const token = authStorage.getAccessToken();

            // Fetch ended streams for this seller via userId
            const liveResp = await fetch(
              `${API_BASE_URL}/streams?sellerId=${userId}&status=ENDED&limit=1&sortBy=createdAt&sortDir=desc`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            if (liveResp.ok) {
              const liveData = await liveResp.json();
              if (liveData.data?.items?.length > 0) {
                const stream = liveData.data.items[0];
                const dateRaw =
                  stream.endedAt || stream.startedAt || stream.createdAt;
                statsObj.lastLive = new Date(dateRaw).toLocaleDateString(
                  "en-NG",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                );
              }
            }
          } catch (err) {
            console.error(`Failed seller stats for ${id}:`, err);
          }
          return { id, stats: statsObj };
        }),
      );

      const newStats = { ...sellerStats };
      results.forEach(({ id, stats }) => {
        if (id) newStats[id] = stats;
      });
      setSellerStats(newStats);
    };

    if (sellers.length > 0) {
      fetchAllSellerStats();
    }
  }, [sellers]);

  useEffect(() => {
    const handleFocus = () => fetchSellers();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setNextCursor(undefined);
    setPrevCursor(undefined);
    fetchSellers({ q: searchQuery || undefined });
  }, [searchQuery]);

  // ✅ Memoized sellers for display, combining base data with background stats (#19)
  const memoizedSellers = React.useMemo(() => {
    return sellers.map((seller) => {
      const stats = sellerStats[seller.id];
      if (!stats) return seller;

      // Prioritize background stats for "Wallet" and "Last Live"
      // totalSales is in kobo in stats
      const walletNaira = stats.totalSales;

      // If we already have a walletBalance in the base seller object,
      // check if it's 0 and if the stats have a better value
      const currentWalletStr =
        seller.walletBalance?.replace(/[^\d.-]/g, "") || "0";
      const currentWallet = parseFloat(currentWalletStr);

      const bestWallet = Math.max(currentWallet, walletNaira);

      return {
        ...seller,
        lastLive: stats.lastLive !== "None" ? stats.lastLive : seller.lastLive,
        walletBalance:
          bestWallet > 0
            ? `₦${bestWallet.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : seller.walletBalance,
        totalSales: bestWallet.toString(),
        totalOrders:
          stats.totalOrders > 0 ? stats.totalOrders : seller.totalOrders,
      };
    });
  }, [sellers, sellerStats]);

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
        }),
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
    setConfirmDescription(
      `Suspend ${selectedSeller.name} for ${duration} days?`,
    );
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);
        await issueSuspension({
          userId: selectedSeller.id,
          data: { role: "SELLER", durationDays: parseInt(duration), reason },
        }).unwrap();
        setSellers((prev) =>
          prev.map((s) =>
            s.id === selectedSeller.id ? { ...s, status: "suspended" } : s,
          ),
        );
        setSuspendModal(false);
        setReason("");
        setDuration("");
        setSelectedSeller(null);
        toast.success("Seller suspended successfully!");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to suspend seller",
        );
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
            prev.map((s) =>
              s.id === selectedSeller.id
                ? { ...s, status: "suspended", strikes: 3 }
                : s,
            ),
          );
        } else {
          await issueStrike({
            userId: selectedSeller.id,
            data: { role: "SELLER", reason },
          }).unwrap();
          const newCount = currentStrikes + 1;
          toast.success(
            `Strike ${newCount}/3 issued to ${selectedSeller.name}`,
          );
          setSellers((prev) =>
            prev.map((s) =>
              s.id === selectedSeller.id
                ? {
                    ...s,
                    strikes: newCount,
                    status:
                      newCount >= 3
                        ? "suspended"
                        : `${newCount}/3 strike${newCount > 1 ? "s" : ""}`,
                  }
                : s,
            ),
          );
        }

        setStrikeModal(false);
        setReason("");
        setSelectedSeller(null);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to issue strike",
        );
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
          sellers={memoizedSellers}
          fetchingSellers={fetchingSellers}
          error={error}
          onViewSeller={handleViewSeller}
          onSuspendSeller={openSuspendModal}
          onStrikeSeller={openStrikeModal}
        />
      </AnimatedWrapper>

      <AnimatedWrapper animation="slideUp" delay={0.2}>
        <SellersPagination
          sellers={memoizedSellers}
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
