import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TenantSelector, { MOCK_TENANTS } from "./TenantSelector.jsx";
import AzureMetricsView from "./AzureMetricsView.jsx";

export default function DashboardLayout() {
  const [activeKey, setActiveKey] = useState("overview");
  const [tenantSlug, setTenantSlug] = useState(MOCK_TENANTS[0].slug);

  return (
    <div className="flex min-h-screen bg-base-950">
      <Sidebar activeKey={activeKey} onSelect={setActiveKey} />

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-white/10 px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-medium text-zinc-300">
              Azure Environment — {activeKey === "overview" ? "Overview" : activeKey}
            </h1>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
              Demo data
            </span>
          </div>
          <TenantSelector tenantSlug={tenantSlug} onChange={setTenantSlug} />
        </header>

        <main className="mx-auto max-w-5xl px-8 py-10">
          <AzureMetricsView tenantSlug={tenantSlug} />
        </main>
      </div>
    </div>
  );
}
