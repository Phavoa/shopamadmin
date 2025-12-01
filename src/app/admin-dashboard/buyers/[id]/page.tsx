"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useGetUserByIdQuery } from "@/api/userApi";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import {
  AnimatedWrapper,
  PageWrapper,
} from "@/components/shared/AnimatedWrapper";
import BuyerProfileView from "@/components/buyers/BuyerProfileView";
import { BuyerLoadingState, BuyerErrorState } from "@/components/buyers";

const BuyerProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const buyerId = params.id as string;

  // Use RTK Query to fetch user data
  const {
    data: userResponse,
    isLoading,
    error: queryError,
  } = useGetUserByIdQuery(buyerId);

  React.useEffect(() => {
    dispatch(setHeaderTitle("Buyer Profile"));
  }, [dispatch]);

  // Process user data for display
  const user = userResponse?.data;

  // Create buyer object from user
  const buyer = user ? {
    ...user,
    name: `${user.firstName} ${user.lastName}`,
    totalOrders: 0, // Dummy - would need separate API
    totalSpend: "₦0", // Dummy - would need separate API
    lastActivity: new Date(user.updatedAt).toLocaleDateString(),
    strikes: 0, // Dummy - would need separate API
    followersCount: user.followersCount || 0,
    followingCount: user.followingCount || 0,
  } : null;

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return <BuyerLoadingState />;
  }

  // Error state
  if (queryError || !buyer) {
    const errorMessage = queryError
      ? "Failed to load buyer profile. Please try again."
      : "Buyer not found";

    return (
      <PageWrapper className="min-h-screen bg-white">
        <div className="px-6 py-4">
          <button
            onClick={handleBack}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Buyers List
          </button>

          <div className="flex items-center justify-center h-64">
            <div className="text-red-600">{errorMessage}</div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Main profile view
  return (
    <BuyerProfileView
      selectedBuyer={buyer}
      onBack={handleBack}
    />
  );
};

export default BuyerProfilePage;