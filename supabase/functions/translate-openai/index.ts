import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Costanti per l'API OpenAI
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const MODEL = "gpt-4o-mini"; // Utilizziamo un modello efficiente e moderno

// Client Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funzione per mappare i codici lingua al formato desiderato
function mapLanguageCode(code: string): string {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish'
  };
  return languageNames[code] || 'English';
}

serve(async (req) => {
  // Gestione delle richieste OPTIONS per CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Verifica solo la disponibilità dell'API key
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
      console.error('Errore nel controllo dei token:', tokensError);
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

    // Stima dei token utilizzati (approssimativa)
    const estimatedTokens = Math.ceil(text.length / 4);
    
    try {
      // Incremento contatore token
      const { error: incrementError } = await supabase.rpc('increment_tokens', {
        token_count: estimatedTokens
      });

      if (incrementError) {
        console.error('Errore nell\'incremento dei token:', incrementError);
        // Continuiamo comunque con la traduzione anche se c'è un errore nell'incremento
      }
    } catch (counterErr) {
      console.warn('Impossibile incrementare il contatore token:', counterErr);
      // Non blocchiamo la traduzione per errori nel contatore
    }

    // Ottieni il nome completo della lingua di destinazione
    const targetLangName = mapLanguageCode(targetLanguage);
    
    try {
      // NUOVO PROMPT DI SISTEMA AGGIORNATO
      const systemPrompt = `You are a professional translator specializing in restaurant menus and Italian culinary terminology. 
Translate all phrases naturally and idiomatically into ${targetLangName}, following these rules:

- Always translate the text unless the phrase is a traditional Italian dish that is internationally recognized and commonly used in the target language (e.g., "Tiramisù", "Bruschetta", "Risotto", "Spaghetti alla Carbonara").
- General category names (e.g., "Antipasti di Terra", "Primi Piatti", "Contorni") should always be translated into the appropriate equivalent in the target language.
- Maintain the exact capitalization pattern of the original text, even if the entire phrase is written in uppercase.
- Do not treat uppercase text as a reason to preserve the original — it should still be translated unless it falls under the exception above.
- Preserve formatting (punctuation, line breaks, spacing).
- Return only the translated text. Do not include explanations, comments, or metadata.`;
      
      // Prepara il corpo della richiesta per debug
      const requestBody = {
        model: MODEL,
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
      };

      // Log dettagliato della richiesta inviata a OpenAI
      console.log(`[OPENAI-DEBUG] Richiesta a OpenAI API:`, JSON.stringify(requestBody, null, 2));

      // Chiamata all'API di OpenAI con il prompt specializzato
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
        console.error('Errore API OpenAI:', errorData);
        console.error('Codice di stato HTTP:', response.status);
        console.error('Messaggio di stato:', response.statusText);
        return new Response(
          JSON.stringify({ error: `Errore API OpenAI: ${errorData.error?.message || 'Errore sconosciuto'} (Stato ${response.status})` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();

      // Log dettagliato della risposta completa di OpenAI per debug
      console.log(`[OPENAI-DEBUG] Risposta completa di OpenAI:`, JSON.stringify(data, null, 2));

      const translatedText = data.choices[0].message.content.trim();
      
      console.log(`[OPENAI] <== Risultato: "${translatedText}"`);
      console.log(`[OPENAI] Traduzione completata con successo`);

      // Salvataggio della traduzione nel database
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
          console.error('Errore nel salvataggio della traduzione:', saveError);
          // Continuiamo comunque anche se non riusciamo a salvare nel database
        }
      } catch (saveErr) {
        console.warn('Impossibile salvare la traduzione nel database:', saveErr);
        // Non blocchiamo la risposta per errori nel salvataggio
      }

    // SOLO DOPO UNA TRADUZIONE EFFETTUATA, SCALA 1 TOKEN
    try {
      const { error: incError } = await supabase.rpc('increment_tokens', { token_count: 1 });
      if (incError) {
        console.warn('[OPENAI] Warning: impossibile aggiornare i token:', incError);
      }
    } catch (tokErr) {
      console.warn('[OPENAI] Warning: errore inatteso aggiornamento token:', tokErr);
    }

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    } catch (fetchError) {
      console.error('Errore nella chiamata all\'API OpenAI:', fetchError);
      return new Response(
        JSON.stringify({ error: `Errore nella chiamata all'API OpenAI: ${fetchError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error('Errore del servizio di traduzione:', error);
    return new Response(
      JSON.stringify({ error: `Errore del servizio di traduzione: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
