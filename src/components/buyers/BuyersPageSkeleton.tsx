"use client";

import React from "react";
import BuyersTableSkeleton from "./BuyersTableSkeleton";

const BuyersPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>

      <BuyersTableSkeleton />

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center opacity-40"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "0.2px solid rgba(0,0,0,0.3)",
              background: "#F4F4F4",
            }}
          >
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div
            className="flex items-center justify-center font-medium text-sm text-white"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "#E67E22",
            }}
          >
            <div className="w-4 h-4 bg-white rounded animate-pulse"></div>
          </div>
          <div
            className="flex items-center justify-center opacity-40"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "0.2px solid rgba(0,0,0,0.3)",
              background: "#F4F4F4",
            }}
          >
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyersPageSkeleton;
