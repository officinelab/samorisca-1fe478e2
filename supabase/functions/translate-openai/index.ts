
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Costanti per l'API OpenAI
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const MODEL = "gpt-4o-mini"; // Utilizziamo un modello efficiente e moderno

// Configurazione CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Client Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funzione per mappare i codici lingua al formato desiderato
function mapLanguageCode(code: string): string {
  const langMap: Record<string, string> = {
    'en': 'English',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish'
  };
  return langMap[code] || 'English';
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
    
    // Incremento contatore token
    const { data: incrementResult, error: incrementError } = await supabase.rpc('increment_tokens', {
      token_count: estimatedTokens
    });

    if (incrementError) {
      console.error('Errore nell\'incremento dei token:', incrementError);
      return new Response(
        JSON.stringify({ error: "Errore nell'aggiornamento del conteggio token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Chiamata all'API di OpenAI
    const targetLangName = mapLanguageCode(targetLanguage);
    const prompt = `Traduci il seguente testo in ${targetLangName}. Mantieni il formato e il tono originali. Restituisci SOLO il testo tradotto, senza commenti o spiegazioni aggiuntive.\n\nTesto: "${text}"`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'Sei un traduttore professionale. Traduci con precisione mantenendo il significato originale.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Errore API OpenAI:', errorData);
      return new Response(
        JSON.stringify({ error: `Errore API OpenAI: ${errorData.error?.message || 'Errore sconosciuto'}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();
    
    console.log(`[OPENAI] <== Risultato: "${translatedText}"`);
    console.log(`[OPENAI] Traduzione completata con successo`);

    // Salvataggio della traduzione nel database
    const { error: saveError } = await supabase
      .from('translations')
      .upsert({
        entity_id: entityId,
        entity_type: entityType,
        field: fieldName,
        language: targetLanguage,
        original_text: text,
        translated_text: translatedText,
        updated_at: new Date().toISOString()
      });

    if (saveError) {
      console.error('Errore nel salvataggio della traduzione:', saveError);
    }

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Errore del servizio di traduzione:', error);
    return new Response(
      JSON.stringify({ error: `Errore del servizio di traduzione: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
