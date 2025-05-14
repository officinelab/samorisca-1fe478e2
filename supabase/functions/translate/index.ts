// Supabase Edge Function per la traduzione con Perplexity
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface TranslateRequest {
  text: string;
  targetLanguage: string;
  entityId: string;
  entityType: string;
  fieldName: string;
}

const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY') || '';

serve(async (req) => {
  // Gestione delle richieste OPTIONS per CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();

    // Verifica solo la disponibilità dell'API key (no token decrement)
    if (requestData.checkApiKeyOnly === true) {
      if (!PERPLEXITY_API_KEY) {
        return new Response(
          JSON.stringify({ 
            error: "Perplexity API key not found" 
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
      return new Response(
        JSON.stringify({ 
          success: true 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const { text, targetLanguage } = requestData as TranslateRequest;
    
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
    
    // Mappatura delle lingue per le istruzioni di Perplexity
    const languageMap: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German'
    };
    
    const targetLanguageName = languageMap[targetLanguage] || languageMap['en'];
    
    // Istruzione aggiornata per Perplexity, allineata con quella di OpenAI
    const systemPrompt = `You are a professional translator specializing in restaurant menus and Italian culinary terminology. 
Translate all phrases naturally and idiomatically into ${targetLanguageName}, following these rules:

- Only preserve traditional Italian dish names that are internationally recognized and commonly used in the target language (e.g., "Tiramisù", "Bruschetta", "Risotto", "Spaghetti alla Carbonara").
- General category names (e.g., "Antipasti di Terra", "Primi Piatti", "Contorni") should always be translated into the appropriate equivalent in the target language.
- Maintain the same capitalization pattern as the original text.
- Preserve formatting (punctuation, line breaks, spacing).
- Do not include any explanation, comments, or extra text — return only the translated text.`;
    
    // 1. Calcola i token rimanenti
    const { data: tokensData, error: tokensError } = await supabase.rpc('get_remaining_tokens');

    if (tokensError) {
      console.error('[PERPLEXITY] Errore nel controllo dei token:', tokensError);
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

    // 2. Scala SEMPRE 1 token per ogni traduzione (decrementa!)
    const { data: incResult, error: incrementError } = await supabase.rpc('increment_tokens', { token_count: -1 });
    console.log('[PERPLEXITY] Risultato decremento token:', incResult, 'Errore:', incrementError);

    if (incrementError || incResult === false) {
      console.error('[PERPLEXITY] Errore nel decremento del contatore token o limite superato:', incrementError);
      return new Response(
        JSON.stringify({ error: "Impossibile scalare il token oppure limite mensile raggiunto." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Chiamata all'API Perplexity
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
