
// Supabase Edge Function per la traduzione con DeepL
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface TranslateRequest {
  text: string;
  targetLanguage: string;
  entityId: string;
  entityType: string;
  fieldName: string;
}

// Client Supabase con service role per le operazioni sui token
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY') || '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { text, targetLanguage } = await req.json() as TranslateRequest;
    
    console.log(`[DEEPL] ==> Traduzione di: "${text}" in ${targetLanguage}`);
    
    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ 
          error: "Text and targetLanguage are required" 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    // --- Check token availability prima di traduzione
    console.log('[DEEPL][TOKEN] Verifico token disponibili prima della traduzione...');
    const { data: tokensDataBefore, error: tokensErrorBefore } = await supabase
      .rpc('get_remaining_tokens');
    
    console.log('[DEEPL][TOKEN] Risposta get_remaining_tokens PRIMA:', { 
      tokensDataBefore, 
      tokensErrorBefore,
      supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
      serviceKey: supabaseServiceKey ? 'SET' : 'NOT SET'
    });
    
    if (tokensErrorBefore) {
      console.error('[DEEPL][TOKEN] Errore nel controllo dei token PRIMA:', tokensErrorBefore);
      return new Response(
        JSON.stringify({ error: "Errore nel controllo dei token disponibili" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (tokensDataBefore <= 0) {
      console.log('[DEEPL][TOKEN] Token esauriti, esco subito');
      return new Response(
        JSON.stringify({ error: "Token mensili esauriti" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[DEEPL][TOKEN] Token disponibili PRIMA della traduzione: ${tokensDataBefore}`);
    
    const languageMap: Record<string, string> = {
      'en': 'EN-US',
      'es': 'ES',
      'fr': 'FR',
      'de': 'DE'
    };
    const targetLang = languageMap[targetLanguage] || languageMap['en'];
    
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        formality: 'default'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[DEEPL] Errore API: ${response.status} ${errorData}`);
      return new Response(
        JSON.stringify({ 
          error: `DeepL API error: ${response.status}`, 
          details: errorData 
        }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
    const data = await response.json();
    
    if (data.translations && data.translations.length > 0) {
      const translatedText = data.translations[0].text;
      console.log(`[DEEPL] <== Risultato: "${translatedText}"`);
      console.log("[DEEPL] Traduzione completata con successo");

      // === VERIFICA STATO TOKENS PRIMA DI INCREMENTARE ===
      console.log('[DEEPL][TOKEN] Verifico lo stato dei token nella tabella PRIMA di incrementare...');
      const { data: tableStateBefore, error: tableStateErrorBefore } = await supabase
        .from('translation_tokens')
        .select('*')
        .eq('month', (await supabase.rpc('get_current_month')).data);
      
      console.log('[DEEPL][TOKEN] Stato tabella PRIMA:', { tableStateBefore, tableStateErrorBefore });

      // === INCREMENTO TOKEN CON CONTROLLO DETTAGLIATO ===
      try {
        console.log('[DEEPL][TOKEN] Chiamando increment_tokens con 1 token...');
        
        const { data: incrementResult, error: incrementError } = await supabase
          .rpc('increment_tokens', { token_count: 1 });
        
        console.log('[DEEPL][TOKEN] Risultato increment_tokens:', { 
          incrementResult, 
          incrementError,
          type: typeof incrementResult,
          value: incrementResult
        });
        
        if (incrementError) {
          console.error('[DEEPL][TOKEN] Errore incremento token:', incrementError);
          console.error('[DEEPL][TOKEN] Dettagli errore:', JSON.stringify(incrementError));
          console.error('[DEEPL][TOKEN] Codice errore:', incrementError.code);
          console.error('[DEEPL][TOKEN] Messaggio errore:', incrementError.message);
        } else {
          console.log('[DEEPL][TOKEN] ✅ increment_tokens completato senza errori');
          console.log(`[DEEPL][TOKEN] Risultato ricevuto: ${incrementResult} (tipo: ${typeof incrementResult})`);
          
          if (incrementResult === false) {
            console.error('[DEEPL][TOKEN] ⚠️ Token insufficienti (ritornato false)');
          } else if (incrementResult === true) {
            console.log('[DEEPL][TOKEN] ✅ Token consumato correttamente');
          } else {
            console.log(`[DEEPL][TOKEN] ⚠️ Risultato inaspettato: ${incrementResult}`);
          }
        }
      } catch (tokErr) {
        console.error('[DEEPL][TOKEN] Errore nella chiamata increment_tokens:', tokErr);
        console.error('[DEEPL][TOKEN] Stack trace:', tokErr.stack);
      }

      // === VERIFICA STATO TOKENS DOPO INCREMENTO ===
      console.log('[DEEPL][TOKEN] Verifico lo stato dei token nella tabella DOPO incremento...');
      const { data: tableStateAfter, error: tableStateErrorAfter } = await supabase
        .from('translation_tokens')
        .select('*')
        .eq('month', (await supabase.rpc('get_current_month')).data);
      
      console.log('[DEEPL][TOKEN] Stato tabella DOPO:', { tableStateAfter, tableStateErrorAfter });

      // === VERIFICA TOKEN RIMANENTI DOPO ===
      console.log('[DEEPL][TOKEN] Verifico token rimanenti DOPO...');
      const { data: tokensDataAfter, error: tokensErrorAfter } = await supabase
        .rpc('get_remaining_tokens');
      
      console.log('[DEEPL][TOKEN] Token rimanenti DOPO:', { tokensDataAfter, tokensErrorAfter });
      // === /INCREMENTO TOKEN ===

      return new Response(
        JSON.stringify({ 
          translatedText, 
          service: 'deepl' 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else {
      console.error("[DEEPL] Nessuna traduzione restituita dall'API");
      return new Response(
        JSON.stringify({ 
          error: "Nessuna traduzione restituita dall'API DeepL" 
        }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }
    
  } catch (error) {
    console.error(`[DEEPL] Errore: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
