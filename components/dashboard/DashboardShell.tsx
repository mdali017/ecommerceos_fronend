"use client";

import { useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { UnlockModal } from "./UnlockModal";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isUnlocked = useAppSelector((state) => state.auth.isDashboardUnlocked);
  const customer = useAppSelector((state) => state.auth.customer);

  return (
    <div className="flex h-screen overflow-hidden bg-brand-gray/40">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        customerName={customer?.name}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="relative flex-1 overflow-y-auto">
          <div
            className={`min-h-full p-4 transition-all duration-500 sm:p-6 ${
              !isUnlocked ? "pointer-events-none select-none blur-md" : ""
            }`}
          >
            {children}
          </div>

          {!isUnlocked && <UnlockModal />}
        </main>
      </div>
    </div>
  );
}
