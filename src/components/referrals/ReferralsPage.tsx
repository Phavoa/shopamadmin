"use client";

import React, { useEffect, useState } from "react";
import ReferralsHeader from "./ReferralsHeader";
import ReferralsTable from "./ReferralsTable";
import ReferralsPagination from "./ReferralsPagination";
import { Referral as TableReferral } from "./ReferralsTable";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { useDispatch } from "react-redux";
import { useGetAllReferralsQuery } from "../../api/referralApi";
import type { Referral } from "../../api/referralApi";

// Helper function to transform API data to table format
const transformReferralData = (apiReferrals: Referral[]): TableReferral[] => {
  // Use a fixed date formatting approach to avoid hydration mismatches
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Use a consistent format that won't change between server and client
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "Invalid Date";
    }
  };

  return apiReferrals.map((ref, index) => ({
    id: ref.id,
    name: `${ref.refereeFirstName} ${ref.refereeLastName}`,
    email: ref.refereeEmail,
    referrals: 1, // This would need to be calculated based on actual data
    amountPaid: parseInt(ref.totalSpentKobo) / 100, // Convert from kobo to naira
    bonus: parseInt(ref.rewardsKobo) / 100, // Convert from kobo to naira
    joinedDate: formatDate(ref.createdAt),
    isTop: index < 3, // Mark first 3 as top performers
  }));
};

// Main Component
const ReferralsPage: React.FC = () => {
  // Pagination state
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20); // API limit

  // API call
  const { data, isLoading, isError, error } = useGetAllReferralsQuery({
    limit,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // Transform API data to table format
  const tableReferrals: TableReferral[] = data?.data?.items
    ? transformReferralData(data.data.items)
    : [];

  // Calculate pagination
  const totalItems = data?.data?.items?.length || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  const currentData = tableReferrals.slice(startIndex, endIndex);

  useEffect(() => {
    dispatch(setHeaderTitle("Referrals"));
  }, [dispatch]);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBack = () => {
    // Navigate back to settings
    window.location.href = "/admin-dashboard/settings";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <main className="px-4 py-8">
          <ReferralsHeader onBack={handleBack} />
          <div className="bg-white rounded-lg shadow-none border border-gray-200 p-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E67E22]"></div>
              <span className="ml-2 text-gray-600">Loading referrals...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen">
        <main className="px-4 py-8">
          <ReferralsHeader onBack={handleBack} />
          <div className="bg-white rounded-lg shadow-none border border-gray-200 p-8">
            <div className="text-center text-red-600">
              <p>Failed to load referrals. Please try again.</p>
              <p className="text-sm text-gray-500 mt-2">
                {typeof error === "object" && error && "data" in error
                  ? String(
                      (error as { data?: { message?: string } }).data
                        ?.message || "An unexpected error occurred"
                    )
                  : "An unexpected error occurred"}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="px-4 py-8">
        <ReferralsHeader onBack={handleBack} />

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-none border border-gray-200">
          {tableReferrals.length > 0 ? (
            <>
              <ReferralsTable referrals={currentData} />
              <ReferralsPagination
                totalItems={totalItems}
                currentPage={currentPage}
                itemsPerPage={limit}
                onNextPage={handleNextPage}
                onPrevPage={handlePrevPage}
              />
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No referrals found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReferralsPage;
