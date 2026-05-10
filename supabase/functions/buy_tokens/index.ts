import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
const paypalSecretKey = Deno.env.get('PAYPAL_SECRET_KEY');
// Default to PayPal LIVE API. Override with PAYPAL_API_BASE=https://api-m.sandbox.paypal.com for testing.
const paypalApiBase = Deno.env.get('PAYPAL_API_BASE') ?? 'https://api-m.paypal.com';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Funzione helper per ottenere il limite mensile dalle impostazioni
const getMonthlyTokensLimit = async (): Promise<number> => {
  try {
    const { data: settingsData, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'monthlyTokensLimit')
      .maybeSingle();

    if (error || !settingsData?.value) {
      console.log('Limite mensile non trovato, usando default 300');
      return 300;
    }

    const limit = parseInt(settingsData.value.toString()) || 300;
    console.log(`Limite mensile recuperato dalle impostazioni: ${limit}`);
    return limit;
  } catch (error) {
    console.error('Errore nel recupero del limite mensile:', error);
    return 300;
  }
};

// Recupera la configurazione del pacchetto token (prezzo + numero token) lato server.
// Nessun valore viene mai accettato dal client: l'autorevolezza è solo del DB.
const getTokenPackageConfig = async (): Promise<{ price: number; amount: number } | null> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key,value')
    .in('key', ['tokenPackagePrice', 'tokenPackageAmount']);

  if (error || !data) {
    console.error('Errore nel recupero della configurazione del pacchetto token:', error);
    return null;
  }

  const map = new Map(data.map((r: any) => [r.key, r.value]));
  const price = parseFloat(String(map.get('tokenPackagePrice') ?? '').replace(',', '.'));
  const amount = parseInt(String(map.get('tokenPackageAmount') ?? ''), 10);

  if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(amount) || amount <= 0) {
    console.error('Configurazione pacchetto token non valida:', { price, amount });
    return null;
  }
  return { price, amount };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const orderId = typeof body?.orderId === 'string' ? body.orderId.trim() : '';

    console.log(`Processing token purchase - OrderID: ${orderId}`);

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "OrderID è richiesto" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Carica la configurazione autoritativa del pacchetto token lato server.
    const pkg = await getTokenPackageConfig();
    if (!pkg) {
      return new Response(
        JSON.stringify({ error: "Configurazione pacchetto token non disponibile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verifica pagamento PayPal
    const paypalAccessToken = await getPayPalAccessToken();
    const paymentDetails = await verifyPayPalPayment(orderId, paypalAccessToken);
    
    if (!paymentDetails.verified) {
      return new Response(
        JSON.stringify({ error: "Pagamento non verificato" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Confronta l'importo PayPal verificato con il prezzo configurato (tolleranza 1 cent).
    const paidAmount = parseFloat(String(paymentDetails.amount ?? ''));
    if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - pkg.price) > 0.01) {
      console.error('Importo PayPal non corrispondente al pacchetto', {
        paid: paymentDetails.amount,
        expected: pkg.price,
        currency: paymentDetails.currency,
        orderId,
      });
      return new Response(
        JSON.stringify({ error: "Importo del pagamento non valido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Quantità di token da accreditare: SOLO dal DB, mai dal client.
    const tokens = pkg.amount;

    // Ottieni il limite mensile corrente
    const monthlyLimit = await getMonthlyTokensLimit();

    // Ottieni il mese corrente
    const { data: currentMonth, error: monthError } = await supabase
      .rpc('get_current_month');
    
    if (monthError) {
      console.error('Errore nel recupero del mese corrente:', monthError);
      return new Response(
        JSON.stringify({ error: "Errore nel recupero del mese corrente" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Inserisci o aggiorna i token acquistati
    const { data: existingTokens, error: fetchError } = await supabase
      .from('translation_tokens')
      .select('*')
      .eq('month', currentMonth)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Errore nel recupero dei token esistenti:', fetchError);
      return new Response(
        JSON.stringify({ error: "Errore nel recupero dei dati" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingTokens) {
      // Aggiorna record esistente
      const { error: updateError } = await supabase
        .from('translation_tokens')
        .update({
          purchased_tokens_total: (existingTokens.purchased_tokens_total || 0) + tokens,
          tokens_limit: monthlyLimit, // Aggiorna anche il limite nel caso sia cambiato
          last_updated: new Date().toISOString()
        })
        .eq('month', currentMonth);

      if (updateError) {
        console.error('Errore nell\'aggiornamento dei token:', updateError);
        return new Response(
          JSON.stringify({ error: "Errore nell'aggiornamento dei token" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Crea nuovo record
      const { error: insertError } = await supabase
        .from('translation_tokens')
        .insert([{
          month: currentMonth,
          tokens_used: 0,
          tokens_limit: monthlyLimit,
          purchased_tokens_total: tokens,
          purchased_tokens_used: 0
        }]);

      if (insertError) {
        console.error('Errore nell\'inserimento dei token:', insertError);
        return new Response(
          JSON.stringify({ error: "Errore nell'inserimento dei token" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.log(`Token acquistati con successo: ${tokens} token aggiunti per il mese ${currentMonth}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${tokens} token aggiunti con successo!`,
        tokensCredited: tokens,
        monthlyLimit: monthlyLimit
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Errore generale:', error);
    return new Response(
      JSON.stringify({ error: "Errore interno del server" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function getPayPalAccessToken() {
  const response = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${paypalClientId}:${paypalSecretKey}`)}`
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

async function verifyPayPalPayment(orderId: string, accessToken: string) {
  const response = await fetch(`${paypalApiBase}/v2/checkout/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const orderData = await response.json();
  
  return {
    verified: orderData.status === 'COMPLETED',
    amount: orderData.purchase_units?.[0]?.amount?.value,
    currency: orderData.purchase_units?.[0]?.amount?.currency_code
  };
}
