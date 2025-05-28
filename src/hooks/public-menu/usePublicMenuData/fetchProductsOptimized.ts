
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/database";
import { createTranslationsMap, applyTranslations } from "./translationUtils";

export const fetchProductsOptimized = async (categoryIds: string[], language: string) => {
  console.log('🚀 Fetching products for categories:', categoryIds.length);
  
  // 1. Carica tutti i prodotti in una query
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*, label:label_id(*)')
    .in('category_id', categoryIds)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (productsError) throw productsError;
  if (!productsData || productsData.length === 0) return {};

  const productIds = productsData.map(p => p.id);
  console.log('📦 Loaded products:', productIds.length);

  // 2. Carica tutte le relazioni in parallelo
  const [
    productAllergens,
    productFeatures,
    allergensDetails,
    featuresDetails,
    productTranslations,
    allergenTranslations,
    featureTranslations,
    labelTranslations
  ] = await Promise.all([
    // Product-allergen relations
    supabase.from('product_allergens').select('*').in('product_id', productIds),
    // Product-feature relations  
    supabase.from('product_to_features').select('*').in('product_id', productIds),
    // Allergen details
    supabase.from('allergens').select('*').order('number', { ascending: true }),
    // Feature details
    supabase.from('product_features').select('*').order('display_order', { ascending: true }),
    // Translations (solo se non italiano)
    language !== 'it' 
      ? supabase.from('translations').select('*').in('entity_id', productIds).eq('entity_type', 'products').eq('language', language)
      : Promise.resolve({ data: null }),
    language !== 'it'
      ? supabase.from('translations').select('*').eq('entity_type', 'allergens').eq('language', language)
      : Promise.resolve({ data: null }),
    language !== 'it'
      ? supabase.from('translations').select('*').eq('entity_type', 'product_features').eq('language', language)
      : Promise.resolve({ data: null }),
    language !== 'it'
      ? supabase.from('translations').select('*').eq('entity_type', 'product_labels').eq('language', language)
      : Promise.resolve({ data: null })
  ]);

  console.log('🔗 Loaded relations and translations');

  // 3. Crea mappe per accesso rapido
  const allergensByProductId = new Map<string, string[]>();
  productAllergens.data?.forEach(pa => {
    if (!allergensByProductId.has(pa.product_id)) {
      allergensByProductId.set(pa.product_id, []);
    }
    allergensByProductId.get(pa.product_id)!.push(pa.allergen_id);
  });

  const featuresByProductId = new Map<string, string[]>();
  productFeatures.data?.forEach(pf => {
    if (!featuresByProductId.has(pf.product_id)) {
      featuresByProductId.set(pf.product_id, []);
    }
    featuresByProductId.get(pf.product_id)!.push(pf.feature_id);
  });

  // Mappe traduzioni
  const translationsMap = createTranslationsMap([
    ...(productTranslations.data || []),
    ...(allergenTranslations.data || []),
    ...(featureTranslations.data || []),
    ...(labelTranslations.data || [])
  ]);

  // Crea mappe per accesso rapido ai dettagli
  const allergensMap = new Map(allergensDetails.data?.map(a => [a.id, a]) || []);
  const featuresMap = new Map(featuresDetails.data?.map(f => [f.id, f]) || []);

  // 4. Processa tutti i prodotti
  const productsByCategory: Record<string, Product[]> = {};

  productsData.forEach(product => {
    if (!productsByCategory[product.category_id]) {
      productsByCategory[product.category_id] = [];
    }

    // Applica traduzioni al prodotto
    const translatedFields = applyTranslations(
      product.id,
      'products',
      {
        title: product.title,
        description: product.description,
        price_suffix: product.price_suffix,
        price_variant_1_name: product.price_variant_1_name,
        price_variant_2_name: product.price_variant_2_name
      },
      translationsMap
    );

    // Processa allergeni
    const productAllergenIds = allergensByProductId.get(product.id) || [];
    const productAllergensDetails = productAllergenIds
      .map(id => allergensMap.get(id))
      .filter(Boolean)
      .map(allergen => {
        const translatedAllergen = applyTranslations(
          allergen!.id,
          'allergens',
          { title: allergen!.title, description: allergen!.description },
          translationsMap
        );
        return {
          ...allergen!,
          displayTitle: translatedAllergen.title,
          displayDescription: translatedAllergen.description
        };
      })
      .sort((a, b) => a.number - b.number);

    // Processa features
    const productFeatureIds = featuresByProductId.get(product.id) || [];
    const productFeaturesDetails = productFeatureIds
      .map(id => featuresMap.get(id))
      .filter(Boolean)
      .map(feature => {
        const translatedFeature = applyTranslations(
          feature!.id,
          'product_features',
          { title: feature!.title },
          translationsMap
        );
        return {
          ...feature!,
          displayTitle: translatedFeature.title
        };
      })
      .sort((a, b) => a.display_order - b.display_order);

    // Processa label
    let label = null;
    if (product.label) {
      const translatedLabel = applyTranslations(
        product.label.id,
        'product_labels',
        { title: product.label.title },
        translationsMap
      );
      label = {
        ...product.label,
        displayTitle: translatedLabel.title
      };
    }

    productsByCategory[product.category_id].push({
      ...product,
      label,
      features: productFeaturesDetails,
      allergens: productAllergensDetails,
      displayTitle: translatedFields.title,
      displayDescription: translatedFields.description,
      price_suffix: translatedFields.price_suffix,
      price_variant_1_name: translatedFields.price_variant_1_name,
      price_variant_2_name: translatedFields.price_variant_2_name
    } as Product);
  });

  console.log('✅ Products processing completed');
  return productsByCategory;
};
