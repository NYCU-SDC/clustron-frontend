// src/hooks/usePaginationRange.ts

import { useMemo } from "react";

// 使用 type 替代 interface，以匹配项目风格
export type PaginationRangeResult = {
  range: number[];
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
};

/**
 * 计算分页链接条应该显示的页码范围 (0-based 索引)。
 *
 * @param currentPage 当前页码 (0-based)
 * @param totalPages 总页数 (1-based)
 * @param maxVisiblePages 分页条上最多显示的页码按钮数量
 * @returns 包含要渲染的页码范围和省略号标志的对象
 */
export const usePaginationRange = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number = 4, // 保持与原代码一致
): PaginationRangeResult => {
  // <-- 使用 type 定义的类型注解返回值
  return useMemo(() => {
    if (totalPages <= 1) {
      return { range: [], showStartEllipsis: false, showEndEllipsis: false };
    }

    // 核心计算逻辑
    let startPage = Math.max(currentPage - 1, 0);
    let endPage = startPage + maxVisiblePages - 1;

    // 边界检查
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
