"use client";

import { useAppSelector } from "@/app/redux/hooks";

export default function ProfilePage() {
  const customer = useAppSelector((state) => state.auth.customer);

  if (!customer) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">প্রোফাইল তথ্য পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">প্রোফাইল</h2>
      <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-brand-border pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-2xl font-bold text-white">
            {customer.name.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{customer.name}</p>
            <p className="text-sm text-gray-500">Khaas Food Customer</p>
          </div>
        </div>
        <dl className="mt-5 space-y-4 text-sm">
          {[
            { label: "ফোন", value: customer.phone },
            { label: "ইমেইল", value: customer.email },
            { label: "ঠিকানা", value: customer.address },
          ].map((row) => (
            <div key={row.label}>
              <dt className="text-gray-500">{row.label}</dt>
              <dd className="mt-1 font-semibold text-gray-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
