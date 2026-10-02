-- Third gated asset: "Host Integration Server 2006 to 2020 -- Migration
-- Planning Guide", the follow-on to the HIS discovery checklist.

INSERT INTO content_assets (slug, title, description, file_path, alias)
VALUES (
  'his-2006-to-2020-migration-guide',
  'Host Integration Server 2006 to 2020 -- Migration Planning Guide',
  'What changes between HIS 2006 and HIS 2020, how to choose your target, and a phase-by-phase migration plan with the gotchas that catch teams out.',
  '/documents/his-2006-to-2020-migration-guide.pdf',
  'his-migration-plan'
)
ON CONFLICT (slug) DO NOTHING;
