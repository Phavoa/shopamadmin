"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/sellers/StrikesTable";
import { StrikeForm } from "@/components/sellers/StrikeForm";
import { getSellers, getUserById, SellerProfileVM } from "@/api/sellerApi";


const getStatusBadgeStyles = (status: string) => {
  if (status.includes("Strike")) {
    return "bg-[#D4F4DD] text-[#2E7D32] border-none";
  } else if (status === "Suspended") {
    return "bg-[#FFD4D4] text-[#D32F2F] border-none";
  } else {
    return "bg-[#E8F5E9] text-[#43A047] border-none";
  }
};

const Page = () => {
  const [strikes, setStrikes] = useState<StrikeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStrikes, setFetchingStrikes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSeller, setSelectedSeller] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [cooldownDays, setCooldownDays] = useState<string>("");
  const [selectedStrike, setSelectedStrike] = useState<StrikeRecord | null>(
    null
  );

  // Fetch strikes with filters
  const fetchStrikes = async () => {
    try {
      setFetchingStrikes(true);
      setError(null);
      const response = await getSellers({
        status: "SUSPENDED",
        limit: 50,
      });
      const sellersData = response.data.items;

      // Fetch user profiles for names
      const userPromises = sellersData.map((seller) => getUserById(seller.userId).catch(() => null));
      const userResults = await Promise.allSettled(userPromises);
      const userProfiles = userResults.map((result) => (result.status === 'fulfilled' ? result.value : null));

      let strikeRecords: StrikeRecord[] = sellersData.map(
        (seller: SellerProfileVM, index: number): StrikeRecord => {
          const user = userProfiles[index];
          return {
            id: seller.userId,
            sellerId: seller.userId,
            sellerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
            sellerEmail: user ? user.email : seller.userEmail,
            reason: "Suspended",
            date: seller.updatedAt, // Use updatedAt as suspension date
            status: "Suspended",
            cooldownEnds: null, // No cooldown info
            issuedBy: "Admin",
            description: "Seller account suspended",
          };
        }
      );

      if (searchQuery) {
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
      setError("Failed to load strikes. Please try again.");
    } finally {
      setFetchingStrikes(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStrikes();
  }, []);

  // Handle search and filters
  useEffect(() => {
    fetchStrikes();
  }, [searchQuery]);

  const handleSearch = () => {
    fetchStrikes();
  };

  const handleViewDetails = (strike: StrikeRecord) => {
    setSelectedStrike(strike);
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
