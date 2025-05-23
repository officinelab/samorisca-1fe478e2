
// Edge Function per aggiornare i token acquistati dopo un pagamento PayPal
import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID")!;
const PAYPAL_SECRET_KEY = Deno.env.get("PAYPAL_SECRET_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Payload non valido" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const { orderId } = body;
  if (!orderId) {
    return new Response(JSON.stringify({ success: false, error: "Order ID mancante" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Recupera JWT utente dalla request per sapere chi è
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  let userId = null;
  if (token) {
    try {
      const { data: user } = await supabase.auth.getUser(token);
      userId = user?.user?.id;
    } catch {
      return new Response(JSON.stringify({ success: false, error: "Utente non autenticato" }), {
        status: 401,
        headers: corsHeaders,
      });
    }
    if (!userId) {
      return new Response(JSON.stringify({ success: false, error: "Utente non trovato" }), {
        status: 401,
        headers: corsHeaders,
      });
    }
  } else {
    return new Response(JSON.stringify({ success: false, error: "Nessun token di autenticazione" }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  // Verifica pagamento PayPal
  try {
    // Ottieni token accesso da PayPal
    const authRes = await fetch("https://api.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const authData = await authRes.json();
    if (!authRes.ok || !authData.access_token) {
      return new Response(JSON.stringify({ success: false, error: "Errore autenticazione PayPal" }), { status: 500, headers: corsHeaders });
    }

    // Recupera dettagli ordine PayPal
    const orderRes = await fetch(`https://api.paypal.com/v2/checkout/orders/${orderId}`, {
      headers: {
        "Authorization": `Bearer ${authData.access_token}`,
        "Content-Type": "application/json",
      },
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok || orderData.status !== "COMPLETED") {
      return new Response(JSON.stringify({ success: false, error: "Pagamento non completato o errore PayPal" }), { status: 400, headers: corsHeaders });
    }

    // Prendi il prezzo pagato (per sicurezza)
    const paidAmount = parseFloat(orderData.purchase_units?.[0]?.amount?.value || "0");

    // Recupera prezzo e quantità pacchetto token dalla tabella site_settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("*")
      .in("key", ["tokenPackagePrice", "tokenPackageAmount"]);

    const packagePrice = parseFloat(settings?.find((s: any) => s.key === "tokenPackagePrice")?.value ?? "9.90");
    const packageAmount = parseInt(settings?.find((s: any) => s.key === "tokenPackageAmount")?.value ?? "1000", 10);

    // Verifica che prezzo pagato sia congruente col pacchetto
    if (Math.abs(paidAmount - packagePrice) > 0.01) {
      return new Response(JSON.stringify({ success: false, error: "Importo del pagamento non valido" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Aggiorna la riga translation_tokens per il mese corrente, oppure crea se non esiste
    const { data: monthData } = await supabase.rpc("get_current_month");
    let { data: tokensData } = await supabase
      .from("translation_tokens")
      .select("*")
      .eq("month", monthData)
      .maybeSingle();

    // Se non esiste, crea la riga nuova
    if (!tokensData) {
      const { data: newRow } = await supabase
        .from("translation_tokens")
        .insert([{
          month: monthData,
          tokens_used: 0,
          tokens_limit: 300,
          purchased_tokens_total: packageAmount,
          purchased_tokens_used: 0,
        }])
        .select("*")
        .single();
      tokensData = newRow;
    } else {
      // Altrimenti aggiorna il saldo acquistato
      await supabase
        .from("translation_tokens")
        .update({
          purchased_tokens_total: (tokensData.purchased_tokens_total ?? 0) + packageAmount
        })
        .eq("id", tokensData.id);
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message || String(err) }), { status: 500, headers: corsHeaders });
  }
});
