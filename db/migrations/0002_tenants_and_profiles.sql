-- Cloudflare D1 (SQLite) schema: tenants and authenticated user profiles
-- that back the multi-tenant customer portal and Turbo360 integration.

CREATE TABLE IF NOT EXISTS tenants (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  slug               TEXT NOT NULL UNIQUE,        -- URL-safe tenant identifier, e.g. 'acme-corp'
  display_name       TEXT NOT NULL,
  azure_tenant_id    TEXT NOT NULL,               -- Azure AD tenant GUID
  turbo360_org_id    TEXT,                        -- Turbo360 organization identifier for API scoping
  plan               TEXT NOT NULL DEFAULT 'standard' CHECK (plan IN ('standard', 'premium', 'enterprise')),
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id          INTEGER NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
  email              TEXT NOT NULL UNIQUE,
  name               TEXT NOT NULL,
  role               TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  last_login_at      TEXT,
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_tenant_id ON user_profiles (tenant_id);
