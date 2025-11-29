"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BuyersPaginationProps {
  currentPage: number;
  hasNext: boolean;
  isLoading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const BuyersPagination: React.FC<BuyersPaginationProps> = ({
  currentPage,
  hasNext,
  isLoading,
  onNextPage,
  onPrevPage,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <p className="text-sm text-gray-600">Showing page {currentPage}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1 || isLoading}
          className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: "0.2px solid rgba(0,0,0,0.3)",
            background: "#F4F4F4",
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          className="flex items-center justify-center font-medium text-sm text-white"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "#E67E22",
          }}
        >
          {currentPage}
        </button>
        <button
          onClick={onNextPage}
          disabled={!hasNext || isLoading}
          className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-70 transition-opacity"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: "0.2px solid rgba(0,0,0,0.3)",
            background: "#F4F4F4",
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BuyersPagination;
