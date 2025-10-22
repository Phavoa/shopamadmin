"use client";

import React, { useState, useEffect } from "react";
import { StrikesTable, StrikeRecord } from "@/components/sellers/StrikesTable";
import { StrikeForm } from "@/components/sellers/StrikeForm";

// Mock data for strikes - in a real app, this would come from an API

const mockStrikeData: StrikeRecord[] = [
  {
    id: "1",
    sellerId: "seller-1",
    sellerName: "John Doe",
    sellerEmail: "john@example.com",
    reason: "Late delivery",
    date: "2024-01-15T10:00:00Z",
    status: "Strike(1/3)",
    cooldownEnds: null,
    issuedBy: "Admin User",
    description: "Seller failed to deliver order within promised timeframe",
  },
  {
    id: "2",
    sellerId: "seller-2",
    sellerName: "Jane Smith",
    sellerEmail: "jane@example.com",
    reason: "Product quality issue",
    date: "2024-01-10T14:30:00Z",
    status: "Strike(2/3)",
    cooldownEnds: "2024-01-25T10:00:00Z",
    issuedBy: "Admin User",
    description: "Multiple customer complaints about product quality",
  },
  {
    id: "3",
    sellerId: "seller-3",
    sellerName: "Bob Johnson",
    sellerEmail: "bob@example.com",
    reason: "Policy violation",
    date: "2024-01-05T16:45:00Z",
    status: "Suspended",
    cooldownEnds: "2024-02-05T16:45:00Z",
    issuedBy: "Admin User",
    description: "Violation of platform policies regarding prohibited items",
  },
  {
    id: "4",
    sellerId: "seller-4",
    sellerName: "Alice Brown",
    sellerEmail: "alice@example.com",
    reason: "Fake product",
    date: "2024-01-20T09:15:00Z",
    status: "Strike(1/3)",
    cooldownEnds: null,
    issuedBy: "Admin User",
    description: "Seller listed counterfeit products",
  },
  {
    id: "5",
    sellerId: "seller-5",
    sellerName: "Charlie Wilson",
    sellerEmail: "charlie@example.com",
    reason: "No show",
    date: "2024-01-18T11:30:00Z",
    status: "Strike(2/3)",
    cooldownEnds: "2024-01-28T11:30:00Z",
    issuedBy: "Admin User",
    description: "Seller did not show up for scheduled delivery",
  },
  {
    id: "6",
    sellerId: "seller-6",
    sellerName: "Diana Prince",
    sellerEmail: "diana@example.com",
    reason: "Abusive behavior",
    date: "2024-01-12T14:20:00Z",
    status: "Suspended",
    cooldownEnds: "2024-02-12T14:20:00Z",
    issuedBy: "Admin User",
    description: "Seller engaged in abusive communication with customers",
  },
  {
    id: "7",
    sellerId: "seller-7",
    sellerName: "Edward Norton",
    sellerEmail: "edward@example.com",
    reason: "Late delivery",
    date: "2024-01-08T16:45:00Z",
    status: "Strike(1/3)",
    cooldownEnds: null,
    issuedBy: "Admin User",
    description: "Multiple instances of delayed deliveries",
  },
  {
    id: "8",
    sellerId: "seller-8",
    sellerName: "Fiona Green",
    sellerEmail: "fiona@example.com",
    reason: "Product quality issue",
    date: "2024-01-22T08:00:00Z",
    status: "Strike(3/3)",
    cooldownEnds: "2024-02-01T08:00:00Z",
    issuedBy: "Admin User",
    description: "Consistent quality issues with products",
  },
  {
    id: "9",
    sellerId: "seller-9",
    sellerName: "George Miller",
    sellerEmail: "george@example.com",
    reason: "Policy violation",
    date: "2024-01-14T13:10:00Z",
    status: "Suspended",
    cooldownEnds: "2024-02-14T13:10:00Z",
    issuedBy: "Admin User",
    description: "Violation of marketplace policies",
  },
  {
    id: "10",
    sellerId: "seller-10",
    sellerName: "Helen Davis",
    sellerEmail: "helen@example.com",
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      let filteredStrikes = mockStrikeData;

      if (searchQuery) {
        filteredStrikes = filteredStrikes.filter(
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
