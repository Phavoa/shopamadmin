"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/api/userApi";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { PageWrapper } from "@/components/shared/AnimatedWrapper";
import BuyerProfileView from "@/components/buyers/BuyerProfileView";
import { BuyerLoadingState } from "@/components/buyers";

// Extended User type to handle all possible fields
interface ExtendedUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  status?: string;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  imageUrl?: string;
  followersCount?: number;
  followingCount?: number;
}

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
  const user = userResponse?.data as ExtendedUser | undefined;

  // Create buyer object from user - BuyerProfileView will fetch orders, wallet, etc.
  const buyer = user ? {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phoneNumber || user.phone || '',
    isVerified: true, // All registered buyers are automatically verified
    status: user.status || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profileImage: user.profileImage || user.imageUrl || '',
    followersCount: user.followersCount || 0,
    followingCount: user.followingCount || 0,
  } : null;

  const handleBack = () => {
    router.push('/admin-dashboard/buyers/list'); // Navigate back to buyers list
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