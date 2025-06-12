
-- Aggiorna la tabella print_layouts per includere i nuovi margini
-- Margini copertina (sempre uguali per pari e dispari)
-- Margini allergeni (con supporto per pari e dispari)

-- Non possiamo modificare direttamente colonne JSONB esistenti, quindi aggiungiamo i nuovi campi
-- ai JSONB esistenti tramite UPDATE con nuove proprietà

-- Aggiunge i margini della copertina al campo page
UPDATE print_layouts 
SET page = page || jsonb_build_object(
  'coverMarginTop', COALESCE((page->>'marginTop')::integer, 25),
  'coverMarginRight', COALESCE((page->>'marginRight')::integer, 25), 
  'coverMarginBottom', COALESCE((page->>'marginBottom')::integer, 25),
  'coverMarginLeft', COALESCE((page->>'marginLeft')::integer, 25)
);

-- Aggiunge i margini delle pagine allergeni al campo page
UPDATE print_layouts 
SET page = page || jsonb_build_object(
  'allergensMarginTop', COALESCE((page->>'marginTop')::integer, 20),
  'allergensMarginRight', COALESCE((page->>'marginRight')::integer, 15),
  'allergensMarginBottom', COALESCE((page->>'marginBottom')::integer, 20), 
  'allergensMarginLeft', COALESCE((page->>'marginLeft')::integer, 15),
  'useDistinctMarginsForAllergensPages', false,
  'allergensOddPages', jsonb_build_object(
    'marginTop', COALESCE((page->>'marginTop')::integer, 20),
    'marginRight', COALESCE((page->>'marginRight')::integer, 15),
    'marginBottom', COALESCE((page->>'marginBottom')::integer, 20),
    'marginLeft', COALESCE((page->>'marginLeft')::integer, 15)
  ),
  'allergensEvenPages', jsonb_build_object(
    'marginTop', COALESCE((page->>'marginTop')::integer, 20),
    'marginRight', COALESCE((page->>'marginRight')::integer, 15),
    'marginBottom', COALESCE((page->>'marginBottom')::integer, 20),
    'marginLeft', COALESCE((page->>'marginLeft')::integer, 15)
  )
);
