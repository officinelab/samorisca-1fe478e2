
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

serve(async (req) => {
  // Gestisce le richieste CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'POST') {
      // Log per debugging
      console.log("Ricevuta richiesta di traduzione");
      
      let requestData;
      try {
        requestData = await req.json() as TranslationRequest;
        console.log("Dati richiesta:", JSON.stringify(requestData));
      } catch (e) {
        console.error("Errore nel parsing del JSON:", e);
        return new Response(
          JSON.stringify({ error: 'Errore nel parsing del JSON della richiesta' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { text, targetLanguage, sourceLanguage = 'Italian' } = requestData;
      
      if (!text) {
        return new Response(
          JSON.stringify({ error: 'Il testo da tradurre è obbligatorio' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verifica che la API key sia presente
      if (!perplexityApiKey) {
        console.error("API key di Perplexity non configurata");
        return new Response(
          JSON.stringify({ error: 'Configurazione del servizio di traduzione mancante' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Calcolo approssimativo dei token (circa 4 caratteri per token)
      const estimatedTokens = Math.ceil(text.length / 4);
      
      // Crea una connessione al client Supabase
      const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error("Configurazione Supabase mancante");
        return new Response(
          JSON.stringify({ error: 'Configurazione Supabase mancante' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      
      // Verifica se ci sono token sufficienti
      const { data: remainingTokens, error: tokensError } = await supabaseClient
        .rpc('get_remaining_tokens');
      
      if (tokensError) {
        console.error('Errore nel controllo dei token rimanenti:', tokensError);
        return new Response(
          JSON.stringify({ error: 'Errore nel controllo dei token rimanenti' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (remainingTokens < estimatedTokens) {
        return new Response(
          JSON.stringify({ 
            error: 'Limite mensile di token raggiunto',
            remainingTokens,
            requiredTokens: estimatedTokens
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Mappa dei codici lingua
      const languageCodes = {
        'English': 'en',
        'French': 'fr',
        'Spanish': 'es',
        'German': 'de',
        'Italian': 'it'
      };
      
      // Mappa inversa per i nomi completi delle lingue
      const languageNames = {
        'en': 'English',
        'fr': 'French',
        'es': 'Spanish',
        'de': 'German',
        'it': 'Italian'
      };
      
      // Ottieni il nome completo della lingua target
      const targetLangName = targetLanguage in languageCodes 
        ? targetLanguage 
        : languageNames[targetLanguage as keyof typeof languageNames] || targetLanguage;

      // Crea il prompt per la traduzione
      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLangName}. Only return the translated text without any additional notes or explanations. Here is the text to translate: "${text}"`;

      console.log(`Traduzione da ${sourceLanguage} a ${targetLangName}`);
      console.log(`Testo da tradurre: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);

      try {
        // Chiama l'API di Perplexity
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are a professional translator. Translate the text accurately, maintaining the meaning, tone, and style of the original text. Only return the translated text without any additional notes or explanations.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.2,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Errore API Perplexity. Status:', response.status, 'Risposta:', errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { error: errorText };
          }
          
          return new Response(
            JSON.stringify({ 
              error: 'Errore nell\'elaborazione della traduzione', 
              details: errorData 
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        console.log("Risposta API ricevuta con successo");
        
        const translatedText = data.choices[0].message.content.trim();
        console.log(`Traduzione completata: "${translatedText.substring(0, 50)}${translatedText.length > 50 ? '...' : ''}"`);

        // Incrementa il conteggio dei token
        const { data: incrementResult, error: incrementError } = await supabaseClient
          .rpc('increment_tokens', { token_count: estimatedTokens });
          
        if (incrementError) {
          console.error('Errore nell\'incremento dei token:', incrementError);
        }

        return new Response(
          JSON.stringify({ 
            translatedText, 
            tokensUsed: estimatedTokens,
            remainingTokens: remainingTokens - estimatedTokens
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Errore nella chiamata API:', error);
        return new Response(
          JSON.stringify({ error: 'Errore nella chiamata al servizio di traduzione' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Metodo non supportato' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Errore nella funzione translate:', error);
    return new Response(
      JSON.stringify({ error: 'Si è verificato un errore durante l\'elaborazione della richiesta' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Funzione helper per creare il client Supabase
function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    rpc: (functionName: string, params = {}) => {
      return fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(params)
      }).then(async (response) => {
        const data = await response.json();
        return {
          data: response.ok ? data : null,
          error: response.ok ? null : data
        };
      });
    }
  };
}
