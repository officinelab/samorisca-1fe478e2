
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

/**
 * Edge function che restituisce il Client ID PayPal
 * Solo per utenti autenticati.
 */
serve(async (req) => {
  // Solo autenticato: serve il Bearer token valido
  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Non autorizzato. Effettua il login." }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const VITE_PAYPAL_CLIENT_ID = Deno.env.get("VITE_PAYPAL_CLIENT_ID");
  if (!VITE_PAYPAL_CLIENT_ID) {
    return new Response(
      JSON.stringify({ error: "ClientID PayPal non configurato su Supabase." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ clientId: VITE_PAYPAL_CLIENT_ID }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

// Handle CORS preflight requests
if (typeof Deno !== "undefined") {
  globalThis.addEventListener("fetch", (event) => {
    if (event.request.method === "OPTIONS") {
      event.respondWith(
        new Response(null, { headers: corsHeaders })
      );
    }
  });

