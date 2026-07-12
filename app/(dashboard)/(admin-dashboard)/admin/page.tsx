import Link from "next/link";
import {
  adminStats,
  recentOrders,
  statusLabels,
} from "@/lib/admin-data";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Orders", value: adminStats.totalOrders, icon: "📦", color: "bg-blue-50 text-blue-600" },
          { label: "Total Customers", value: adminStats.totalCustomers, icon: "👥", color: "bg-green-50 text-green-600" },
          { label: "Total Products", value: adminStats.totalProducts, icon: "🛍️", color: "bg-purple-50 text-purple-600" },
          { label: "Today's Sales", value: formatPrice(adminStats.todaySales), icon: "💰", color: "bg-orange-50 text-brand-orange" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="mt-4 text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <p className="text-sm font-semibold text-yellow-800">⏳ Pending Orders</p>
          <p className="mt-1 text-3xl font-bold text-yellow-900">{adminStats.pendingOrders}</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-700">⚠️ Low Stock Products</p>
          <p className="mt-1 text-3xl font-bold text-red-800">{adminStats.lowStock}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand-orange hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const status = statusLabels[order.status];
                return (
                  <tr key={order.id} className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30">
                    <td className="px-6 py-4 font-mono font-semibold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 font-semibold text-brand-orange">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
