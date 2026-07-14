"use client";

import Link from "next/link";

interface AdminHomepageSectionHeaderProps {
  title: string;
  description?: string;
  addLabel: string;
  onAdd?: () => void;
}

export function AdminHomepageSectionHeader({
  title,
  description,
  addLabel,
  onAdd,
}: AdminHomepageSectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <Link
          href="/admin/homepage"
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-brand-orange"
        >
          ← Back to Homepage
        </Link>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
      >
        {addLabel}
      </button>
    </div>
  );
}

export function AdminStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
          : "bg-brand-gray text-muted"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export function AdminTableShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-brand-border bg-card shadow-sm">
      <div className="overflow-x-auto">{children}</div>
      {footer}
    </div>
  );
}

