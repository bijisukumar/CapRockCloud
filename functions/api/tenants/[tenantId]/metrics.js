// GET /api/tenants/:tenantId/metrics
// Cloudflare Pages Function — resolves the caller's tenant scope from D1,
// then fetches that tenant's Azure environment slice from Turbo360.
//
// NOTE: The Turbo360 call is mocked for now (see fetchTurbo360Snapshot below).
// Wiring the real API is tracked as follow-up work; swap the mock for a
// `fetch()` against Turbo360's REST API using env.TURBO360_API_KEY, scoped by
// the tenant's turbo360_org_id looked up from D1.

export async function onRequestGet({ params, env }) {
  const { tenantId } = params;

  const tenant = await env.CAPROCK_DB.prepare(
    `SELECT id, slug, display_name, turbo360_org_id, plan FROM tenants WHERE slug = ?1`
  )
    .bind(tenantId)
    .first();

  if (!tenant) {
    return new Response(JSON.stringify({ error: "Unknown tenant." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // TODO(turbo360-integration): replace with a real Turbo360 API call, e.g.
  //   const res = await fetch(`https://api.turbo360.com/orgs/${tenant.turbo360_org_id}/snapshot`, {
  //     headers: { Authorization: `Bearer ${env.TURBO360_API_KEY}` },
  //   });
  const snapshot = fetchTurbo360Snapshot(tenant);

  return new Response(JSON.stringify(snapshot), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function fetchTurbo360Snapshot(tenant) {
  return {
    tenant: tenant.slug,
    generatedAt: new Date().toISOString(),
    infrastructureHealth: {
      healthy: 42,
      degraded: 3,
      down: 0,
    },
    messageVolume: [
      { day: "Mon", processed: 128400, failed: 210 },
      { day: "Tue", processed: 134200, failed: 180 },
      { day: "Wed", processed: 119800, failed: 340 },
      { day: "Thu", processed: 142100, failed: 95 },
      { day: "Fri", processed: 138900, failed: 150 },
    ],
    alerts: [
      { severity: "warning", resource: "logic-app-order-sync", message: "Elevated latency (p95 > 2.4s)" },
      { severity: "info", resource: "service-bus-billing", message: "Autoscale event: 2 -> 4 workers" },
    ],
    costMetrics: {
      monthToDateUsd: 18240.55,
      forecastUsd: 26800.0,
      topServices: [
        { name: "Logic Apps", usd: 7120.1 },
        { name: "Service Bus", usd: 4310.4 },
        { name: "API Management", usd: 3980.0 },
      ],
    },
  };
}
