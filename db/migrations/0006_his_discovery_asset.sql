-- Adds the "Host Integration Server to Azure Migration -- Discovery
-- Checklist" as a second gated-content asset, for the LinkedIn post
-- campaign. Served generically by /resources/:slug + functions/api/assets.

INSERT INTO content_assets (slug, title, description, file_path)
VALUES (
  'his-to-azure-discovery-checklist',
  'Host Integration Server to Azure Migration -- Discovery Checklist',
  'A structured discovery checklist for teams running Host Integration Server, SNA gateways, or TN3270/TN5250 connectivity, before planning a move to Azure.',
  '/documents/his-to-azure-discovery-checklist.pdf'
)
ON CONFLICT (slug) DO NOTHING;
