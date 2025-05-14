
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
  // Gestione preflight CORS
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

- Always translate generic or descriptive dishes composed of ingredients (e.g., "Gamberi crudi", "Carciofi fritti", "Tagliata di manzo").
- Category names (e.g., "Antipasti di Terra", "Primi Piatti", "Contorni") must always be translated.
- Product names (e.g., "Gamberi crudi", "Carciofi fritti", "Tagliata di manzo", "COZZE DI SARDEGNA ALL’OLBIESE") must always be translated.
- Do not preserve a name simply because it is capitalized or written in all uppercase — uppercase text should still be translated unless it is a universally known Italian dish.
- Maintain the same capitalization and formatting (e.g., punctuation, line breaks, spacing) as in the original text.
- Return only the translated text, without any explanation or extra comments.`;
    
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
