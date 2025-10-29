"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/buyers/StrikesTable";
import { StrikeForm } from "@/components/buyers/StrikeForm";

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
  const [selectedBuyer, setSelectedBuyer] = useState<string>("");
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

      if (statusFilter && statusFilter !== "all") {
        filteredStrikes = filteredStrikes.filter(
          (strike) => strike.status === statusFilter
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

  // Handle search and filters
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
          selectedBuyer={selectedBuyer}
          reason={reason}
          cooldownDays={cooldownDays}
          onBuyerChange={setSelectedBuyer}
          onReasonChange={setReason}
          onCooldownDaysChange={setCooldownDays}
        />
      </div>
    </div>
  );
};

export default Page;
