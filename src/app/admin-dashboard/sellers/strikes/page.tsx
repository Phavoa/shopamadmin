"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/sellers/StrikesTable";
import ExtendSuspensionModal from "@/components/sellers/ExtendSuspensionModal";
import SuspendSellerModal from "@/components/sellers/SuspendSellerModal";
import { getGroupedDisciplineRecords, getUserStrikeCount, clearStrike, reinstateSuspension, extendSuspension, issueSuspension } from "@/api/disciplineApi";
import toast from 'react-hot-toast';
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://shapam-ecomerce-backend.onrender.com/api";

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const localToken = localStorage.getItem("authToken");
  const sessionToken = sessionStorage.getItem("authToken");
  return localToken || sessionToken;
};

const getUserById = async (userId: string) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
};

interface UserCache {
  [userId: string]: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface DisplaySeller {
  id: string;
  name: string;
  email: string;
  shopName: string;
  status: string;
  tier: string;
  businessCategory: string;
  location: string;
  totalSales: string;
  createdAt: string;
}

const SellerStrikesPage: React.FC = () => {
  const [strikes, setStrikes] = useState<StrikeRecord[]>([]);
  const [fetchingStrikes, setFetchingStrikes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCache, setUserCache] = useState<UserCache>({});
  const [selectedStrike, setSelectedStrike] = useState<StrikeRecord | null>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("7");

  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  const fetchUserDetails = async (userId: string) => {
    if (userCache[userId]) {
      return userCache[userId];
    }

    try {
      const user = await getUserById(userId);
      const userDetails = {
        firstName: user.firstName || "Unknown",
        lastName: user.lastName || "Seller",
        email: user.email || "N/A",
      };
      
      setUserCache(prev => ({ ...prev, [userId]: userDetails }));
      return userDetails;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      return {
        firstName: "Unknown",
        lastName: "Seller",
        email: "N/A",
      };
    }
  };

  const fetchStrikes = async () => {
    try {
      setFetchingStrikes(true);
      setError(null);

      const records = await getGroupedDisciplineRecords("SELLER");

      if (!Array.isArray(records)) {
        setStrikes([]);
        return;
      }

      // Get strike counts for each user
      const strikeCounts = await Promise.all(
        records.map(async (record) => ({
          recordId: record.id,
          userId: record.userId,
          count: await getUserStrikeCount(record.userId, "SELLER")
        }))
      );

      const strikeCountMap = Object.fromEntries(
        strikeCounts.map(sc => [sc.recordId, sc.count])
      );

      // Transform to StrikeRecord format
      const transformedStrikes: StrikeRecord[] = await Promise.all(
        records.map(async (record) => {
          const user = await fetchUserDetails(record.userId);
          const strikeCount = strikeCountMap[record.id] || 0;

          let status = "";
          if (record.type === "SUSPENSION") {
            status = "Suspended";
          } else if (record.type === "STRIKE") {
            status = `${strikeCount}/3 Strike${strikeCount > 1 ? 's' : ''}`;
          }

          return {
            id: record.id,
            sellerId: record.userId,
            sellerName: `${user.firstName} ${user.lastName}`,
            reason: record.reason,
            date: record.createdAt,
            status: status,
            cooldownEnds: record.suspendedUntil,
            sellerEmail: user.email,
            issuedBy: "Admin",
            description: record.reason,
          };
        })
      );

      setStrikes(transformedStrikes);
    } catch (err: any) {
      console.error("Error fetching strikes:", err);
      setError(err.message || "Failed to fetch strikes");
      toast.error("Failed to load strikes");
    } finally {
      setFetchingStrikes(false);
    }
  };

  useEffect(() => {
    fetchStrikes();
  }, []);

  const handleClearStrike = (strike: StrikeRecord) => {
    setConfirmTitle("Clear Strike");
    setConfirmDescription(`Are you sure you want to clear this strike for ${strike.sellerName}?`);
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);

        await clearStrike(strike.id);
        toast.success("Strike cleared successfully");
        await fetchStrikes();
      } catch (err: unknown) {
        console.error("Error clearing strike:", err);
        toast.error(err instanceof Error ? err.message : "Failed to clear strike");
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
  };

  const handleUpgradeToSuspension = (strike: StrikeRecord) => {
    setSelectedStrike(strike);
    setSuspensionReason("");
    setSuspensionDuration("7");
    setIsSuspendModalOpen(true);
  };

  const handleSuspend = async () => {
    if (!selectedStrike || !suspensionReason || !suspensionDuration) {
      toast.error("Please provide reason and duration");
      return;
    }

    setActionLoading(true);
    try {
      await issueSuspension(selectedStrike.sellerId, suspensionReason, parseInt(suspensionDuration), "SELLER");
      toast.success(`${selectedStrike.sellerName} suspended for ${suspensionDuration} days`);
      setIsSuspendModalOpen(false);
      setSuspensionReason("");
      setSuspensionDuration("7");
      await fetchStrikes();
    } catch (err: any) {
      toast.error(err.message || "Failed to issue suspension");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReinstate = (strike: StrikeRecord) => {
    setConfirmTitle("Reinstate Seller");
    setConfirmDescription(`Are you sure you want to reinstate ${strike.sellerName}?`);
    setConfirmAction(() => async () => {
      try {
        setActionLoading(true);
        setConfirmDialog(false);

        await reinstateSuspension(strike.id);
        toast.success("Seller reinstated successfully");
        await fetchStrikes();
      } catch (err: unknown) {
        console.error("Error reinstating seller:", err);
        toast.error(err instanceof Error ? err.message : "Failed to reinstate seller");
      } finally {
        setActionLoading(false);
      }
    });
    setConfirmDialog(true);
  };

  const handleExtendSuspension = (strike: StrikeRecord) => {
    setSelectedStrike(strike);
    setIsExtendModalOpen(true);
  };

  const handleExtend = async (days: string, notify: boolean) => {
    if (!selectedStrike) return;

    setActionLoading(true);
    try {
      await extendSuspension(selectedStrike.sellerId, parseInt(days), "Suspension extended", "SELLER");
      toast.success(`Suspension extended by ${days} days`);
      setIsExtendModalOpen(false);
      await fetchStrikes();
    } catch (err: any) {
      toast.error(err.message || "Failed to extend suspension");
    } finally {
      setActionLoading(false);
    }
  };

  const handleContact = (strike: StrikeRecord) => {
    window.location.href = `mailto:${strike.sellerEmail}`;
  };

  const filteredStrikes = strikes.filter(strike => {
    const searchLower = searchQuery.toLowerCase();
    return (
      strike.sellerName.toLowerCase().includes(searchLower) ||
      strike.sellerId.toLowerCase().includes(searchLower) ||
      strike.reason.toLowerCase().includes(searchLower)
    );
  });

  // Convert selectedStrike to DisplaySeller format
  const selectedSellerForModal: DisplaySeller | null = selectedStrike ? {
    id: selectedStrike.sellerId,
    name: selectedStrike.sellerName,
    email: selectedStrike.sellerEmail,
    shopName: selectedStrike.sellerName,
    status: selectedStrike.status,
    tier: "N/A",
    businessCategory: "N/A",
    location: "N/A",
    totalSales: "N/A",
    createdAt: selectedStrike.date,
  } : null;

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      <StrikesTable
        strikes={filteredStrikes}
        fetchingStrikes={fetchingStrikes}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExtendSuspension={handleExtendSuspension}
        onClearStrike={handleClearStrike}
        onUpgradeToSuspension={handleUpgradeToSuspension}
        onReinstate={handleReinstate}
        onContact={handleContact}
      />

      <SuspendSellerModal
        isOpen={isSuspendModalOpen}
        selectedSeller={selectedSellerForModal}
        reason={suspensionReason}
        duration={suspensionDuration}
        actionLoading={actionLoading}
        onOpenChange={setIsSuspendModalOpen}
        onReasonChange={setSuspensionReason}
        onDurationChange={setSuspensionDuration}
        onSuspend={handleSuspend}
      />

      <ExtendSuspensionModal
        isOpen={isExtendModalOpen}
        selectedSeller={selectedSellerForModal}
        actionLoading={actionLoading}
        onOpenChange={setIsExtendModalOpen}
        onExtend={handleExtend}
      />

      <ConfirmationDialog
        isOpen={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        onConfirm={confirmAction || (() => setConfirmDialog(false))}
        title={confirmTitle}
        description={confirmDescription}
        confirmText="Confirm"
        cancelText="Cancel"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default SellerStrikesPage;