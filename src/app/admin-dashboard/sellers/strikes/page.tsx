"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/sellers/StrikesTable";
import ExtendSuspensionModal from "@/components/sellers/ExtendSuspensionModal";
import SuspendSellerModal from "@/components/sellers/SuspendSellerModal";
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

interface DisplaySeller {
  id: string; name: string; email: string; shopName: string;
  status: string; tier: string; businessCategory: string;
  location: string; totalSales: string; createdAt: string;
}

const SellerStrikesPage: React.FC = () => {
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
    role: "SELLER",
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 200,
    populate: ["user"],
  });

  const [issueSuspension, { isLoading: suspending }] = useIssueSuspensionMutation();
  const [clearStrike, { isLoading: clearing }] = useClearStrikeMutation();
  const [reinstateSuspension, { isLoading: reinstating }] = useReinstateSuspensionMutation();
  const [extendSuspension, { isLoading: extending }] = useExtendSuspensionMutation();

  const actionLoading = suspending || clearing || reinstating || extending;
  const records = data?.data?.items ?? [];

  useEffect(() => {
    if (!records.length) { setStrikes([]); return; }

    const build = async () => {
      setBuildingStrikes(true);

      // Group by userId — user data comes from populate:['user'] in the query
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

        // Try: sellerName from detail API, then populated user, then fetch individually
        let name  = target.sellerName ?? (target.user ? `${target.user.firstName} ${target.user.lastName}` : null);
        let email = target.sellerEmail ?? target.user?.email ?? null;

        if (!name || !email) {
          const fetched = await fetchUserById(userId);
          name  = name  ?? `${fetched.firstName} ${fetched.lastName}`;
          email = email ?? fetched.email;
        }

        const status = activeSuspension
          ? "Suspended"
          : `${activeStrikes.length}/3 Strike${activeStrikes.length > 1 ? "s" : ""}`;

        result.push({
          id: target.id,
          sellerId: userId,
          sellerName: name,
          sellerEmail: email,
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
    return s.sellerName.toLowerCase().includes(q) || s.sellerId.toLowerCase().includes(q) || s.reason.toLowerCase().includes(q);
  });

  const handleClearStrike = (strike: StrikeRecord) => {
    setConfirmTitle("Clear Strike");
    setConfirmDescription(`Clear this strike for ${strike.sellerName}?`);
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
    setConfirmTitle("Reinstate Seller");
    setConfirmDescription(`Reinstate ${strike.sellerName}?`);
    setConfirmAction(() => async () => {
      try {
        await reinstateSuspension({ actionId: strike.id, data: { reason: "Reinstated by admin." } }).unwrap();
        toast.success("Seller reinstated successfully");
        refetch();
      } catch { toast.error("Failed to reinstate seller"); }
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
      await issueSuspension({ userId: selectedStrike.sellerId, data: { role: "SELLER", durationDays: parseInt(suspensionDuration), reason: suspensionReason } }).unwrap();
      toast.success(`${selectedStrike.sellerName} suspended for ${suspensionDuration} days`);
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

  const handleContact = (strike: StrikeRecord) => { window.location.href = `mailto:${strike.sellerEmail}`; };

  const selectedSellerForModal: DisplaySeller | null = selectedStrike ? {
    id: selectedStrike.sellerId,
    name: selectedStrike.sellerName,
    email: selectedStrike.sellerEmail,
    shopName: selectedStrike.sellerName,
    status: selectedStrike.status,
    tier: "N/A", businessCategory: "N/A", location: "N/A", totalSales: "N/A",
    createdAt: selectedStrike.date,
  } : null;

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      <StrikesTable
        strikes={filteredStrikes}
        fetchingStrikes={isLoading || buildingStrikes}
        error={isError ? "Failed to load discipline records" : null}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExtendSuspension={handleExtendSuspension}
        onClearStrike={handleClearStrike}
        onUpgradeToSuspension={handleUpgradeToSuspension}
        onReinstate={handleReinstate}
        onContact={handleContact}
      />
      <SuspendSellerModal isOpen={isSuspendModalOpen} selectedSeller={selectedSellerForModal} reason={suspensionReason} duration={suspensionDuration} actionLoading={actionLoading} onOpenChange={setIsSuspendModalOpen} onReasonChange={setSuspensionReason} onDurationChange={setSuspensionDuration} onSuspend={handleSuspend} />
      <ExtendSuspensionModal isOpen={isExtendModalOpen} selectedSeller={selectedSellerForModal} actionLoading={actionLoading} onOpenChange={setIsExtendModalOpen} onExtend={handleExtend} />
      <ConfirmationDialog isOpen={confirmDialog} onClose={() => setConfirmDialog(false)} onConfirm={confirmAction || (() => setConfirmDialog(false))} title={confirmTitle} description={confirmDescription} confirmText="Confirm" cancelText="Cancel" isLoading={actionLoading} />
    </div>
  );
};

export default SellerStrikesPage;