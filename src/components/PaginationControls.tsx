import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePaginationRange } from "@/hooks/usePaginationRange";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const PaginationControls: React.FC<Props> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
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
};

export default PaginationControls;
