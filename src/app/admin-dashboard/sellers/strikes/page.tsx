"use client";
import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/sellers/StrikesTable";
import { StrikeForm } from "@/components/sellers/StrikeForm";
import ExtendSuspensionModal from "@/components/sellers/ExtendSuspensionModal";
import { getSellers, SellerProfileVM } from "@/api/sellerApi";

interface SelectedSellerForExtend {
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

const Page = () => {
  const [strikes, setStrikes] = useState<StrikeRecord[]>([]);
  const [fetchingStrikes, setFetchingStrikes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [cooldownDays, setCooldownDays] = useState<string>("");

  // Extend Suspension Modal State
  const [extendModal, setExtendModal] = useState(false);
  const [selectedSellerForExtend, setSelectedSellerForExtend] = useState<SelectedSellerForExtend | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStrikes = async () => {
    try {
      setFetchingStrikes(true);
      setError(null);

      const response = await getSellers({
        status: "SUSPENDED",
        populate: "user",
        limit: 50,
      });
      let strikeRecords: StrikeRecord[] = response.data.items.map(
        (seller: SellerProfileVM): StrikeRecord => ({
          id: seller.userId,
          sellerId: seller.userId,
          sellerName: seller.shopName,
          sellerEmail: seller.userEmail || "N/A",
          reason: "Account Suspended",
          date: seller.updatedAt,
          status: "Suspended",
          cooldownEnds: null,
          issuedBy: "Admin",
          description: `Seller account suspended - ${seller.shopName}`,
        })
      );
      if (searchQuery.trim()) {
        strikeRecords = strikeRecords.filter(
          (strike) =>
            strike.sellerName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            strike.sellerEmail
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            strike.reason.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setStrikes(strikeRecords);
    } catch (error) {
      console.error("Failed to fetch strikes:", error);
      setError("Failed to load suspended sellers. Please try again.");
    } finally {
      setFetchingStrikes(false);
    }
  };

  useEffect(() => {
    fetchStrikes();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStrikes();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Handle Extend Suspension
  const openExtendModal = (strike: StrikeRecord) => {
    setSelectedSellerForExtend({
      id: strike.sellerId,
      name: strike.sellerName,
      email: strike.sellerEmail,
      shopName: strike.sellerName,
      status: "Suspended",
      tier: "N/A",
      businessCategory: "N/A",
      location: "N/A",
      totalSales: "N/A",
      createdAt: strike.date,
    });
    setExtendModal(true);
  };

  const handleExtendSuspension = async (days: string, notify: boolean) => {
    if (!selectedSellerForExtend || !days) {
      alert("Please select extension days");
      return;
    }

    try {
      setActionLoading(true);

      // TODO: Replace with actual API call when backend is ready
      // await extendSellerSuspension(selectedSellerForExtend.id, { days, notify });

      const extensionData = {
        sellerId: selectedSellerForExtend.id,
        sellerName: selectedSellerForExtend.name,
        sellerEmail: selectedSellerForExtend.email,
        extensionDays: days,
        notifySeller: notify,
        date: new Date().toISOString(),
      };

      console.log("Extension Data:", extensionData);

      // Store in localStorage for now
      const existingExtensions = JSON.parse(
        localStorage.getItem("seller_suspension_extensions") || "[]"
      );
      localStorage.setItem(
        "seller_suspension_extensions",
        JSON.stringify([...existingExtensions, extensionData])
      );

      setExtendModal(false);
      setSelectedSellerForExtend(null);
      alert(`Suspension extended by ${days} days!`);

      // Refresh strikes list
      await fetchStrikes();
    } catch (err) {
      console.error("Error extending suspension:", err);
      alert("Failed to extend suspension");
    } finally {
      setActionLoading(false);
    }
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
          onExtendSuspension={openExtendModal}
        />
        <StrikeForm
          selectedSeller={selectedSeller}
          reason={reason}
          cooldownDays={cooldownDays}
          onSellerChange={setSelectedSeller}
          onReasonChange={setReason}
          onCooldownDaysChange={setCooldownDays}
        />
      </div>

      {/* Extend Suspension Modal */}
      <ExtendSuspensionModal
        isOpen={extendModal}
        selectedSeller={selectedSellerForExtend}
        actionLoading={actionLoading}
        onOpenChange={setExtendModal}
        onExtend={handleExtendSuspension}
      />
    </div>
  );
};

export default Page;