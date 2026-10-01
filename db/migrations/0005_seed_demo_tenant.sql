-- Seeds the "Demo Client" tenant that the portal's sample dashboard points
-- at (src/components/Portal/TenantSelector.jsx). This existed only as a
-- manual `wrangler d1 execute` against production (see commit "Seed a Demo
-- Client tenant and point the portal at it") and was never captured in a
-- migration, so local dev and any fresh clone had no tenant row to look up
-- and the sample dashboard errored with "Couldn't load Azure environment
-- data". Turning it into a migration keeps local/remote/fresh-clone in sync.

INSERT INTO tenants (slug, display_name, azure_tenant_id, turbo360_org_id, plan)
VALUES ('demo-client', 'Demo Client', '00000000-0000-0000-0000-000000000000', 'demo-org', 'standard')
ON CONFLICT (slug) DO NOTHING;
