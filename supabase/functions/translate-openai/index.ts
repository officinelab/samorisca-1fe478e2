import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { mapLanguageCode } from "./langUtils.ts";
import { getSystemPrompt } from "./prompts.ts";
import { logDetailedError } from "./utils.ts";

// Configurazioni
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const MODEL = "gpt-4o-mini";

// Client Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();

    if (requestData.checkApiKeyOnly === true) {
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: "API key OpenAI non configurata" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text, targetLanguage, entityId, entityType, fieldName } = requestData;

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "API key OpenAI non configurata" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Parametri mancanti" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[OPENAI] ==> Traduzione di: "${text}" in ${targetLanguage}`);

    // --- Check token availability prima di traduzione
    const { data: tokensData, error: tokensError } = await supabase.rpc('get_remaining_tokens');
    if (tokensError) {
      console.error('[OPENAI][TOKEN] Errore nel controllo dei token:', tokensError);
      return new Response(
        JSON.stringify({ error: "Errore nel controllo dei token disponibili" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (tokensData <= 0) {
      return new Response(
        JSON.stringify({ error: "Token mensili esauriti" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prompt e traduzione
    const targetLangName = mapLanguageCode(targetLanguage);
    const systemPrompt = getSystemPrompt(targetLangName);

    const requestBody = {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.1,
    };

    // --- Invio richiesta a OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[OPENAI] Errore API:', errorData);
      return new Response(
        JSON.stringify({ error: `Errore API OpenAI: ${errorData.error?.message || 'Errore sconosciuto'} (Stato ${response.status})` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();

    if (!translatedText) {
      return new Response(
        JSON.stringify({ error: "Nessun testo tradotto restituito da OpenAI." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    console.log(`[OPENAI] <== Risultato: "${translatedText}"`);
    console.log("[OPENAI] Traduzione completata con successo");

    // --- Salva traduzione
    try {
      const { error: saveError } = await supabase
        .from('translations')
        .upsert({
          entity_id: entityId,
          entity_type: entityType,
          field: fieldName,
          language: targetLanguage,
          original_text: text,
          translated_text: translatedText,
          last_updated: new Date().toISOString()
        });

      if (saveError) {
        console.error('[OPENAI][DB] Errore nel salvataggio della traduzione:', saveError);
      }
    } catch (saveErr) {
      console.error('[OPENAI][DB] Impossibile salvare la traduzione nel database:', saveErr);
    }

    // === INCREMENTO TOKEN === 
    try {
      // 1. Leggo valore tokens_used PRIMA
      const { data: rowBefore, error: errBefore } = await supabase
        .from('translation_tokens')
        .select('month, tokens_used')
        .eq('month', (new Date()).toISOString().slice(0, 7))
        .maybeSingle();

      if (errBefore) {
        console.warn('[OPENAI][DEBUG] Errore lettura tokens_used PRIMA:', errBefore);
      } else {
        console.log(`[OPENAI][DEBUG] [TOKEN] PRIMA:`, rowBefore);
      }

      // 2. INCREMENTO tokens_used +1
      const { data: incData, error: incError } = await supabase.rpc('increment_tokens', { token_count: 1 });
      if (incError) {
        console.error('[OPENAI][TOKEN] Errore incremento token:', incError);
      } else {
        console.log('[OPENAI][TOKEN] Token incrementato di 1');
      }

      // 3. Leggo valore tokens_used DOPO
      const { data: rowAfter, error: errAfter } = await supabase
        .from('translation_tokens')
        .select('month, tokens_used')
        .eq('month', (new Date()).toISOString().slice(0, 7))
        .maybeSingle();

      if (errAfter) {
        console.warn('[OPENAI][DEBUG] Errore lettura tokens_used DOPO:', errAfter);
      } else {
        console.log(`[OPENAI][DEBUG] [TOKEN] DOPO:`, rowAfter);
      }
    } catch (tokErr) {
      console.error('[OPENAI][TOKEN] Errore inatteso update token:', tokErr);
    }
    // === /INCREMENTO TOKEN ===

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('[OPENAI][GLOBAL ERROR] Errore generale:', error);
    return new Response(
      JSON.stringify({ error: `Errore del servizio di traduzione: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
