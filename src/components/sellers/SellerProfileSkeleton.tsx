import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageWrapper } from "@/components/shared/AnimatedWrapper";
import { ChevronLeft } from "lucide-react";

const SellerProfileSkeleton: React.FC = () => {
  return (
    <PageWrapper className="min-h-screen">
      {/* Back Button */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Side - Seller Profile Skeleton */}
          <div className="min-h-screen col-span-7">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-transparent py-4 rounded-2xl shadow-none border border-gray-200 overflow-hidden">
                {/* Header Section Skeleton */}
                <div className="px-5 md:px-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-full" />
                  </div>

                  {/* Stats Grid Skeleton */}
                  <div className="grid grid-cols-5 gap-0 mt-6">
                    {/* Total Sales */}
                    <div className="px-4 border-gray-200 col-span-2 md:col-span-1">
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    {/* Status */}
                    <div className="px-4 border-gray-200 col-span-1">
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    {/* Strikes */}
                    <div className="px-4 border-gray-200 col-span-1">
                      <Skeleton className="h-3 w-12 mb-2" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    {/* Category */}
                    <div className="px-4 border-gray-200 col-span-1">
                      <Skeleton className="h-3 w-20 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    {/* Location */}
                    <div className="px-4 border-gray-200 col-span-2 md:col-span-1">
                      <Skeleton className="h-3 w-18 mb-2" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>

                {/* Overview Section Skeleton */}
                <div className="px-5 md:px-6 mt-8">
                  <Skeleton className="h-5 w-24 mb-4" />
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-48 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-56 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-40 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-32 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-44 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-52 flex-1" />
                    </div>
                  </div>
                </div>

                {/* Activity Log Section Skeleton */}
                <div className="px-5 md:px-6 mt-8">
                  <Skeleton className="h-5 w-48 mb-4" />
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-56 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-48 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-64 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-36 flex-1" />
                    </div>
                  </div>
                </div>

                {/* Address Section Skeleton */}
                <div className="px-5 md:px-6 mt-8">
                  <Skeleton className="h-5 w-36 mb-4" />
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-52 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-44 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-72 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-56 flex-1" />
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 rounded-full mr-2 mt-1" />
                      <Skeleton className="h-4 w-64 flex-1" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Side - Tier Management Skeleton */}
          <div className="col-span-5 min-h-screen">
            <div className="max-w-md mx-auto">
              <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-5 md:px-6">
                  {/* Header */}
                  <Skeleton className="h-7 w-80 mb-6" />

                  {/* Current Tier Info */}
                  <div className="space-y-3 mb-6">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-44" />
                  </div>

                  {/* Manual Override Section */}
                  <div className="mb-5">
                    <Skeleton className="h-5 w-36 mb-3" />

                    {/* Tier Selection Buttons */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <Skeleton className="h-8 w-20 rounded-lg" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-12 rounded-lg" />
                    </div>

                    {/* Apply Override Button */}
                    <Skeleton className="h-12 w-full rounded-lg mb-4" />

                    {/* Reason Input */}
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>

                  {/* Reset Button */}
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SellerProfileSkeleton;
