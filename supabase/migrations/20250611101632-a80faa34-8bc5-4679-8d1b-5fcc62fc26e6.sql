
-- Aggiungi la configurazione productFeatures agli elementi dei layout esistenti
UPDATE print_layouts 
SET elements = jsonb_set(
  elements, 
  '{productFeatures}', 
  '{
    "iconSize": 16,
    "iconSpacing": 8,
    "marginTop": 4,
    "marginBottom": 4
  }'::jsonb
)
WHERE elements ? 'allergensList' AND NOT (elements ? 'productFeatures');
