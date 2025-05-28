
-- Fix per la funzione get_monthly_tokens_limit - risolve il problema di conversione del tipo
CREATE OR REPLACE FUNCTION public.get_monthly_tokens_limit()
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  limit_value INTEGER;
  raw_value TEXT;
BEGIN
  -- Recupera il valore grezzo dalle impostazioni del sito
  SELECT value::text
  INTO raw_value
  FROM public.site_settings
  WHERE key = 'monthlyTokensLimit';
  
  -- Se non trovato, usa il default di 300
  IF raw_value IS NULL THEN
    RETURN 300;
  END IF;
  
  -- Rimuovi le virgolette extra se presenti e converti a integer
  raw_value := TRIM(BOTH '"' FROM raw_value);
  
  BEGIN
    limit_value := raw_value::integer;
  EXCEPTION
    WHEN OTHERS THEN
      -- Se la conversione fallisce, usa il default
      RAISE NOTICE 'Errore nella conversione del limite mensile: %. Usando default 300.', raw_value;
      RETURN 300;
  END;
  
  -- Assicurati che il valore sia positivo
  IF limit_value <= 0 THEN
    RETURN 300;
  END IF;
  
  RETURN limit_value;
END;
$function$
