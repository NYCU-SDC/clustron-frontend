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
  // 设置状态的函数类型
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const PaginationControls: React.FC<Props> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  // 使用 Hook 获取分页范围
  const { range, showStartEllipsis, showEndEllipsis } = usePaginationRange(
    currentPage,
    totalPages,
    4, // 保持 maxVisiblePages 为 4
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* 上一页按钮 */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              className={
                currentPage === 0 ? "opacity-50 pointer-events-none" : ""
              }
            />
          </PaginationItem>

          {/* 起始省略号 */}
          {showStartEllipsis && (
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
          )}

          {/* 页码链接 */}
          {range.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page + 1} {/* 0-based 索引转为 1-based 页码 */}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 结束省略号 */}
          {showEndEllipsis && (
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
          )}

          {/* 下一页按钮 */}
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
