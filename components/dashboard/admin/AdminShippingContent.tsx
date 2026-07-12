"use client";

import { useState } from "react";
import {
  useDeleteShippingZoneMutation,
  useListAllShippingZonesQuery,
  useCreateShippingZoneMutation,
  type ShippingZone,
} from "@/app/redux/services/shippingApi";
import Swal from "sweetalert2";

export function AdminShippingContent() {
  const { data: zones = [], isLoading, isError, refetch } = useListAllShippingZonesQuery();
  const [createZone] = useCreateShippingZoneMutation();
  const [deleteZone] = useDeleteShippingZoneMutation();
  const [form, setForm] = useState({
    name: "",
    nameBn: "",
    deliveryFee: 80,
    freeDeliveryThreshold: 2000,
  });

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    try {
      await createZone(form).unwrap();
      setForm({ name: "", nameBn: "", deliveryFee: 80, freeDeliveryThreshold: 2000 });
      refetch();
    } catch {
      await Swal.fire({ icon: "error", title: "Failed to create zone" });
    }
  };

  const handleDelete = async (zone: ShippingZone) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete zone?",
      text: zone.name,
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;
    await deleteZone(zone.id).unwrap();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Shipping Zones</h2>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Run <code>018_shipping.sql</code> in Supabase, then refresh.
        </div>
      )}

      <div className="rounded-2xl border border-brand-border bg-white p-5">
        <h3 className="font-semibold text-gray-900">Add Zone</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            placeholder="Name (EN)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-brand-border px-4 py-2 text-sm"
          />
          <input
            placeholder="Name (BN)"
            value={form.nameBn}
            onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
            className="rounded-xl border border-brand-border px-4 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Delivery fee"
            value={form.deliveryFee}
            onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })}
            className="rounded-xl border border-brand-border px-4 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Free over"
            value={form.freeDeliveryThreshold}
            onChange={(e) => setForm({ ...form, freeDeliveryThreshold: Number(e.target.value) })}
            className="rounded-xl border border-brand-border px-4 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => void handleCreate()}
          className="mt-3 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white"
        >
          Add Zone
        </button>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-brand-gray/50 text-left text-xs uppercase text-gray-500">
              <th className="px-6 py-3">Zone</th>
              <th className="px-6 py-3">Fee</th>
              <th className="px-6 py-3">Free over</th>
              <th className="px-6 py-3">ETA</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : zones.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No zones.</td></tr>
            ) : (
              zones.map((zone) => (
                <tr key={zone.id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-medium">{zone.nameBn || zone.name}</td>
                  <td className="px-6 py-4">৳{zone.deliveryFee}</td>
                  <td className="px-6 py-4">৳{zone.freeDeliveryThreshold}</td>
                  <td className="px-6 py-4">{zone.estimatedDaysMin}-{zone.estimatedDaysMax} days</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => void handleDelete(zone)}
                      className="text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
