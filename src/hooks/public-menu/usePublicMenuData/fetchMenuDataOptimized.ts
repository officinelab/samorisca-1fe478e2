
import { supabase } from "@/integrations/supabase/client";
import { Allergen, Category, Product, ProductFeature, ProductLabel } from "@/types/database";

export async function fetchMenuDataOptimized(language: string) {
  // 1. Categorie
  const { data: categoriesData, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (categoriesError) throw categoriesError;
  const categories: Category[] = categoriesData || [];

  const categoryIds = categories.map((cat) => cat.id);
  if (!categoryIds.length) return { categories: [], products: {}, allergens: [] };

  // 2. Prodotti di tutte le categorie (con label join)
  const { data: allProducts, error: productsError } = await supabase
    .from("products")
    .select("*, label:label_id(*)")
    .in("category_id", categoryIds)
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (productsError) throw productsError;

  // 3. Relazioni prodotti-features e prodotti-allergeni, tutte in batch
  const productIds = (allProducts || []).map(p => p.id);

  // Features per prodotti
  const { data: productFeaturesRels } = await supabase
    .from("product_to_features")
    .select("product_id, feature_id")
    .in("product_id", productIds);

  // Allergeni per prodotti
  const { data: productAllergensRels } = await supabase
    .from("product_allergens")
    .select("product_id, allergen_id")
    .in("product_id", productIds);

  // 4. Features, Labels, Allergeni: carica tutti quelli collegati almeno a un prodotto in menu
  const featureIds = Array.from(new Set((productFeaturesRels || []).map(r => r.feature_id)));
  const labelIds = Array.from(new Set((allProducts || []).map(p => p.label_id).filter(Boolean)));
  const allergenIds = Array.from(new Set((productAllergensRels || []).map(r => r.allergen_id)));

  // Features
  let features: ProductFeature[] = [];
  if (featureIds.length > 0) {
    const { data: featuresData } = await supabase
      .from("product_features")
      .select("*")
      .in("id", featureIds)
      .order("display_order", { ascending: true });
    features = featuresData || [];
  }
  // Labels
  let labels: ProductLabel[] = [];
  if (labelIds.length > 0) {
    const { data: labelsData } = await supabase
      .from("product_labels")
      .select("*")
      .in("id", labelIds)
      .order("display_order", { ascending: true });
    labels = labelsData || [];
  }
  // Allergeni
  let allergens: Allergen[] = [];
  if (allergenIds.length > 0) {
    const { data: allergensData } = await supabase
      .from("allergens")
      .select("*")
      .in("id", allergenIds)
      .order("number", { ascending: true });
    allergens = allergensData || [];
  }

  // 5. Traduzioni batch (per opzioni multilingua)
  const needsTranslation = language !== "it";
  let translations: Record<string, any[]> = {};
  if (needsTranslation) {
    const toTranslate = [
      ...productIds.map(id => ({ entity_type: "products", id })),
      ...featureIds.map(id => ({ entity_type: "product_features", id })),
      ...labelIds.map(id => ({ entity_type: "product_labels", id })),
      ...allergenIds.map(id => ({ entity_type: "allergens", id })),
    ];

    // Batch query su translations
    const allTrans = [];
    for (const { entity_type, id } of toTranslate) {
      allTrans.push({ entity_type, entity_id: id });
    }
    if (allTrans.length > 0) {
      const { data: translationsData } = await supabase
        .from("translations")
        .select("*")
        .in("entity_type", allTrans.map(t => t.entity_type))
        .in("entity_id", allTrans.map(t => t.entity_id))
        .eq("language", language);
      (translationsData || []).forEach(tr => {
        if (!translations[tr.entity_type]) translations[tr.entity_type] = {};
        if (!translations[tr.entity_type][tr.entity_id]) translations[tr.entity_type][tr.entity_id] = [];
        translations[tr.entity_type][tr.entity_id].push(tr);
      });
    }
  }

  // 6. Organizzazione prodotti arricchiti
  const allergensMap = Object.fromEntries((allergens || []).map(a => [a.id, a]));
  const featuresMap = Object.fromEntries((features || []).map(f => [f.id, f]));
  const labelsMap = Object.fromEntries((labels || []).map(l => [l.id, l]));

  // Utility helper per traduzioni
  function translateField(base, entity_type: string, field: string, id: string) {
    if (!needsTranslation) return base[field];
    const entityTranslations = translations[entity_type]?.[id];
    if (!entityTranslations) return base[field];
    const tr = entityTranslations.find(t => t.field === field && t.translated_text);
    return tr?.translated_text ?? base[field];
  }

  // Raggruppa i prodotti per categorie
  const productsByCategory: Record<string, Product[]> = {};
  for (const category of categories) {
    const catProducts = (allProducts || []).filter(p => p.category_id === category.id);
    productsByCategory[category.id] = catProducts.map((product: Product) => {
      // Traduzioni prodotto
      const displayTitle = translateField(product, "products", "title", product.id);
      const displayDescription = translateField(product, "products", "description", product.id);
      const displayPriceSuffix = translateField(product, "products", "price_suffix", product.id);
      const displayVariant1Name = translateField(product, "products", "price_variant_1_name", product.id);
      const displayVariant2Name = translateField(product, "products", "price_variant_2_name", product.id);

      // Relazioni
      // Allergeni per questo prodotto
      const myAllergenRels = (productAllergensRels || []).filter(r => r.product_id === product.id);
      const productAllergens = myAllergenRels.map(r => {
        const base = allergensMap[r.allergen_id];
        if (!base) return null;
        const displayTitle = translateField(base, "allergens", "title", base.id);
        const displayDescription = translateField(base, "allergens", "description", base.id);
        return { ...base, displayTitle, displayDescription };
      }).filter(Boolean);

      // Features per questo prodotto
      const myFeatureRels = (productFeaturesRels || []).filter(r => r.product_id === product.id);
      const productFeatures = myFeatureRels.map(r => {
        const feat = featuresMap[r.feature_id];
        if (!feat) return null;
        const displayTitle = translateField(feat, "product_features", "title", feat.id);
        return { ...feat, displayTitle };
      }).filter(Boolean);

      // Label
      let label: ProductLabel | null = null;
      const label_base = labelsMap[product.label_id ?? ""];
      if (label_base) {
        const displayTitle = translateField(label_base, "product_labels", "title", label_base.id);
        label = { ...label_base, displayTitle };
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

  // Allergen list con traduzione
  const allAllergens = (allergens || []).map((a) => ({
    ...a,
    displayTitle: translateField(a, "allergens", "title", a.id),
    displayDescription: translateField(a, "allergens", "description", a.id),
  }));

  return {
    categories,
    products: productsByCategory,
    allergens: allAllergens,
  };
}
