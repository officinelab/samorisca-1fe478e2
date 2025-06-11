
-- Aggiungi il campo category_notes alla tabella print_layouts
ALTER TABLE public.print_layouts 
ADD COLUMN category_notes jsonb NOT NULL DEFAULT '{
  "icon": {
    "iconSize": 16
  },
  "title": {
    "fontFamily": "Arial",
    "fontSize": 14,
    "fontColor": "#000000",
    "fontStyle": "bold",
    "alignment": "left",
    "margin": {"top": 0, "right": 0, "bottom": 2, "left": 0},
    "visible": true
  },
  "text": {
    "fontFamily": "Arial",
    "fontSize": 12,
    "fontColor": "#333333",
    "fontStyle": "normal",
    "alignment": "left",
    "margin": {"top": 0, "right": 0, "bottom": 0, "left": 0},
    "visible": true
  }
}'::jsonb;
