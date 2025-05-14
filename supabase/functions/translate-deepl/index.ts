
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

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

      // === AGGIORNAMENTO TOKEN CON LOG ===
      try {
        const month = (new Date()).toISOString().slice(0, 7);
        const { data: beforeRow, error: beforeError } = await supabase
          .from('translation_tokens')
          .select('month,tokens_used')
          .eq('month', month)
          .maybeSingle();
        console.log('[DEEPL][DEBUG][TOKEN][PRIMA]', beforeRow, beforeError);

        // Incr. tokens_used di 1
        const { error: upError } = await supabase
          .from('translation_tokens')
          .update({
            tokens_used: (beforeRow?.tokens_used || 0) + 1,
            last_updated: new Date().toISOString()
          })
          .eq('month', month);
        if (upError) {
          console.error('[DEEPL][TOKEN] Errore update token:', upError);
        } else {
          console.log('[DEEPL][TOKEN] Token incrementato di 1 via update diretto');
        }

        const { data: afterRow, error: afterError } = await supabase
          .from('translation_tokens')
          .select('month,tokens_used')
          .eq('month', month)
          .maybeSingle();
        console.log('[DEEPL][DEBUG][TOKEN][DOPO]', afterRow, afterError);
      } catch (tokErr) {
        console.error('[DEEPL][TOKEN] Errore inatteso update token:', tokErr);
      }
      // === /AGGIORNAMENTO TOKEN ===

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
