
-- Add iconSize field to allergens.item configuration in existing print_layouts
UPDATE print_layouts 
SET allergens = jsonb_set(
  allergens, 
  '{item,iconSize}', 
  '16'::jsonb
) 
WHERE allergens ? 'item' 
AND NOT (allergens->'item' ? 'iconSize');

-- For layouts that don't have allergens.item yet, we'll handle this in the code
