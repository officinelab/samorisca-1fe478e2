
// Supabase Edge Function per la traduzione con DeepL
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface TranslateRequest {
  text: string;
  targetLanguage: string;
  entityId: string;
  entityType: string;
  fieldName: string;
}

const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY') || '';

serve(async (req) => {
  // Gestione preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { text, targetLanguage } = await req.json() as TranslateRequest;
    
    // Log per debug
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
    
    // Mappatura delle lingue da codice a formato DeepL
    const languageMap: Record<string, string> = {
      'en': 'EN-US', // English (American)
      'es': 'ES',    // Spanish
      'fr': 'FR',    // French
      'de': 'DE'     // German
    };
    
    const targetLang = languageMap[targetLanguage] || languageMap['en'];
    
    // Chiamata all'API DeepL
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
