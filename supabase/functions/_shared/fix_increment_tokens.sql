

-- Fix per la funzione increment_tokens - risolve l'ambiguità dei riferimenti alle colonne
CREATE OR REPLACE FUNCTION public.increment_tokens(token_count integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_month TEXT;
  monthly_tokens_used INTEGER;
  monthly_tokens_limit INTEGER;
  purchased_tokens_total INTEGER;
  purchased_tokens_used INTEGER;
  monthly_available INTEGER;
  purchased_available INTEGER;
  tokens_to_use_monthly INTEGER := 0;
  tokens_to_use_purchased INTEGER := 0;
BEGIN
  -- Ottieni mese corrente
  current_month := get_current_month();
  
  -- Crea record per il mese corrente se non esiste
  INSERT INTO public.translation_tokens (month, tokens_used, tokens_limit, purchased_tokens_total, purchased_tokens_used)
  VALUES (current_month, 0, 300, 0, 0)
  ON CONFLICT (month) DO NOTHING;
  
  -- Ottieni stato attuale dei token con alias espliciti per evitare ambiguità
  SELECT 
    COALESCE(tt.tokens_used, 0), 
    COALESCE(tt.tokens_limit, 300), 
    COALESCE(tt.purchased_tokens_total, 0),
    COALESCE(tt.purchased_tokens_used, 0)
  INTO 
    monthly_tokens_used, 
    monthly_tokens_limit, 
    purchased_tokens_total,
    purchased_tokens_used
  FROM public.translation_tokens tt
  WHERE tt.month = current_month;
  
  -- Calcola token disponibili
  monthly_available := GREATEST(0, monthly_tokens_limit - monthly_tokens_used);
  purchased_available := GREATEST(0, purchased_tokens_total - purchased_tokens_used);
  
  -- Verifica se ci sono abbastanza token totali
  IF (monthly_available + purchased_available) < token_count THEN
    RETURN FALSE; -- Non ci sono abbastanza token
  END IF;
  
  -- LOGICA: Prima usa token mensili, poi acquistati
  IF monthly_available >= token_count THEN
    -- Caso 1: Tutti i token vengono dai mensili
    tokens_to_use_monthly := token_count;
    tokens_to_use_purchased := 0;
  ELSE
    -- Caso 2: Usa tutti i mensili disponibili + parte degli acquistati
    tokens_to_use_monthly := monthly_available;
    tokens_to_use_purchased := token_count - monthly_available;
  END IF;
  
  -- Log per debug
  RAISE NOTICE 'Token da usare - Mensili: %, Acquistati: %', tokens_to_use_monthly, tokens_to_use_purchased;
  
  -- Aggiorna il database usando i nomi delle variabili locali
  UPDATE public.translation_tokens
  SET 
    tokens_used = public.translation_tokens.tokens_used + tokens_to_use_monthly,
    purchased_tokens_used = public.translation_tokens.purchased_tokens_used + tokens_to_use_purchased,
    last_updated = now()
  WHERE month = current_month;
  
  -- Verifica che l'update sia andato a buon fine
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Impossibile aggiornare i token per il mese %', current_month;
  END IF;
  
  RETURN TRUE;
END;
$function$

