
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

    // Prepare prompt for Perplexity
    const prompt = `Translate the following Italian text into ${languageNames[targetLanguage]}. Maintain any special formatting or terms. Only respond with the translation, nothing else. No explanations, no original text.

Text to translate: "${text}"`;

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
            content: `You are a professional translator specializing in translating Italian to ${languageNames[targetLanguage]}. Provide only the translation without any additional text or explanations.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
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
        translatedText,
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
