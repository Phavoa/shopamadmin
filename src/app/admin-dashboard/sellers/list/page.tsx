"use client";

import React, { useState, useEffect } from "react";
import { getSellers, SellerProfileVM, SellerListParams } from "@/api/sellerApi";
import SellersFilters from "@/components/sellers/SellersFilters";
import SellersTable from "@/components/sellers/SellersTable";

// Type for display seller data
interface DisplaySeller {
  id: string;
  name: string;
  email: string;
  status: string;
  tier: string;
  shopName: string;
  businessCategory: string;
  location: string;
  totalSales: string;
  createdAt: string;
}

const Page = () => {
  const [sellers, setSellers] = useState<DisplaySeller[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSellers, setFetchingSellers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Fetch sellers with filters
  const fetchSellers = async (params: SellerListParams = {}) => {
    try {
      setFetchingSellers(true);
      setError(null);
      const response = await getSellers({
        ...params,
        limit: 50,
      });
      const displaySellers: DisplaySeller[] = response.data.items.map(
        (seller: SellerProfileVM) => ({
          id: seller.userId,
          name: `${seller.userFirstName} ${seller.userLastName}`,
          email: seller.userEmail,
          status: seller.status.toLowerCase(),
          tier: seller.tier,
          shopName: seller.shopName,
          businessCategory: seller.businessCategory,
          location: `${seller.locationCity}, ${seller.locationState}`,
          totalSales: seller.totalSales,
          createdAt: seller.createdAt,
        })
      );
      setSellers(displaySellers);
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
      setError("Failed to load sellers. Please try again.");
    } finally {
      setFetchingSellers(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSellers();
  }, []);

  // Handle search and filters
  const handleSearch = () => {
    const params: SellerListParams = {
      q: searchQuery || undefined,
      status:
        statusFilter !== "all"
          ? (statusFilter as
              | "PENDING"
              | "UNDER_REVIEW"
              | "ACTIVE"
              | "SUSPENDED")
          : undefined,
      tier: tierFilter !== "all" ? (tierFilter as "A" | "B" | "C") : undefined,
      sortBy: sortBy as "createdAt" | "totalSales" | "shopName",
      sortDir,
    };
    fetchSellers(params);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    const newSortDir =
      sortBy === newSortBy && sortDir === "desc" ? "asc" : "desc";
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    const params: SellerListParams = {
      q: searchQuery || undefined,
      status:
        statusFilter !== "all"
          ? (statusFilter as
              | "PENDING"
              | "UNDER_REVIEW"
              | "ACTIVE"
              | "SUSPENDED")
          : undefined,
      tier: tierFilter !== "all" ? (tierFilter as "A" | "B" | "C") : undefined,
      sortBy: newSortBy as "createdAt" | "totalSales" | "shopName",
      sortDir: newSortDir,
    };
    fetchSellers(params);
  };

  return (
    <div className="flex-1 space-y-6 py-10">
      <div className="border-t rounded-xl">
        <div className="border-[#EAEAEB] shadow-[0_1px_2px_rgba(77,86,80,0.06)] rounded-lg">
          <div className="px-6 py-6">
            <div className="text-lg font-semibold text-[#0f1720]">
              Sellers List
            </div>
          </div>

          <SellersFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            tierFilter={tierFilter}
            setTierFilter={setTierFilter}
            onApplyFilters={handleSearch}
            fetchingSellers={fetchingSellers}
          />

          <SellersTable
            sellers={sellers}
            fetchingSellers={fetchingSellers}
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
