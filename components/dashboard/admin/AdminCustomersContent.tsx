"use client";

import { useListCustomersQuery } from "@/app/redux/services/adminApi";

export function AdminCustomersContent() {
  const { data: customers = [], isLoading, isError } = useListCustomersQuery();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-gray-500">
        Loading customers...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-red-600">
        Failed to load customers.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Customer List</h2>

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-gray-500">
          No customers yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-lg font-bold text-white">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.orderCount} orders</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="font-medium">{customer.phone}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="truncate font-medium">{customer.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Address</dt>
                  <dd className="mt-1 font-medium text-gray-700">{customer.address}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Source</dt>
                  <dd className="font-medium capitalize">{customer.source}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
