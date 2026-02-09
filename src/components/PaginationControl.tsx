import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useMemo } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

type PaginationRangeResult = {
  range: number[];
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
};

// calc Pagination's Range
export function usePaginationRange(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 4,
): PaginationRangeResult {
  return useMemo(() => {
    if (totalPages <= 1) {
      return { range: [], showStartEllipsis: false, showEndEllipsis: false };
    }

    let startPage = Math.max(currentPage - 1, 0);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage >= totalPages) {
      endPage = totalPages - 1;
      startPage = Math.max(endPage - maxVisiblePages + 1, 0);
    }

    const range = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );

    return {
      range,
      showStartEllipsis: startPage > 0,
      showEndEllipsis: endPage < totalPages - 1,
    };
  }, [currentPage, totalPages, maxVisiblePages]);
}

export default function PaginationControls({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const { range, showStartEllipsis, showEndEllipsis } = usePaginationRange(
    currentPage,
    totalPages,
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              className={
                currentPage === 0 ? "opacity-50 pointer-events-none" : ""
              }
            />
          </PaginationItem>
          {showStartEllipsis && (
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
          )}

          {range.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showEndEllipsis && (
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
              }
              className={
                currentPage === totalPages - 1
                  ? "opacity-50 pointer-events-none"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
