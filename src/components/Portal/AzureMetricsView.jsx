import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fetchTenantMetrics } from "../../lib/api.js";

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-white/10 bg-base-900 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

function SeverityBadge({ severity }) {
  const styles = {
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
        styles[severity] || styles.info
      }`}
    >
      {severity}
    </span>
  );
}

export default function AzureMetricsView({ tenantSlug }) {
  const [snapshot, setSnapshot] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchTenantMetrics(tenantSlug)
      .then((data) => {
        if (!cancelled) {
          setSnapshot(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [tenantSlug]);

  if (status === "loading") {
    return <p className="text-sm text-zinc-500">Loading Azure environment stats…</p>;
  }

  if (status === "error" || !snapshot) {
    return (
      <p className="text-sm text-red-400">
        Couldn&apos;t load Azure environment data for this tenant. Try again shortly.
      </p>
    );
  }

  const { infrastructureHealth, messageVolume, alerts, costMetrics } = snapshot;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Infrastructure Health"
          value={`${infrastructureHealth.healthy} healthy`}
          hint={`${infrastructureHealth.degraded} degraded · ${infrastructureHealth.down} down`}
        />
        <StatCard
          label="Cost (Month to Date)"
          value={`$${costMetrics.monthToDateUsd.toLocaleString()}`}
          hint={`Forecast: $${costMetrics.forecastUsd.toLocaleString()}`}
        />
        <StatCard
          label="Open Alerts"
          value={alerts.length}
          hint="Across all monitored resources"
        />
      </div>

      <div className="rounded-lg border border-white/10 bg-base-900 p-6">
        <h3 className="text-sm font-semibold text-white">
          Message Processing Volume
        </h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={messageVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#111317",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="processed" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-base-900 p-6">
        <h3 className="text-sm font-semibold text-white">Alert Log</h3>
        <ul className="mt-4 divide-y divide-white/5">
          {alerts.map((alert, i) => (
            <li key={i} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="text-zinc-200">{alert.resource}</p>
                <p className="text-zinc-500">{alert.message}</p>
              </div>
              <SeverityBadge severity={alert.severity} />
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-white/10 bg-base-900 p-6">
        <h3 className="text-sm font-semibold text-white">Cost by Service</h3>
        <ul className="mt-4 space-y-2">
          {costMetrics.topServices.map((service) => (
            <li
              key={service.name}
              className="flex items-center justify-between text-sm text-zinc-300"
            >
              <span>{service.name}</span>
              <span className="font-mono text-zinc-400">
                ${service.usd.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
