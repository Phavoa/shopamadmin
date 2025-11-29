"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/sellers/StrikesTable";
import { StrikeForm } from "@/components/sellers/StrikeForm";
import { getSellers, SellerProfileVM } from "@/api/sellerApi";

const Page = () => {
  const [strikes, setStrikes] = useState<StrikeRecord[]>([]);
  const [fetchingStrikes, setFetchingStrikes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [cooldownDays, setCooldownDays] = useState<string>("");

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
            strike.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            strike.sellerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-8">
        <StrikesTable
          strikes={strikes}
          fetchingStrikes={fetchingStrikes}
          error={error}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
    </div>
  );
};

export default Page;