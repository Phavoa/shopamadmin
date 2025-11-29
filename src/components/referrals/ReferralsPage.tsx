import React, { useState } from "react";
import ReferralsHeader from "./ReferralsHeader";
import ReferralsTable from "./ReferralsTable";
import ReferralsPagination from "./ReferralsPagination";
import { Referral } from "./ReferralsTable";

// Mock Data
const referralsData: Referral[] = [
  {
    id: "1",
    name: "Chioma Adeleke",
    email: "chioma.adeleke@email.com",
    referrals: 45,
    amountPaid: 26500,
    bonus: 5000,
    joinedDate: "15 Jan 2024",
    isTop: true,
  },
  {
    id: "2",
    name: "Ibrahim Mohammed",
    email: "ibrahim.m@email.com",
    referrals: 38,
    amountPaid: 21000,
    bonus: 4000,
    joinedDate: "20 Feb 2024",
  },
  {
    id: "3",
    name: "Ngozi Okafor",
    email: "ngozi.okafor@email.com",
    referrals: 32,
    amountPaid: 18000,
    bonus: 3500,
    joinedDate: "8 Jan 2024",
  },
  {
    id: "4",
    name: "Ahmed Bello",
    email: "ahmed.bello@email.com",
    referrals: 28,
    amountPaid: 15400,
    bonus: 3000,
    joinedDate: "12 Mar 2024",
  },
  {
    id: "5",
    name: "Fatima Yusuf",
    email: "fatima.yusuf@email.com",
    referrals: 24,
    amountPaid: 13200,
    bonus: 2500,
    joinedDate: "5 Feb 2024",
  },
  {
    id: "6",
    name: "Chukwudi Eze",
    email: "chukwudi.eze@email.com",
    referrals: 19,
    amountPaid: 10500,
    bonus: 2000,
    joinedDate: "28 Mar 2024",
  },
  {
    id: "7",
    name: "Blessing Okoro",
    email: "blessing.okoro@email.com",
    referrals: 15,
    amountPaid: 9000,
    bonus: 1500,
    joinedDate: "10 Apr 2024",
  },
  {
    id: "8",
    name: "Tunde Akinola",
    email: "tunde.akinola@email.com",
    referrals: 12,
    amountPaid: 7000,
    bonus: 1200,
    joinedDate: "22 Apr 2024",
  },
];

// Pagination configuration
const ITEMS_PER_PAGE = 5;

// Main Component
const ReferralsPage: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalItems = referralsData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = referralsData.slice(startIndex, endIndex);

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

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="px-4 py-8">
        <ReferralsHeader onBack={handleBack} />

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-none border border-gray-200">
          <ReferralsTable referrals={currentData} />
          <ReferralsPagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        </div>
      </main>
    </div>
  );
};

export default ReferralsPage;
