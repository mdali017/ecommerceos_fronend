export const adminStats = {
  totalOrders: 128,
  totalCustomers: 84,
  totalProducts: 56,
  todaySales: 24500,
  pendingOrders: 12,
  lowStock: 5,
};

export const recentOrders = [
  { id: "KF-48291034", customer: "Rahima Begum", total: 1930, status: "processing", date: "Jul 3, 2026" },
  { id: "KF-48291021", customer: "Karim Hossen", total: 850, status: "delivered", date: "Jul 2, 2026" },
  { id: "KF-48290998", customer: "Sumaiya Akter", total: 1680, status: "pending", date: "Jul 2, 2026" },
  { id: "KF-48290975", customer: "Abdullah", total: 3200, status: "processing", date: "Jul 1, 2026" },
  { id: "KF-48290950", customer: "Farhana Akter", total: 450, status: "delivered", date: "Jul 1, 2026" },
];

export const adminProducts = [
  { id: "p1", name: "Gawa Ghee 1kg", category: "Ghee", price: 1930, stock: 45, status: "active" },
  { id: "p2", name: "Pure Mustard Honey", category: "Honey", price: 850, stock: 120, status: "active" },
  { id: "p3", name: "Turmeric Powder", category: "Spices", price: 180, stock: 8, status: "low_stock" },
  { id: "p4", name: "Amrapali Mango", category: "Mango", price: 120, stock: 200, status: "active" },
  { id: "p5", name: "Black Seed Oil", category: "Oil", price: 450, stock: 0, status: "out_of_stock" },
];

export const adminCustomers = [
  { id: "c1", name: "Rahima Begum", email: "rahima@email.com", phone: "01712345678", orders: 5 },
  { id: "c2", name: "Karim Hossen", email: "karim@email.com", phone: "01812345678", orders: 3 },
  { id: "c3", name: "Sumaiya Akter", email: "sumaiya@email.com", phone: "01912345678", orders: 8 },
  { id: "c4", name: "Abdullah Al Mamun", email: "abdullah@email.com", phone: "01612345678", orders: 2 },
];

export const statusLabels: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400" },
  confirmed: { label: "Confirmed", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  shipped: { label: "Shipped", className: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400" },
  returned: { label: "Returned", className: "bg-orange-100 text-brand-orange dark:bg-orange-950/40" },
  active: { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
  low_stock: { label: "Low Stock", className: "bg-orange-100 text-brand-orange dark:bg-orange-950/40" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400" },
};
