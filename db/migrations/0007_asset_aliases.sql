-- Short, shareable aliases for gated assets, served at /r/:alias
-- (e.g. caprock-cloud.com/r/his-discovery). The long slug keeps working.

ALTER TABLE content_assets ADD COLUMN alias TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_content_assets_alias ON content_assets (alias);

UPDATE content_assets SET alias = 'his-discovery' WHERE slug = 'his-to-azure-discovery-checklist';
UPDATE content_assets SET alias = 'migration-checklist' WHERE slug = 'middleware-to-cloud-migration-checklist';
