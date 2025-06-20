
-- Aggiorna la struttura di default per product_features per includere il campo text nel title
ALTER TABLE print_layouts 
ALTER COLUMN product_features SET DEFAULT '{
  "icon": {
    "iconSize": 16,
    "marginTop": 0,
    "iconSpacing": 4,
    "marginBottom": 0
  },
  "title": {
    "text": "",
    "margin": {
      "top": 5,
      "left": 0,
      "right": 0,
      "bottom": 10
    },
    "visible": true,
    "fontSize": 18,
    "alignment": "left",
    "fontColor": "#000000",
    "fontStyle": "bold",
    "fontFamily": "Arial"
  }
}'::jsonb;

-- Aggiorna tutti i record esistenti per aggiungere il campo text se mancante
UPDATE print_layouts 
SET product_features = jsonb_set(
  product_features,
  '{title,text}',
  '""'::jsonb,
  true
)
WHERE NOT (product_features->'title' ? 'text');
