import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Copia dei CORS headers standard
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Prendi il body con language
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const language = (body?.language && typeof body.language === 'string') ? body.language : "it";
  const needsTranslation = language !== "it";

  const supabase = (await import("https://esm.sh/@supabase/supabase-js@2.39.7")).createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  // 1. Categories
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (categoriesError) {
    return new Response(JSON.stringify({ error: categoriesError.message }), {
      status: 500,
      headers: corsHeaders
    });
  }

  // Estrai la lingua richiesta
  const language = (body?.language && typeof body.language === 'string') ? body.language : "it";

  // Nuovo: Aggiungi i campi di traduzione nelle categorie, se esistono (ad esempio title_en)
  // Mantieni sempre il title italiano, e aggiungi le traduzioni se presenti
  const languageSupported = ["en", "fr", "de", "es"];
  const categoriesWithTranslations = (categories || []).map((cat: any) => {
    const catObj: any = { ...cat };
    languageSupported.forEach(lang => {
      if (cat[`title_${lang}`]) {
        catObj[`title_${lang}`] = cat[`title_${lang}`];
      }
      if (cat[`description_${lang}`]) {
        catObj[`description_${lang}`] = cat[`description_${lang}`];
      }
    });
    return catObj;
  });

  const categoryIds = (categories || []).map((c: any) => c.id);
  if (!categoryIds.length)
    return new Response(JSON.stringify({ categories: [], products: {}, allergens: [] }), { headers: corsHeaders });

  // 2. All products with label
  const { data: allProducts, error: productsError } = await supabase
    .from("products")
    .select("*, label:label_id(*)")
    .in("category_id", categoryIds)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (productsError) {
    return new Response(JSON.stringify({ error: productsError.message }), {
      status: 500,
      headers: corsHeaders
    });
  }

  const productIds = (allProducts || []).map((p: any) => p.id);

  // 3. Features/Allergens relazioni
  const [
    { data: productFeaturesRels = [] },
    { data: productAllergensRels = [] }
  ] = await Promise.all([
    supabase.from("product_to_features").select("product_id, feature_id").in("product_id", productIds),
    supabase.from("product_allergens").select("product_id, allergen_id").in("product_id", productIds)
  ]);

  // 4. Features, Labels, Allergeni correlati
  const featureIds = Array.from(new Set((productFeaturesRels || []).map((r: any) => r.feature_id)));
  const labelIds = Array.from(new Set((allProducts || []).map((p: any) => p.label_id).filter(Boolean)));
  const allergenIds = Array.from(new Set((productAllergensRels || []).map((r: any) => r.allergen_id)));

  // Features
  let features: any[] = [];
  if (featureIds.length) {
    const { data: f } = await supabase.from("product_features").select("*").in("id", featureIds).order("display_order", { ascending: true });
    features = f || [];
  }
  // Labels
  let labels: any[] = [];
  if (labelIds.length) {
    const { data: l } = await supabase.from("product_labels").select("*").in("id", labelIds).order("display_order", { ascending: true });
    labels = l || [];
  }
  // Allergens
  let allergens: any[] = [];
  if (allergenIds.length) {
    const { data: a } = await supabase.from("allergens").select("*").in("id", allergenIds).order("number", { ascending: true });
    allergens = a || [];
  }

  // 5. Traduzioni batch (se richiesto)
  let translations: Record<string, Record<string, any[]>> = {};
  if (needsTranslation) {
    const toTranslate = [
      ...productIds.map(id => ({ entity_type: "products", id })),
      ...featureIds.map(id => ({ entity_type: "product_features", id })),
      ...labelIds.map(id => ({ entity_type: "product_labels", id })),
      ...allergenIds.map(id => ({ entity_type: "allergens", id })),
    ];
    const allTrans = toTranslate.map(t => ({ entity_type: t.entity_type, entity_id: t.id }));
    if (allTrans.length > 0) {
      const { data: t } = await supabase
        .from("translations")
        .select("*")
        .in("entity_type", allTrans.map((a) => a.entity_type))
        .in("entity_id", allTrans.map((a) => a.entity_id))
        .eq("language", language);
      (t || []).forEach(tr => {
        if (!translations[tr.entity_type]) translations[tr.entity_type] = {};
        if (!translations[tr.entity_type][tr.entity_id]) translations[tr.entity_type][tr.entity_id] = [];
        translations[tr.entity_type][tr.entity_id].push(tr);
      });
    }
  }

  // Utility traduzione
  function translateField(base: any, entity_type: string, field: string, id: string) {
    if (!needsTranslation) return base[field];
    const entityTranslations = translations?.[entity_type]?.[id];
    if (!entityTranslations) return base[field];
    const tr = entityTranslations.find((t: any) => t.field === field && t.translated_text);
    return tr?.translated_text ?? base[field];
  }

  // Costruzione delle mappe id -> oggetto
  const allergensMap = Object.fromEntries((allergens || []).map((a) => [a.id, a]));
  const featuresMap = Object.fromEntries((features || []).map((f) => [f.id, f]));
  const labelsMap = Object.fromEntries((labels || []).map((l) => [l.id, l]));

  // Raggruppa prodotti per categoria ed arricchisci con allergeni / features / label tradotte
  const productsByCategory: Record<string, any[]> = {};
  for (const category of categoriesWithTranslations) {
    const catProducts = (allProducts || []).filter((p: any) => p.category_id === category.id);
    productsByCategory[category.id] = catProducts.map((product: any) => {
      // Prodotti tradotti
      const displayTitle = translateField(product, "products", "title", product.id);
      const displayDescription = translateField(product, "products", "description", product.id);
      const displayPriceSuffix = translateField(product, "products", "price_suffix", product.id);
      const displayVariant1Name = translateField(product, "products", "price_variant_1_name", product.id);
      const displayVariant2Name = translateField(product, "products", "price_variant_2_name", product.id);

      // Allergeni per prodotto
      const myAllergenRels = (productAllergensRels || []).filter((r: any) => r.product_id === product.id);
      const productAllergens = myAllergenRels.map((r: any) => {
        const base = allergensMap[r.allergen_id];
        if (!base) return null;
        const displayTitle = translateField(base, "allergens", "title", base.id);
        const displayDescription = translateField(base, "allergens", "description", base.id);
        return { ...base, displayTitle, displayDescription };
      }).filter(Boolean);

      // Features per prodotto
      const myFeatureRels = (productFeaturesRels || []).filter((r: any) => r.product_id === product.id);
      const productFeatures = myFeatureRels.map((r: any) => {
        const feat = featuresMap[r.feature_id];
        if (!feat) return null;
        const displayTitle = translateField(feat, "product_features", "title", feat.id);
        return { ...feat, displayTitle };
      }).filter(Boolean);

      // Label
      let label: any = null;
      const label_base = labelsMap[product.label_id ?? ""];
      if (label_base) {
        label = { ...label_base, displayTitle: translateField(label_base, "product_labels", "title", label_base.id) };
      }

      return {
        ...product,
        allergens: productAllergens,
        features: productFeatures,
        label,
        displayTitle,
        displayDescription,
        price_suffix: displayPriceSuffix,
        price_variant_1_name: displayVariant1Name,
        price_variant_2_name: displayVariant2Name,
      };
    });
  }

  // All allergens tradotti
  const allAllergens = (allergens || []).map((a: any) => ({
    ...a,
    displayTitle: translateField(a, "allergens", "title", a.id),
    displayDescription: translateField(a, "allergens", "description", a.id),
  }));

  return new Response(
    JSON.stringify({
      categories: categoriesWithTranslations,
      products: productsByCategory,
      allergens: allAllergens,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
