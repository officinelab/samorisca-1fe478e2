
-- Aggiungi campo page_breaks alla tabella print_layouts
ALTER TABLE public.print_layouts 
ADD COLUMN page_breaks jsonb NOT NULL DEFAULT '{"categoryIds": []}'::jsonb;

-- Aggiorna eventuali layout esistenti con il campo page_breaks se non presente
UPDATE public.print_layouts 
SET page_breaks = '{"categoryIds": []}'::jsonb 
WHERE page_breaks IS NULL;
