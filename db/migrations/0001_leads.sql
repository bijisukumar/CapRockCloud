-- Cloudflare D1 (SQLite) schema: leads captured from gated marketing content.
-- Applied via: wrangler d1 migrations apply caprock-db --local|--remote

CREATE TABLE IF NOT EXISTS leads (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  name               TEXT NOT NULL,
  email              TEXT NOT NULL,
  company            TEXT NOT NULL,
  asset_slug         TEXT NOT NULL,              -- e.g. 'middleware-to-cloud-migration-checklist'
  attribution_token  TEXT,                       -- utm_campaign or similar, nullable
  source_page        TEXT,                       -- path the form was submitted from
  synced_at          TEXT,                       -- last time this row was pushed to the email platform
  created_at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- One lead per (email, asset) so re-downloading the same asset doesn't duplicate rows.
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_asset ON leads (email, asset_slug);

-- Speeds up the weekly cron trigger that scans for unsynced rows.
CREATE INDEX IF NOT EXISTS idx_leads_synced_at ON leads (synced_at);
