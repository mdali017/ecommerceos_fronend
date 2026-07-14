"use client";

import Link from "next/link";

interface AdminSitePageEditorProps {
  title: string;
  description: string;
}

export function AdminSitePageEditor({ title, description }: AdminSitePageEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/site-config"
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-brand-orange"
        >
          ← Back to Site Config
        </Link>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      <div className="rounded-2xl border border-dashed border-brand-border bg-brand-gray/30 px-6 py-10 text-center">
        <p className="text-sm text-muted">
          Page editor coming soon. Content for this page will be manageable from here.
        </p>
      </div>
    </div>
  );
}
