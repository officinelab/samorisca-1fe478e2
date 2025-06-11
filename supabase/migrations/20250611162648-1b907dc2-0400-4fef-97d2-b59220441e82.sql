
-- Aggiungi il campo service_price alla tabella print_layouts
ALTER TABLE public.print_layouts 
ADD COLUMN service_price jsonb NOT NULL DEFAULT '{
  "visible": true,
  "fontFamily": "Arial",
  "fontSize": 12,
  "fontColor": "#000000",
  "fontStyle": "normal",
  "alignment": "left",
  "margin": {"top": 0, "right": 0, "bottom": 0, "left": 0}
}'::jsonb;
