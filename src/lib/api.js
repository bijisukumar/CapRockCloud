// Thin fetch wrappers around the Cloudflare Pages Functions in /functions.
// Kept framework-agnostic so components stay easy to test.

export async function submitLead(payload) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Lead submission failed (${res.status})`);
  }

  return res.json();
}

export async function fetchTenantMetrics(tenantId) {
  const res = await fetch(`/api/tenants/${encodeURIComponent(tenantId)}/metrics`);

  if (!res.ok) {
    throw new Error(`Failed to load metrics for tenant ${tenantId} (${res.status})`);
  }

  return res.json();
}
