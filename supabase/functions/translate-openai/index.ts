
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

    // Calcolo token rimanenti
    const { data: tokensData, error: tokensError } = await supabase.rpc('get_remaining_tokens');
    if (tokensError) {
      logDetailedError('Errore nel controllo dei token', tokensError);
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

    // Uso modularizzazione per nome lingua e prompt
    const targetLangName = mapLanguageCode(targetLanguage);
    const systemPrompt = getSystemPrompt(targetLangName);

    try {
      const requestBody = {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
      };

      console.log(`[OPENAI-DEBUG] Richiesta a OpenAI API:`, JSON.stringify(requestBody, null, 2));

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
        logDetailedError('Errore API OpenAI', errorData);
        console.error('Codice di stato HTTP:', response.status);
        console.error('Messaggio di stato:', response.statusText);
        return new Response(
          JSON.stringify({ error: `Errore API OpenAI: ${errorData.error?.message || 'Errore sconosciuto'} (Stato ${response.status})` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log(`[OPENAI-DEBUG] Risposta completa di OpenAI:`, JSON.stringify(data, null, 2));

      const translatedText = data.choices[0].message.content.trim();
      console.log(`[OPENAI] <== Risultato: "${translatedText}"`);
      console.log(`[OPENAI] Traduzione completata con successo`);

      // Salvataggio della traduzione
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
          logDetailedError('Errore nel salvataggio della traduzione', saveError);
        }
      } catch (saveErr) {
        logDetailedError('Impossibile salvare la traduzione nel database', saveErr);
      }

      // ==== INCREMENTO TOKEN CON DEBUG ====
      try {
        // 1. Recupero il valore attuale tokens_used per debugging
        const { data: tokensRow, error: selError } = await supabase
          .from('translation_tokens')
          .select('*')
          .eq('month', (new Date()).toISOString().slice(0, 7)) // formato YYYY-MM
          .single();

        if (selError) {
          console.warn('[OPENAI][DEBUG] Errore nel recupero tokens_used:', selError);
        } else {
          console.log(`[OPENAI][DEBUG] Valore attuale tokens_used PRIMA:`, tokensRow?.tokens_used);
        }

        const { data: incData, error: incError } = await supabase.rpc('increment_tokens', { token_count: 1 });
        if (incError) {
          console.warn('[OPENAI] Errore aggiornamento token:', incError);
        } else {
          console.log('[OPENAI] 1 token scalato con successo.');
        }

        // 2. Recupero il valore attuale tokens_used DOPO
        const { data: tokensRowAfter, error: selAfterError } = await supabase
          .from('translation_tokens')
          .select('*')
          .eq('month', (new Date()).toISOString().slice(0, 7))
          .single();

        if (selAfterError) {
          console.warn('[OPENAI][DEBUG] Errore nel recupero tokens_used DOPO:', selAfterError);
        } else {
          console.log(`[OPENAI][DEBUG] Valore tokens_used DOPO:`, tokensRowAfter?.tokens_used);
        }
      } catch (tokErr) {
        console.warn('[OPENAI][DEBUG] Errore inatteso aggiornamento token:', tokErr);
      }
      // ==== /INCREMENTO TOKEN ====

      return new Response(
        JSON.stringify({ translatedText }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (fetchError) {
      logDetailedError('Errore nella chiamata all\'API OpenAI', fetchError);
      return new Response(
        JSON.stringify({ error: `Errore nella chiamata all\'API OpenAI: ${fetchError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    logDetailedError('Errore del servizio di traduzione', error);
    return new Response(
      JSON.stringify({ error: `Errore del servizio di traduzione: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
