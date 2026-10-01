-- Cloudflare D1 (SQLite) schema: gated-content assets (the documents we
-- email out in exchange for name/email) and a `source` tag on
-- contact_messages so "Get on a Call" submissions can be told apart from
-- the general contact form.

CREATE TABLE IF NOT EXISTS content_assets (
  slug         TEXT PRIMARY KEY,            -- URL-safe id, e.g. 'middleware-to-cloud-migration-checklist'
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  file_path    TEXT NOT NULL,               -- path under /documents served as a static asset, e.g. '/documents/middleware-to-cloud-migration-checklist.pdf'
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

INSERT INTO content_assets (slug, title, description, file_path)
VALUES (
  'middleware-to-cloud-migration-checklist',
  'Middleware to Cloud Migration Checklist',
  'A phased checklist for moving legacy middleware and integrations onto Azure without a risky all-at-once cutover.',
  '/documents/middleware-to-cloud-migration-checklist.pdf'
)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE contact_messages ADD COLUMN source TEXT NOT NULL DEFAULT 'contact_form';
