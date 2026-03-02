"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/buyers/StrikesTable";
import SuspendBuyerModal from "@/components/buyers/SuspendBuyerModal";
import ExtendSuspensionModal from "@/components/buyers/ExtendSuspensionModal";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";
import {
  useGetDisciplineRecordsQuery,
  useIssueSuspensionMutation,
  useClearStrikeMutation,
  useReinstateSuspensionMutation,
  useExtendSuspensionMutation,
  fetchUserById,
  DisciplineRecord,
} from "@/api/disciplineApi";

interface SelectedBuyerForAction {
  id: string; name: string; firstName: string; lastName: string; email: string;
}

const BuyerStrikesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStrike, setSelectedStrike] = useState<StrikeRecord | null>(null);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [suspensionDuration, setSuspensionDuration] = useState("7");
  const [strikes, setStrikes] = useState<StrikeRecord[]>([]);
  const [buildingStrikes, setBuildingStrikes] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  const { data, isLoading, isError, refetch } = useGetDisciplineRecordsQuery({
    role: "BUYER",
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 200,
  });

  const [issueSuspension, { isLoading: suspending }] = useIssueSuspensionMutation();
  const [clearStrike, { isLoading: clearing }] = useClearStrikeMutation();
  const [reinstateSuspension, { isLoading: reinstating }] = useReinstateSuspensionMutation();
  const [extendSuspension, { isLoading: extending }] = useExtendSuspensionMutation();

  const actionLoading = suspending || clearing || reinstating || extending;
  const records = data?.data?.items ?? [];

  // Build grouped + user-enriched strikes
  useEffect(() => {
    if (!records.length) { setStrikes([]); return; }

    const build = async () => {
      setBuildingStrikes(true);

      // Group by userId
      const userMap = new Map<string, DisciplineRecord[]>();
      records.forEach((r) => {
        if (!userMap.has(r.userId)) userMap.set(r.userId, []);
        userMap.get(r.userId)!.push(r);
      });

      const result: StrikeRecord[] = [];

      for (const [userId, userRecords] of userMap) {
        const activeSuspension = userRecords.find(r => r.type === "SUSPENSION" && r.status === "ACTIVE");
        const activeStrikes = userRecords.filter(r => r.type === "STRIKE" && r.status === "ACTIVE");
        const target = activeSuspension ?? (activeStrikes.length > 0
          ? activeStrikes.reduce((a, b) => new Date(b.createdAt) > new Date(a.createdAt) ? b : a)
          : null);

        if (!target) continue;

        // ✅ Try populated user first, fall back to fetchUserById
        let firstName = target.user?.firstName;
        let lastName = target.user?.lastName;
        let email = target.user?.email ?? "N/A";

        if (!firstName || !lastName) {
          const fetched = await fetchUserById(userId);
          firstName = fetched.firstName;
          lastName = fetched.lastName;
          email = fetched.email;
        }

        const name = `${firstName} ${lastName}`;
        const status = activeSuspension
          ? "Suspended"
          : `${activeStrikes.length}/3 Strike${activeStrikes.length > 1 ? "s" : ""}`;

        result.push({
          id: target.id,
          buyerId: userId,
          buyerName: name,
          buyerEmail: email,
          reason: target.reason,
          date: target.createdAt,
          status,
          cooldownEnds: target.suspendedUntil,
          issuedBy: "Admin",
          description: target.reason,
        });
      }

      setStrikes(result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setBuildingStrikes(false);
    };

    build();
  }, [data]);

  const filteredStrikes = strikes.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.buyerName.toLowerCase().includes(q) || s.buyerId.toLowerCase().includes(q) || s.reason.toLowerCase().includes(q);
  });

  const handleClearStrike = (strike: StrikeRecord) => {
    setConfirmTitle("Clear Strike");
    setConfirmDescription(`Clear this strike for ${strike.buyerName}?`);
    setConfirmAction(() => async () => {
      try {
        await clearStrike({ actionId: strike.id, data: { reason: "Strike cleared by admin." } }).unwrap();
        toast.success("Strike cleared successfully");
        refetch();
      } catch { toast.error("Failed to clear strike"); }
    });
    setConfirmDialog(true);
  };

  const handleReinstate = (strike: StrikeRecord) => {
    setConfirmTitle("Reinstate Buyer");
    setConfirmDescription(`Reinstate ${strike.buyerName}?`);
    setConfirmAction(() => async () => {
      try {
        await reinstateSuspension({ actionId: strike.id, data: { reason: "Reinstated by admin." } }).unwrap();
        toast.success("Buyer reinstated successfully");
        refetch();
      } catch { toast.error("Failed to reinstate buyer"); }
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
    try {
      await issueSuspension({ userId: selectedStrike.buyerId, data: { role: "BUYER", durationDays: parseInt(suspensionDuration), reason: suspensionReason } }).unwrap();
      toast.success(`${selectedStrike.buyerName} suspended for ${suspensionDuration} days`);
      setIsSuspendModalOpen(false);
      refetch();
    } catch { toast.error("Failed to issue suspension"); }
  };

  const handleExtendSuspension = (strike: StrikeRecord) => {
    setSelectedStrike(strike);
    setIsExtendModalOpen(true);
  };

  const handleExtend = async (days: string) => {
    if (!selectedStrike) return;
    try {
      await extendSuspension({ actionId: selectedStrike.id, data: { additionalDays: parseInt(days), reason: "Suspension extended by admin." } }).unwrap();
      toast.success(`Suspension extended by ${days} days`);
      setIsExtendModalOpen(false);
      refetch();
    } catch { toast.error("Failed to extend suspension"); }
  };

  const handleContact = (strike: StrikeRecord) => { window.location.href = `mailto:${strike.buyerEmail}`; };

  const selectedBuyerForAction: SelectedBuyerForAction | null = selectedStrike ? {
    id: selectedStrike.buyerId,
    name: selectedStrike.buyerName,
    firstName: selectedStrike.buyerName.split(" ")[0] ?? "",
    lastName: selectedStrike.buyerName.split(" ").slice(1).join(" ") ?? "",
    email: selectedStrike.buyerEmail,
  } : null;

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      <StrikesTable
        strikes={filteredStrikes}
        fetchingStrikes={isLoading || buildingStrikes}
        error={isError ? "Failed to load discipline records" : null}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearStrike={handleClearStrike}
        onUpgradeToSuspension={handleUpgradeToSuspension}
        onReinstate={handleReinstate}
        onExtendSuspension={handleExtendSuspension}
        onContact={handleContact}
      />
      <SuspendBuyerModal isOpen={isSuspendModalOpen} selectedBuyer={selectedBuyerForAction} reason={suspensionReason} duration={suspensionDuration} actionLoading={actionLoading} onOpenChange={setIsSuspendModalOpen} onReasonChange={setSuspensionReason} onDurationChange={setSuspensionDuration} onSuspend={handleSuspend} />
      <ExtendSuspensionModal isOpen={isExtendModalOpen} selectedBuyer={selectedBuyerForAction} actionLoading={actionLoading} onOpenChange={setIsExtendModalOpen} onExtend={handleExtend} />
      <ConfirmationDialog isOpen={confirmDialog} onClose={() => setConfirmDialog(false)} onConfirm={confirmAction || (() => setConfirmDialog(false))} title={confirmTitle} description={confirmDescription} confirmText="Confirm" cancelText="Cancel" isLoading={actionLoading} />
    </div>
  );
};

export default BuyerStrikesPage;