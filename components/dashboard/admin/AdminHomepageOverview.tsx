"use client";

import Link from "next/link";
import { homepageSections } from "@/lib/admin-homepage-data";

export function AdminHomepageOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Homepage Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage storefront sections — categories, banners, brands & more
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {homepageSections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="group rounded-2xl border border-brand-border bg-white p-5 shadow-sm transition-all hover:border-brand-orange/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl ${section.color}`}
              >
                {section.icon}
              </div>
              <span className="rounded-full bg-brand-gray px-2.5 py-1 text-xs font-semibold text-gray-600">
                {section.activeCount}/{section.count} active
              </span>
            </div>

            <h3 className="mt-4 text-base font-bold text-gray-900 group-hover:text-brand-orange">
              {section.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{section.description}</p>

            <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-4">
              <span className="text-2xl font-bold text-gray-900">{section.count}</span>
              <span className="text-sm font-semibold text-brand-orange group-hover:underline">
                Manage →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-brand-border bg-brand-gray/30 px-6 py-5">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Note:</span> API integration coming soon.
          Currently showing preview data matching the live homepage.
        </p>
      </div>
    </div>
  );
}
