
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY') || '';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  text: string;
  targetLanguage: 'en' | 'fr' | 'de' | 'es';
  entityId: string;
  entityType: string;
  fieldName: string;
}

const languageNames = {
  en: 'English',
  fr: 'French',
  de: 'German',
  es: 'Spanish'
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if environment variables are set
    if (!supabaseUrl || !supabaseServiceKey || !perplexityApiKey) {
      console.error('Missing environment variables:', {
        hasSupabaseUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        hasPerplexityKey: !!perplexityApiKey
      });
      throw new Error('Configuration error: Missing required environment variables');
    }

    // Parse request body
    const { text, targetLanguage, entityId, entityType, fieldName } = await req.json() as TranslationRequest;
    
    // Validation
    if (!text || !targetLanguage || !entityId || !entityType || !fieldName) {
      throw new Error('Missing required parameters');
    }

    if (!['en', 'fr', 'de', 'es'].includes(targetLanguage)) {
      throw new Error('Invalid target language');
    }

    // Check token usage
    const { data: remainingTokens, error: tokenError } = await supabase.rpc('get_remaining_tokens');
    
    if (tokenError) {
      console.error('Error checking remaining tokens:', tokenError);
      throw new Error('Failed to check token usage: ' + tokenError.message);
    }

    if (remainingTokens <= 0) {
      throw new Error('Monthly token quota exhausted');
    }

    // Prepare context-specific system prompt - con istruzioni più precise
    let systemPrompt = `You are a professional culinary translator specialized in Italian restaurant menu translation. You are translating from Italian to ${languageNames[targetLanguage]}.

Your task is to translate ALL menu text, including section headers like "Antipasti", "Primi Piatti", "Secondi Piatti", "Contorni", and "Dolci" into ${languageNames[targetLanguage]}.

Translation rules:
- Translate EVERY word, including menu category names
- For "Primi Piatti" in English, use "First Courses"
- For "Secondi Piatti" in English, use "Main Courses" or "Second Courses"
- For "Antipasti" in English, use "Appetizers" or "Starters"
- For "Contorni" in English, use "Side Dishes"
- For "Dolci" in English, use "Desserts"
- Do not add asterisks, quotes, or any other formatting
- Do not add explanations, notes, or commentary
- Keep the same capitalization pattern as the original text`;

    // Prepare context-specific user prompt - con istruzioni più precise
    const prompt = `Translate the following Italian text into ${languageNames[targetLanguage]}:

"${text}"

Important rules:
1. Return ONLY the direct translation without any additional text, formatting, or explanation
2. Do NOT keep any Italian words in your response except for proper dish names
3. Do NOT add quotes, asterisks or any other formatting to your response
4. Translate ALL menu categories (like "Antipasti", "Primi Piatti", "Secondi Piatti") to their ${languageNames[targetLanguage]} equivalents
5. Maintain the exact same capitalization pattern as the original text`;

    console.log(`Translating text to ${targetLanguage}. Text length: ${text.length}`);

    // Call Perplexity API
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Perplexity API error:', errorData);
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();

    // Rimuoviamo eventuali virgolette o formattazioni dalla risposta
    const cleanTranslation = translatedText
      .replace(/^["']|["']$/g, '') // rimuove virgolette iniziali e finali
      .replace(/\*\*/g, ''); // rimuove asterischi doppi

    console.log('Translation completed successfully');

    // Record token usage
    const { data: tokensIncremented, error: incrementError } = await supabase.rpc('increment_tokens', {
      token_count: 1
    });
    
    if (incrementError) {
      console.error('Error incrementing token count:', incrementError);
      // Continue execution even if token counting fails
    }

    // Return the translation
    return new Response(
      JSON.stringify({
        translatedText: cleanTranslation,
        success: true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('Error in translate function:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
