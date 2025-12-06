"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/buyers/StrikesTable";
import SuspendBuyerModal from "@/components/buyers/SuspendBuyerModal";
import ExtendSuspensionModal from "@/components/buyers/ExtendSuspensionModal";
import { getGroupedDisciplineRecords, getUserStrikeCount, revokeDisciplineAction, extendSuspension, issueSuspension } from "@/api/disciplineApi";
import toast from 'react-hot-toast';

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

interface SelectedBuyerForAction {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

const BuyerStrikesPage: React.FC = () => {
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

  const fetchUserDetails = async (userId: string) => {
    if (userCache[userId]) {
      return userCache[userId];
    }

    try {
      const user = await getUserById(userId);
      const userDetails = {
        firstName: user.firstName || "Unknown",
        lastName: user.lastName || "User",
        email: user.email || "N/A",
      };
      
      setUserCache(prev => ({ ...prev, [userId]: userDetails }));
      return userDetails;
    } catch (err) {
      console.error("Failed to fetch user:", err);
      return {
        firstName: "Unknown",
        lastName: "User",
        email: "N/A",
      };
    }
  };

  const fetchStrikes = async () => {
    try {
      setFetchingStrikes(true);
      setError(null);

      const records = await getGroupedDisciplineRecords("BUYER");
      
      if (!Array.isArray(records)) {
        setStrikes([]);
        return;
      }

      // Get strike counts for each user
      const strikeCounts = await Promise.all(
        records.map(async (record) => ({
          recordId: record.id,
          userId: record.userId,
          count: await getUserStrikeCount(record.userId, "BUYER")
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
            buyerId: record.userId,
            buyerName: `${user.firstName} ${user.lastName}`,
            reason: record.reason,
            date: record.createdAt,
            status: status,
            cooldownEnds: record.suspendedUntil,
            buyerEmail: user.email,
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

  const handleClearStrike = async (strike: StrikeRecord) => {
    const confirmed = window.confirm(`Are you sure you want to clear this strike for ${strike.buyerName}?`);
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await revokeDisciplineAction(strike.id);
      toast.success("Strike cleared successfully");
      await fetchStrikes();
    } catch (err: any) {
      toast.error(err.message || "Failed to clear strike");
    } finally {
      setActionLoading(false);
    }
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
      await issueSuspension(selectedStrike.buyerId, suspensionReason, parseInt(suspensionDuration), "BUYER");
      toast.success(`${selectedStrike.buyerName} suspended for ${suspensionDuration} days`);
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

  const handleReinstate = async (strike: StrikeRecord) => {
    const confirmed = window.confirm(`Are you sure you want to reinstate ${strike.buyerName}?`);
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await revokeDisciplineAction(strike.id);
      toast.success("Buyer reinstated successfully");
      await fetchStrikes();
    } catch (err: any) {
      toast.error(err.message || "Failed to reinstate buyer");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtendSuspension = (strike: StrikeRecord) => {
    setSelectedStrike(strike);
    setIsExtendModalOpen(true);
  };

  const handleExtend = async (days: string, notify: boolean) => {
    if (!selectedStrike) return;

    setActionLoading(true);
    try {
      await extendSuspension(selectedStrike.buyerId, parseInt(days), "Suspension extended", "BUYER");
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
    window.location.href = `mailto:${strike.buyerEmail}`;
  };

  const filteredStrikes = strikes.filter(strike => {
    const searchLower = searchQuery.toLowerCase();
    return (
      strike.buyerName.toLowerCase().includes(searchLower) ||
      strike.buyerId.toLowerCase().includes(searchLower) ||
      strike.reason.toLowerCase().includes(searchLower)
    );
  });

  // Convert selectedStrike to SelectedBuyerForAction format
  const selectedBuyerForAction: SelectedBuyerForAction | null = selectedStrike ? {
    id: selectedStrike.buyerId,
    name: selectedStrike.buyerName,
    firstName: selectedStrike.buyerName.split(' ')[0] || "Unknown",
    lastName: selectedStrike.buyerName.split(' ').slice(1).join(' ') || "User",
    email: selectedStrike.buyerEmail,
  } : null;

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      <StrikesTable
        strikes={filteredStrikes}
        fetchingStrikes={fetchingStrikes}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearStrike={handleClearStrike}
        onUpgradeToSuspension={handleUpgradeToSuspension}
        onReinstate={handleReinstate}
        onExtendSuspension={handleExtendSuspension}
        onContact={handleContact}
      />

      <SuspendBuyerModal
        isOpen={isSuspendModalOpen}
        selectedBuyer={selectedBuyerForAction}
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
        selectedBuyer={selectedBuyerForAction}
        actionLoading={actionLoading}
        onOpenChange={setIsExtendModalOpen}
        onExtend={handleExtend}
      />
    </div>
  );
};

export default BuyerStrikesPage;