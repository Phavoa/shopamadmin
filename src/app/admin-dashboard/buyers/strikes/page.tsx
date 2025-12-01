"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/buyers/StrikesTable";
import { StrikeForm } from "@/components/buyers/StrikeForm";
import SuspendBuyerModal from "@/components/buyers/SuspendBuyerModal";
import ExtendSuspensionModal from "@/components/buyers/ExtendSuspensionModal";
import { Buyer, SelectedBuyerForAction } from "@/types/buyer";

// Mock data for strikes - in a real app, this would come from an API
const mockStrikeData: StrikeRecord[] = [
  {
    id: "1",
    buyerId: "buyer-1",
    buyerName: "John Doe",
    buyerEmail: "john@example.com",
    reason: "Late delivery",
    date: "2024-01-15T10:00:00Z",
    status: "Strike(1/3)",
    cooldownEnds: null,
    issuedBy: "Admin User",
    description: "Buyer failed to deliver order within promised timeframe",
  },
  {
    id: "2",
    buyerId: "buyer-2",
    buyerName: "Jane Smith",
    buyerEmail: "jane@example.com",
    reason: "Product quality issue",
    date: "2024-01-10T14:30:00Z",
    status: "Strike(2/3)",
    cooldownEnds: "2024-01-25T10:00:00Z",
    issuedBy: "Admin User",
    description: "Multiple customer complaints about product quality",
  },
  {
    id: "3",
    buyerId: "buyer-3",
    buyerName: "Bob Johnson",
    buyerEmail: "bob@example.com",
    reason: "Policy violation",
    date: "2024-01-05T16:45:00Z",
    status: "Suspended",
    cooldownEnds: "2024-02-05T16:45:00Z",
    issuedBy: "Admin User",
    description: "Violation of platform policies regarding prohibited items",
  },
  {
    id: "4",
    buyerId: "buyer-4",
    buyerName: "Alice Brown",
    buyerEmail: "alice@example.com",
    reason: "Fake product",
    date: "2024-01-20T09:15:00Z",
    status: "Strike(1/3)",
    cooldownEnds: null,
    issuedBy: "Admin User",
    description: "Buyer listed counterfeit products",
  },
  {
    id: "5",
    buyerId: "buyer-5",
    buyerName: "Charlie Wilson",
    buyerEmail: "charlie@example.com",
    reason: "No show",
    date: "2024-01-18T11:30:00Z",
    status: "Strike(2/3)",
    cooldownEnds: "2024-01-28T11:30:00Z",
    issuedBy: "Admin User",
    description: "Buyer did not show up for scheduled delivery",
  },
  {
    id: "6",
    buyerId: "buyer-6",
    buyerName: "Diana Prince",
    buyerEmail: "diana@example.com",
    reason: "Abusive behavior",
    date: "2024-01-12T14:20:00Z",
    status: "Suspended",
    cooldownEnds: "2024-02-12T14:20:00Z",
    issuedBy: "Admin User",
    description: "Buyer engaged in abusive communication with customers",
  },
  {
    id: "7",
    buyerId: "buyer-7",
    buyerName: "Edward Norton",
    buyerEmail: "edward@example.com",
    reason: "Late delivery",
    date: "2024-01-08T16:45:00Z",
    status: "Strike(1/3)",
    cooldownEnds: null,
    issuedBy: "Admin User",
    description: "Multiple instances of delayed deliveries",
  },
  {
    id: "8",
    buyerId: "buyer-8",
    buyerName: "Fiona Green",
    buyerEmail: "fiona@example.com",
    reason: "Product quality issue",
    date: "2024-01-22T08:00:00Z",
    status: "Strike(3/3)",
    cooldownEnds: "2024-02-01T08:00:00Z",
    issuedBy: "Admin User",
    description: "Consistent quality issues with products",
  },
  {
    id: "9",
    buyerId: "buyer-9",
    buyerName: "George Miller",
    buyerEmail: "george@example.com",
    reason: "Policy violation",
    date: "2024-01-14T13:10:00Z",
    status: "Suspended",
    cooldownEnds: "2024-02-14T13:10:00Z",
    issuedBy: "Admin User",
    description: "Violation of marketplace policies",
  },
  {
    id: "10",
    buyerId: "buyer-10",
    buyerName: "Helen Davis",
    buyerEmail: "helen@example.com",
    reason: "Fake product",
    date: "2024-01-25T10:30:00Z",
    status: "Strike(1/3)",
    cooldownEnds: null,
    issuedBy: "Admin User",
    description: "Listed unauthorized counterfeit items",
  },
];

const Page = () => {
  const [strikes, setStrikes] = useState<StrikeRecord[]>([]);
  const [fetchingStrikes, setFetchingStrikes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [cooldownDays, setCooldownDays] = useState<string>("");

  // Modal states
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [extendModal, setExtendModal] = useState(false);
  const [selectedBuyerForAction, setSelectedBuyerForAction] = useState<SelectedBuyerForAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [upgradeDuration, setUpgradeDuration] = useState("");

  // Fetch strikes with filters
  const fetchStrikes = async () => {
    try {
      setFetchingStrikes(true);
      setError(null);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      let filteredStrikes = mockStrikeData;

      if (searchQuery) {
        filteredStrikes = filteredStrikes.filter(
          (strike) =>
            strike.buyerName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            strike.buyerEmail
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            strike.reason.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setStrikes(filteredStrikes);
    } catch (error) {
      console.error("Failed to fetch strikes:", error);
      setError("Failed to load strikes. Please try again.");
    } finally {
      setFetchingStrikes(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStrikes();
  }, []);

  // Handle Upgrade to Suspension
  const openUpgradeModal = (strike: StrikeRecord) => {
    setSelectedBuyerForAction({
      id: strike.buyerId,
      name: strike.buyerName,
      firstName: strike.buyerName.split(" ")[0],
      lastName: strike.buyerName.split(" ")[1] || "",
      email: strike.buyerEmail,
    });
    setUpgradeModal(true);
  };

  const handleUpgradeToSuspension = async () => {
    if (!selectedBuyerForAction || !reason || !upgradeDuration) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setActionLoading(true);

      // TODO: Replace with actual API call when backend is ready
      // await upgradeBuyerToSuspension(selectedBuyerForAction.id, { reason, duration });

      const suspensionData = {
        buyerId: selectedBuyerForAction.id,
        buyerName: selectedBuyerForAction.name,
        buyerEmail: selectedBuyerForAction.email,
        reason,
        duration: upgradeDuration,
        status: "Suspended",
        upgradedFrom: "Strike",
        date: new Date().toISOString(),
      };

      console.log("Upgrade to Suspension Data:", suspensionData);

      // Store in localStorage for now
      const existingSuspensions = JSON.parse(
        localStorage.getItem("suspensions") || "[]"
      );
      localStorage.setItem(
        "suspensions",
        JSON.stringify([...existingSuspensions, suspensionData])
      );

      setUpgradeModal(false);
      setReason("");
      setUpgradeDuration("");
      setSelectedBuyerForAction(null);
      alert("Buyer upgraded to suspension!");

      // Refresh strikes
      await fetchStrikes();
    } catch (err) {
      console.error("Error upgrading to suspension:", err);
      alert("Failed to upgrade to suspension");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Extend Suspension
  const openExtendModal = (strike: StrikeRecord) => {
    setSelectedBuyerForAction({
      id: strike.buyerId,
      name: strike.buyerName,
      firstName: strike.buyerName.split(" ")[0],
      lastName: strike.buyerName.split(" ")[1] || "",
      email: strike.buyerEmail,
    });
    setExtendModal(true);
  };

  const handleExtendSuspension = async (days: string, notify: boolean) => {
    if (!selectedBuyerForAction || !days) {
      alert("Please select extension days");
      return;
    }

    try {
      setActionLoading(true);

      // TODO: Replace with actual API call when backend is ready
      // await extendBuyerSuspension(selectedBuyerForAction.id, { days, notify });

      const extensionData = {
        buyerId: selectedBuyerForAction.id,
        buyerName: selectedBuyerForAction.name,
        buyerEmail: selectedBuyerForAction.email,
        extensionDays: days,
        notifyBuyer: notify,
        date: new Date().toISOString(),
      };

      console.log("Extension Data:", extensionData);

      // Store in localStorage for now
      const existingExtensions = JSON.parse(
        localStorage.getItem("buyer_suspension_extensions") || "[]"
      );
      localStorage.setItem(
        "buyer_suspension_extensions",
        JSON.stringify([...existingExtensions, extensionData])
      );

      setExtendModal(false);
      setSelectedBuyerForAction(null);
      alert(`Suspension extended by ${days} days!`);

      // Refresh strikes
      await fetchStrikes();
    } catch (err) {
      console.error("Error extending suspension:", err);
      alert("Failed to extend suspension");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Revoke/Reinstate
  const handleRevoke = async (strike: StrikeRecord) => {
    if (!confirm(`Are you sure you want to revoke ${strike.status} for ${strike.buyerName}?`)) {
      return;
    }

    try {
      // TODO: Replace with actual API call when backend is ready
      // await revokeBuyerStrikeOrSuspension(strike.buyerId);

      const revokeData = {
        buyerId: strike.buyerId,
        buyerName: strike.buyerName,
        buyerEmail: strike.buyerEmail,
        previousStatus: strike.status,
        date: new Date().toISOString(),
      };

      console.log("Revoke Data:", revokeData);

      // Store in localStorage for now
      const existingRevokes = JSON.parse(
        localStorage.getItem("buyer_revokes") || "[]"
      );
      localStorage.setItem(
        "buyer_revokes",
        JSON.stringify([...existingRevokes, revokeData])
      );

      alert(`${strike.status} revoked for ${strike.buyerName}!`);

      // Refresh strikes
      await fetchStrikes();
    } catch (err) {
      console.error("Error revoking:", err);
      alert("Failed to revoke");
    }
  };

  // Handle Contact
  const handleContact = (strike: StrikeRecord) => {
    window.location.href = `mailto:${strike.buyerEmail}`;
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-8">
        <StrikesTable
          strikes={strikes}
          fetchingStrikes={fetchingStrikes}
          error={error}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUpgradeToSuspension={openUpgradeModal}
          onExtendSuspension={openExtendModal}
          onRevoke={handleRevoke}
          onContact={handleContact}
        />

        <StrikeForm
          selectedBuyer={selectedBuyer}
          reason={reason}
          cooldownDays={cooldownDays}
          onBuyerChange={setSelectedBuyer}
          onReasonChange={setReason}
          onCooldownDaysChange={setCooldownDays}
        />
      </div>

      {/* Upgrade to Suspension Modal */}
      <SuspendBuyerModal
        isOpen={upgradeModal}
        selectedBuyer={selectedBuyerForAction}
        reason={reason}
        duration={upgradeDuration}
        actionLoading={actionLoading}
        onOpenChange={setUpgradeModal}
        onReasonChange={setReason}
        onDurationChange={setUpgradeDuration}
        onSuspend={handleUpgradeToSuspension}
      />

      {/* Extend Suspension Modal */}
      <ExtendSuspensionModal
        isOpen={extendModal}
        selectedBuyer={selectedBuyerForAction}
        actionLoading={actionLoading}
        onOpenChange={setExtendModal}
        onExtend={handleExtendSuspension}
      />
    </div>
  );
};

export default Page;