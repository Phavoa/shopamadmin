"use client";

import React, { useState, useEffect } from "react";
import { mockBuyers, Buyer } from "@/lib/mockData";
import BuyersFilters from "@/components/buyers/BuyersFilters";
import BuyersTable from "@/components/buyers/BuyersTable";

// Type for display buyer data
interface DisplayBuyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  totalOrders: number;
  totalSpend: string;
  status: string;
  createdAt: string;
}

const Page = () => {
  const [buyers, setBuyers] = useState<DisplayBuyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingBuyers, setFetchingBuyers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Fetch buyers with filters using mock data
  const fetchBuyers = async () => {
    try {
      setFetchingBuyers(true);
      setError(null);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredBuyers = [...mockBuyers];

      // Apply search filter
      if (searchQuery) {
        filteredBuyers = filteredBuyers.filter(
          (buyer) =>
            buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            buyer.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filteredBuyers = filteredBuyers.filter(
          (buyer) => buyer.status === statusFilter.toLowerCase()
        );
      }

      // Apply sorting
      filteredBuyers.sort((a, b) => {
        let aValue: string | number, bValue: string | number;

        switch (sortBy) {
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "totalPurchases":
            aValue = parseFloat(a.totalSpend);
            bValue = parseFloat(b.totalSpend);
            break;
          case "userFirstName":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          default:
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
        }

        if (sortDir === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const displayBuyers: DisplayBuyer[] = filteredBuyers.map(
        (buyer: Buyer) => ({
          id: buyer.id,
          name: buyer.name,
          email: buyer.email,
          phone: buyer.phone,
          verified: buyer.verified,
          totalOrders: buyer.totalOrders,
          totalSpend: buyer.totalSpend,
          status: buyer.status,
          createdAt: buyer.createdAt,
        })
      );
      setBuyers(displayBuyers);
    } catch (error) {
      console.error("Failed to fetch buyers:", error);
      setError("Failed to load buyers. Please try again.");
    } finally {
      setFetchingBuyers(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBuyers();
  }, []);

  // Handle search and filters
  const handleSearch = () => {
    fetchBuyers();
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    const newSortDir =
      sortBy === newSortBy && sortDir === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    fetchBuyers();
  };

  return (
    <div className="flex-1 space-y-6 py-10">
      <div className="border-t rounded-xl">
        <div className="border-[#EAEAEB] shadow-[0_1px_2px_rgba(77,86,80,0.06)] rounded-lg">
          <div className="px-6 py-6">
            <div className="text-lg font-semibold text-[#0f1720]">
              Buyers List
            </div>
          </div>

          <BuyersFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onApplyFilters={handleSearch}
            fetchingBuyers={fetchingBuyers}
          />

          <BuyersTable
            buyers={buyers}
            fetchingBuyers={fetchingBuyers}
            error={error}
            sortBy={sortBy}
            sortDir={sortDir}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
