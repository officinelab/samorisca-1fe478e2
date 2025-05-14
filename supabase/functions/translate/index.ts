
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { text, targetLanguage } = await req.json() as TranslateRequest;
    console.log(`[PERPLEXITY] ==> Traduzione di: "${text}" in ${targetLanguage}`);
    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Text and targetLanguage are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const languageMap: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German'
    };
    if (!languageMap[targetLanguage]) {
      return new Response(
        JSON.stringify({ error: `Lingua target non supportata: ${targetLanguage}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const targetLanguageName = languageMap[targetLanguage];

    // LISTA chiusa di piatti famosi da NON tradurre MAI
    const famousDishes = `"Tiramisù", "Bruschetta", "Risotto", "Spaghetti alla Carbonara"`;

    // PROMPT molto restrittivo e chiaro, versione imperativa
    const systemPrompt = `
You are a professional translator specializing in restaurant menus and Italian culinary terminology.
Translate all phrases naturally and idiomatically into ${targetLanguageName}, following STRICTLY these rules:

1. ONLY preserve a name if it matches EXACTLY one of these internationally famous Italian dishes: ${famousDishes}.
2. For ANY other dish or menu item, ALWAYS translate it fully into ${targetLanguageName}. Do NOT preserve the Italian wording for any name not in the list above.
3. Always translate category names and descriptions (e.g., "Antipasti di Terra", "Primi Piatti", "Contorni", etc).
4. Do NOT use the Italian text unless it's exactly one in the famous list.
5. Maintain the same capitalization and formatting (punctuation, line breaks, spacing).
6. Return only the translated text, with no explanation or extra comments.
`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
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
        JSON.stringify({ error: `Perplexity API error: ${response.status}`, details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      const translatedText = data.choices[0].message.content.trim();
      console.log(`[PERPLEXITY] <== Risultato: "${translatedText}"`);
      console.log("[PERPLEXITY] Traduzione completata con successo");
      return new Response(
        JSON.stringify({ translatedText, service: 'perplexity' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error("[PERPLEXITY] Nessuna risposta valida dall'API");
      return new Response(
        JSON.stringify({ error: "Nessuna risposta valida dall'API Perplexity" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error(`[PERPLEXITY] Errore: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
