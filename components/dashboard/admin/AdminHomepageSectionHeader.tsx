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
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-brand-orange"
        >
          ← Back to Homepage
        </Link>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
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
        isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export function AdminTableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white shadow-sm">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

