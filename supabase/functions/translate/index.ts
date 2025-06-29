
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
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    const systemPrompt = `You are a professional translator for restaurant menus and Italian culinary terms.
Your job is to translate ONLY the original text into ${targetLanguageName}. 
Return ONLY the translation, without explanations, comments, reformulations, or meta-information of any kind.
NEVER add clarification, reformulate, explain, or introduce the translation with words like "translates to", "which means", "this is", "typically includes", etc.
NEVER return anything except the translated text itself.
Keep structure, formatting, capitalization and line breaks of the original.
If the phrase is a traditional and internationally recognized Italian food name, keep it in Italian. Category names must always be translated.
Do NOT add bullet points, asterisks, or extra formatting to the output.
Return only the translated result as if it would go inside a printed menu, with NO additional text.`;

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
        temperature: 0.09,
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
    if (!data.choices || !data.choices[0]?.message?.content) {
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
    const translatedText = data.choices[0].message.content.trim();

    // Log traduzione lato server
    console.log(`[PERPLEXITY] <== Tradotto come: "${translatedText}"`);
    console.log("[PERPLEXITY] Traduzione completata con successo");

    // === AGGIORNAMENTO TOKEN CON LOGGING DETTAGLIATO ===
    try {
      console.log('[PERPLEXITY][TOKEN] Chiamando increment_tokens con 1 token...');
      
      // Controlla lo stato prima dell'incremento
      const { data: beforeState } = await supabase
        .from('translation_tokens')
        .select('*')
        .eq('month', '2025-05')
        .single();
      console.log('[PERPLEXITY][TOKEN] Stato prima incremento:', beforeState);
      
      const { data: incrementResult, error: incrementError } = await supabase
        .rpc('increment_tokens', { token_count: 1 });
      
      console.log('[PERPLEXITY][TOKEN] Risultato increment_tokens:', {
        incrementResult,
        incrementError
      });
      
      // Controlla lo stato dopo l'incremento
      const { data: afterState } = await supabase
        .from('translation_tokens')
        .select('*')
        .eq('month', '2025-05')
        .single();
      console.log('[PERPLEXITY][TOKEN] Stato dopo incremento:', afterState);
      
      if (incrementError) {
        console.error('[PERPLEXITY][TOKEN] Errore incremento token:', incrementError);
        console.error('[PERPLEXITY][TOKEN] Dettagli errore:', JSON.stringify(incrementError));
      } else {
        console.log('[PERPLEXITY][TOKEN] Token incrementato con successo. Risultato:', incrementResult);
      }
    } catch (tokErr) {
      console.error('[PERPLEXITY][TOKEN] Errore inatteso incremento token:', tokErr);
    }
    // === /AGGIORNAMENTO TOKEN ===
    
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
