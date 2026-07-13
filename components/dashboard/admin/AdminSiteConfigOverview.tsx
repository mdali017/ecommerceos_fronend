"use client";

import Link from "next/link";
import { sitePages } from "@/lib/admin-site-config-data";

export function AdminSiteConfigOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Site Config</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage storefront pages — homepage, about, contact & more
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sitePages.map((page) => (
          <Link
            key={page.id}
            href={page.href}
            className="group rounded-2xl border border-brand-border bg-white p-5 shadow-sm transition-all hover:border-brand-orange/40 hover:shadow-md"
          >
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl ${page.color}`}
            >
              {page.icon}
            </div>

            <h3 className="mt-4 text-base font-bold text-gray-900 group-hover:text-brand-orange">
              {page.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{page.description}</p>

            <div className="mt-4 flex items-center justify-end border-t border-brand-border pt-4">
              <span className="text-sm font-semibold text-brand-orange group-hover:underline">
                Manage →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
