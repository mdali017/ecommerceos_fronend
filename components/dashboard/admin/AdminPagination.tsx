"use client";

import { useEffect, useMemo, useState } from "react";

export const ADMIN_DEFAULT_PAGE_SIZE = 10;

export function useAdminPagination<T>(items: T[], pageSize = ADMIN_DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  useEffect(() => {
    setPage(1);
  }, [total, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    setPage,
    pageSize,
    total,
    totalPages,
    pageItems,
    showingFrom: total === 0 ? 0 : (page - 1) * pageSize + 1,
    showingTo: Math.min(page * pageSize, total),
  };
}

export function AdminPagination({
  page,
  totalPages,
  total,
  showingFrom,
  showingTo,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  showingFrom: number;
  showingTo: number;
  onPageChange: (page: number) => void;
}) {
  if (total <= 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border px-4 py-3 sm:px-6">
      <p className="text-xs text-muted">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {showingFrom}–{showingTo}
        </span>{" "}
        of <span className="font-semibold text-foreground">{total}</span>
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-brand-gray disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="min-w-[5.5rem] text-center text-xs font-semibold text-foreground">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:bg-brand-gray disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
