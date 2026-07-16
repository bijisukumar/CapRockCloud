# Caprock Cloud — Architecture Overview

## Stack

- **Frontend:** React 18 (function components + hooks), React Router, Tailwind CSS, Recharts.
- **Hosting:** Cloudflare Pages — static `dist/` build plus `/functions` as Pages Functions (edge Workers).
- **Data:** Cloudflare D1 (SQLite at the edge), bound to Pages Functions as `env.CAPROCK_DB`.
- **Enterprise integration:** Turbo360 REST API for Azure environment metrics (currently mocked — see below).

## Directory layout

```
src/
  components/
    Marketing/        Public site: hero, capabilities, gated-content modal
    Portal/            Authenticated customer dashboard
  lib/api.js           fetch() wrappers the frontend uses to call /functions/api/*
functions/
  api/leads.js                          POST — insert/upsert a lead into D1
  api/tenants/[tenantId]/metrics.js     GET  — tenant-scoped Turbo360 snapshot
db/
  migrations/          Raw SQL, applied with `wrangler d1 migrations apply`
```

## Request flows

### 1. Lead capture (gated content)

```
GatedContentModal (React)
  -> POST /api/leads            [functions/api/leads.js]
       -> env.CAPROCK_DB.prepare(...).bind(...).run()
       -> UPSERT into `leads` (unique on email + asset_slug)
```

No server framework, no queue — the Worker handles validation and the D1
write in one round trip. Cost stays at zero until traffic requires the paid
D1 tier.

### 2. Weekly lead digest (future, not yet wired)

```
Cloudflare Cron Trigger (e.g. "0 13 * * MON")
  -> Worker scans `leads` WHERE synced_at IS NULL
  -> calls Resend/Mailgun API to send the digest
  -> UPDATE leads SET synced_at = now() WHERE id IN (...)
```

Deliberately deferred per current scope — the `leads.synced_at` column and
index already exist in the schema so this can be added without a migration.

### 3. Customer portal — Azure/Turbo360 metrics

```
PortalPage -> DashboardLayout -> AzureMetricsView (React)
  -> GET /api/tenants/:tenantId/metrics   [functions/api/tenants/[tenantId]/metrics.js]
       -> SELECT ... FROM tenants WHERE slug = :tenantId   (tenant + turbo360_org_id lookup)
       -> [MOCKED] fetchTurbo360Snapshot(tenant)
       -> real version: fetch(`https://api.turbo360.com/orgs/${turbo360_org_id}/snapshot`,
                                { headers: { Authorization: `Bearer ${env.TURBO360_API_KEY}` } })
       -> JSON response shaped identically either way, so swapping the mock
          for the live call requires no frontend changes.
```

Tenant scoping happens server-side: the Worker resolves `turbo360_org_id`
from D1 by the tenant slug in the URL, so a customer can never pull another
tenant's Azure data even if they guess a slug — the mock/real Turbo360 call
is always parameterized by the row looked up from `tenants`.

## D1 schema summary

- `leads` — one row per (email, asset_slug); tracks attribution token and
  source page for marketing sync.
- `tenants` — one row per customer org; holds `azure_tenant_id` and
  `turbo360_org_id`, the two external identifiers everything else joins on.
- `user_profiles` — portal users, each FK'd to a `tenant_id`, with a `role`
  for coarse-grained authorization (owner/admin/member).

## Deliberately deferred (next phase)

- Real Turbo360 API auth (`TURBO360_API_KEY` secret + live fetch in
  `metrics.js`).
- Auth/session verification in `PortalPage` (currently unguarded — add
  Cloudflare Access or a custom session-cookie check before launch).
- Cron Trigger + Resend/Mailgun wiring for the weekly leads digest.
- D1 binding for `user_profiles`-based login (map an authenticated email to
  its `tenant_id` on every portal request).
