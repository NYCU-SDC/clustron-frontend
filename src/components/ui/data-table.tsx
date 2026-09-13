import { type ReactNode } from "react";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Per-column presentation hints. Declared as the feature set's `columnMeta`
// slot so `meta` is typed on every column def without global augmentation.
export type DataTableColumnMeta = {
  headClassName?: string;
  cellClassName?: string;
};

export const dataTableFeatures = tableFeatures({
  columnMeta: {} as DataTableColumnMeta,
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumns<TData extends RowData> = Array<
  ColumnDef<DataTableFeatures, TData, any>
>;

// Column defs are authored with this helper so `accessor` infers the cell value
// type and `meta` is checked against DataTableColumnMeta.
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

type DataTableProps<TData extends RowData> = {
  columns: DataTableColumns<TData>;
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  /** Render this many skeleton rows while loading instead of a spinner. */
  loadingRowCount?: number;
  loadingMessage?: ReactNode;
  errorMessage?: ReactNode;
  emptyMessage?: ReactNode;
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: TData) => string | undefined);
};

function StateRow({
  colSpan,
  children,
}: {
  colSpan: number;
  children: ReactNode;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-24 text-center align-middle">
        {children}
      </TableCell>
    </TableRow>
  );
}

/**
 * Generic table driven by a single column model: header, cell and column width
 * live in one place instead of being split across a table and a row component.
 * Loading / error / empty are rendered inside the body so the header stays put.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  isLoading = false,
  isError = false,
  loadingRowCount,
  loadingMessage,
  errorMessage,
  emptyMessage,
  getRowId,
  onRowClick,
  className,
  headerClassName,
  rowClassName,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    getRowId: getRowId ? (row: TData) => getRowId(row) : undefined,
  });

  const leafColumns = table.getAllLeafColumns();
  const colSpan = leafColumns.length;

  let stateRow: ReactNode = null;
  if (isLoading) {
    stateRow = loadingRowCount ? (
      Array.from({ length: loadingRowCount }).map((_, index) => (
        <TableRow key={`loading-${index}`} className="hover:bg-transparent">
          {leafColumns.map((column) => (
            <TableCell key={column.id}>
              <Skeleton className="h-6 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <StateRow colSpan={colSpan}>
        <span className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingMessage}
        </span>
      </StateRow>
    );
  } else if (isError) {
    stateRow = (
      <StateRow colSpan={colSpan}>
        <span className="text-sm text-red-500">{errorMessage}</span>
      </StateRow>
    );
  } else if (data.length === 0 && emptyMessage != null) {
    stateRow = (
      <StateRow colSpan={colSpan}>
        <span className="text-sm text-gray-500">{emptyMessage}</span>
      </StateRow>
    );
  }

  return (
    <Table className={className}>
      <TableHeader className={headerClassName}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className={header.column.columnDef.meta?.headClassName}
              >
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {stateRow ??
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn(
                onRowClick && "cursor-pointer",
                typeof rowClassName === "function"
                  ? rowClassName(row.original)
                  : rowClassName,
              )}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              onKeyDown={
                onRowClick
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowClick(row.original);
                      }
                    }
                  : undefined
              }
            >
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cell.column.columnDef.meta?.cellClassName}
                >
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
