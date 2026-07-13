export interface AdminStatItem {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export function AdminStatCard({ label, value, icon, color }: AdminStatItem) {
  return (
    <div className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-brand-border/80 bg-white px-3 py-2.5 shadow-sm transition-all duration-200 hover:border-brand-orange/30 hover:shadow-md sm:gap-3 sm:px-3.5 sm:py-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm sm:h-9 sm:w-9 sm:text-base ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium leading-tight text-gray-500 sm:text-xs">
          {label}
        </p>
        <p className="mt-0.5 truncate text-base font-bold leading-tight text-gray-900 sm:text-lg">
          {value}
        </p>
      </div>
    </div>
  );
}

export function AdminStatGrid({ stats }: { stats: AdminStatItem[] }) {
  if (stats.length === 0) return null;

  const count = stats.length;

  return (
    <div
      className={`grid gap-2 sm:gap-2.5 ${
        count === 3
          ? "grid-cols-2 sm:grid-cols-3"
          : count <= 2
            ? "grid-cols-2"
            : "grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {stats.map((stat) => (
        <AdminStatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
