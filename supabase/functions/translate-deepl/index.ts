
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.16.0'

// Costanti per CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Ottieni chiave API DeepL
const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY')
if (!DEEPL_API_KEY) {
  console.error('DeepL API KEY non configurata')
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, targetLanguage, entityId, entityType, fieldName } = await req.json()
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Testo mancante' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Mapping delle lingue supportate per DeepL
    const languageMap = {
      en: 'EN',  // Inglese
      fr: 'FR',  // Francese
      de: 'DE',  // Tedesco
      es: 'ES',  // Spagnolo
    };
    
    const deepLLanguage = languageMap[targetLanguage];
    if (!deepLLanguage) {
      return new Response(
        JSON.stringify({ error: `Lingua non supportata: ${targetLanguage}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[DEEPL] ==> Traduzione di: "${text}" in ${targetLanguage}`)

    // Chiamata a DeepL API
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: deepLLanguage,
        formality: 'default',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('DeepL API error:', errorData);
      throw new Error(`DeepL API error: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const translatedText = data.translations?.[0]?.text;

    if (!translatedText) {
      throw new Error('Nessun testo tradotto ricevuto da DeepL');
    }

    console.log(`[DEEPL] <== Risultato: "${translatedText}"`)
    console.log("[DEEPL] Traduzione completata con successo")

    // Incrementa il conteggio dei token (semplice stima: numero di caratteri / 4)
    const tokenCount = Math.ceil(text.length / 4);
    
    // Crea un client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Incrementa il contatore dei token
    try {
      await supabase.rpc('increment_tokens', { token_count: tokenCount });
    } catch (error) {
      console.error('Error incrementing token count:', error);
    }

    // Restituisci la traduzione
    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
