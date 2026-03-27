import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface LogisticsPaginationProps {
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onGoToFirst?: () => void;
  count: number;
  entityName?: string;
  limit?: number;
  onLimitChange?: (newLimit: number) => void;
}

const LogisticsPagination: React.FC<LogisticsPaginationProps> = ({
  currentPage,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  onGoToFirst,
  count,
  entityName = "items",
  limit = 10,
  onLimitChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-white rounded-b-lg gap-4">
      {/* Left side: Range info */}
      <div className="flex items-center gap-2 order-2 sm:order-1 flex-1">
        <p className="text-sm text-gray-500 whitespace-nowrap">
          Showing <span className="font-semibold text-gray-900">{count}</span> {entityName}
        </p>
      </div>

      {/* Center: Numbered Navigation using Shadcn */}
      <div className="order-1 sm:order-2 flex-1 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={onPrev} 
                disabled={!hasPrev}
                className={!hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {/* Page 1 */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink 
                  onClick={onGoToFirst}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis if jumping from 1 to 3+ */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Page before current if exists and not 1 */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink onClick={onPrev} className="cursor-pointer">
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Current Page */}
            <PaginationItem>
              <PaginationLink isActive className="bg-[#E67E22] border-[#E67E22] text-white hover:bg-[#D35400] hover:text-white cursor-default">
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {/* Next Page Number if exists */}
            {hasNext && (
              <PaginationItem>
                <PaginationLink onClick={onNext} className="cursor-pointer">
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis for more */}
            {hasNext && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext 
                onClick={onNext} 
                disabled={!hasNext}
                className={!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Right side: Limit selector */}
      <div className="flex items-center gap-3 order-3 flex-1 justify-end">
        <span className="text-sm text-gray-500 whitespace-nowrap">Rows:</span>
        <Select
          value={limit.toString()}
          onValueChange={(val) => onLimitChange?.(parseInt(val))}
        >
          <SelectTrigger className="h-8 w-[70px] text-xs border-gray-200 focus:ring-[#E67E22]/20 rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {[10, 20, 50, 100].map((option) => (
              <SelectItem key={option} value={option.toString()} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LogisticsPagination;
