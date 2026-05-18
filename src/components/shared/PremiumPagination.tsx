"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PremiumPaginationProps {
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  isLoading: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToFirst: () => void;
  count: number;
  entityName?: string;
}

const PremiumPagination: React.FC<PremiumPaginationProps> = ({
  currentPage,
  hasNext,
  hasPrev,
  isLoading,
  onNextPage,
  onPrevPage,
  onGoToFirst,
  count,
  entityName = "items",
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-white rounded-b-lg gap-4">
      {/* Left side: Range info */}
      <div className="flex items-center">
        <p className="text-sm text-gray-600">
          Showing {count} {entityName} on page {currentPage}
        </p>
      </div>

      {/* Center: Numbered Navigation */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={onPrevPage}
          disabled={!hasPrev || isLoading}
          className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: "0.2px solid rgba(0,0,0,0.15)",
            background: "#FFF",
          }}
          title="Previous Page"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* First Page Link (Page 1) */}
        {currentPage > 1 && (
          <button
            onClick={onGoToFirst}
            disabled={isLoading}
            className="flex items-center justify-center font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "0.2px solid rgba(0,0,0,0.15)",
              background: "#FFF",
            }}
          >
            1
          </button>
        )}

        {/* Ellipsis if jumping from 1 to 3+ */}
        {currentPage > 3 && (
          <div
            className="flex items-center justify-center text-gray-400"
            style={{ width: "40px", height: "40px" }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </div>
        )}

        {/* Page before current if exists and not page 1 */}
        {currentPage > 2 && (
          <button
            onClick={onPrevPage}
            disabled={isLoading}
            className="flex items-center justify-center font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "0.2px solid rgba(0,0,0,0.15)",
              background: "#FFF",
            }}
          >
            {currentPage - 1}
          </button>
        )}

        {/* Current Page */}
        <button
          className="flex items-center justify-center font-semibold text-sm text-white cursor-default"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "#E67E22",
            boxShadow: "0 4px 12px rgba(230, 126, 34, 0.2)",
          }}
        >
          {currentPage}
        </button>

        {/* Page after current if hasNext is true */}
        {hasNext && (
          <button
            onClick={onNextPage}
            disabled={isLoading}
            className="flex items-center justify-center font-medium text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "0.2px solid rgba(0,0,0,0.15)",
              background: "#FFF",
            }}
          >
            {currentPage + 1}
          </button>
        )}

        {/* Ellipsis for future pages */}
        {hasNext && (
          <div
            className="flex items-center justify-center text-gray-400"
            style={{ width: "40px", height: "40px" }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={onNextPage}
          disabled={!hasNext || isLoading}
          className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: "0.2px solid rgba(0,0,0,0.15)",
            background: "#FFF",
          }}
          title="Next Page"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default PremiumPagination;
