import { useMemo } from "react";

export type PaginationRangeResult = {
  range: number[];
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
};

export const usePaginationRange = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 4,
): PaginationRangeResult => {
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
};
