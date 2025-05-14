// Supabase Edge Function per la traduzione con Perplexity
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

// Client Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY') || '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { text, targetLanguage } = await req.json() as TranslateRequest;

    // Log per debug
    console.log(`[PERPLEXITY] ==> Traduzione di: "${text}" in ${targetLanguage}`);
    
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
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German'
    };
    const targetLanguageName = languageMap[targetLanguage] || languageMap['en'];

    const systemPrompt = `You are a professional translator specializing in restaurant menus and Italian culinary terminology. 
Translate all phrases naturally and idiomatically into ${targetLanguageName}, following these rules:

- Only preserve traditional Italian dish names that are internationally recognized and commonly used in the target language (e.g., "Tiramisù", "Bruschetta", "Risotto", "Spaghetti alla Carbonara").
- General category names (e.g., "Antipasti di Terra", "Primi Piatti", "Contorni") should always be translated into the appropriate equivalent in the target language.
- Maintain the same capitalization pattern as the original text.
- Preserve formatting (punctuation, line breaks, spacing).
- Do not include any explanation, comments, or extra text — return only the translated text.`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
        frequency_penalty: 0
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`[PERPLEXITY] Errore API: ${response.status} ${errorData}`);
      return new Response(
        JSON.stringify({ 
          error: `Perplexity API error: ${response.status}`, 
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
    
    if (data.choices && data.choices.length > 0) {
      const translatedText = data.choices[0].message.content.trim();
      console.log(`[PERPLEXITY] <== Risultato: "${translatedText}"`);
      console.log("[PERPLEXITY] Traduzione completata con successo");

      // SCALA 1 TOKEN SOLO SE LA TRADUZIONE È ANDATA A BUON FINE
      try {
        const { error: incError } = await supabase.rpc('increment_tokens', { token_count: 1 });
        if (incError) {
          console.warn('[PERPLEXITY] Warning: impossibile aggiornare i token:', incError);
        } else {
          console.log('[PERPLEXITY] 1 token scalato con successo.');
        }
      } catch (tokErr) {
        console.warn('[PERPLEXITY] Warning: errore inatteso aggiornamento token:', tokErr);
      }
      
      return new Response(
        JSON.stringify({ 
          translatedText, 
          service: 'perplexity' 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    } else {
      console.error("[PERPLEXITY] Nessuna risposta valida dall'API");
      return new Response(
        JSON.stringify({ 
          error: "Nessuna risposta valida dall'API Perplexity" 
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
    console.error(`[PERPLEXITY] Errore: ${error.message}`);
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
