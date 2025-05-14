
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.16.0'

// Costanti per CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Ottieni chiave API Perplexity
const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY')
if (!PERPLEXITY_API_KEY) {
  console.error('PERPLEXITY API KEY non configurata')
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

    console.log(`[PERPLEXITY] ==> Traduzione di: "${text}" in ${targetLanguage}`)

    // Costruisci il prompt per la traduzione
    const prompt = `Translate the following text from Italian to ${getLanguageName(targetLanguage)}. 
Only return the translated text, without any explanation or additional text.
Text to translate: "${text}"`

    // Chiamata a Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in translations from Italian to ${getLanguageName(targetLanguage)}. 
            Your translations are accurate and sound natural. Only respond with the translated text, no explanations or additional content.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Perplexity API error:', errorData);
      throw new Error(`Perplexity API error: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim();

    if (!translatedText) {
      throw new Error('Nessun testo tradotto ricevuto da Perplexity');
    }

    console.log(`[PERPLEXITY] <== Risultato: "${translatedText}"`)
    console.log("[PERPLEXITY] Traduzione completata con successo")

    // Incrementa il conteggio dei token (somma di input + output token)
    const inputTokenCount = data.usage?.prompt_tokens || Math.ceil(text.length / 4);
    const outputTokenCount = data.usage?.completion_tokens || Math.ceil(translatedText.length / 4);
    const totalTokens = inputTokenCount + outputTokenCount;
    
    // Crea un client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Incrementa il contatore dei token
    try {
      await supabase.rpc('increment_tokens', { token_count: totalTokens });
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

// Helper function to get full language name from code
function getLanguageName(code: string): string {
  const languages = {
    'en': 'English',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish'
  };
  return languages[code] || 'English';
}
