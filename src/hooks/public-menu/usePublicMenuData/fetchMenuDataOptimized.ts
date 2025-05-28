
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, Allergen } from "@/types/database";
import { CategoryNote } from "@/types/categoryNotes";

// Cache per evitare ricaricamenti inutili
const dataCache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

// Funzione per recuperare le categorie
const fetchCategories = async (): Promise<Category[]> => {
  const cacheKey = 'categories';
  const cached = dataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  
  const result = data || [];
  dataCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
};

// Funzione ottimizzata per recuperare tutti i prodotti
const fetchAllProductsOptimized = async (categoryIds: string[], language: string) => {
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
  const translationsMap = new Map<string, Map<string, string>>();
  [productTranslations, allergenTranslations, featureTranslations, labelTranslations].forEach(result => {
    result.data?.forEach((tr: any) => {
      const key = `${tr.entity_type}-${tr.entity_id}`;
      if (!translationsMap.has(key)) {
        translationsMap.set(key, new Map());
      }
      translationsMap.get(key)!.set(tr.field, tr.translated_text);
    });
  });

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
    const productTransKey = `products-${product.id}`;
    const productTrans = translationsMap.get(productTransKey);
    const displayTitle = productTrans?.get('title') || product.title;
    const displayDescription = productTrans?.get('description') || product.description;
    const displayPriceSuffix = productTrans?.get('price_suffix') || product.price_suffix;
    const displayVariant1Name = productTrans?.get('price_variant_1_name') || product.price_variant_1_name;
    const displayVariant2Name = productTrans?.get('price_variant_2_name') || product.price_variant_2_name;

    // Processa allergeni
    const productAllergenIds = allergensByProductId.get(product.id) || [];
    const productAllergensDetails = productAllergenIds
      .map(id => allergensMap.get(id))
      .filter(Boolean)
      .map(allergen => {
        const allergenTransKey = `allergens-${allergen!.id}`;
        const allergenTrans = translationsMap.get(allergenTransKey);
        return {
          ...allergen!,
          displayTitle: allergenTrans?.get('title') || allergen!.title,
          displayDescription: allergenTrans?.get('description') || allergen!.description
        };
      })
      .sort((a, b) => a.number - b.number);

    // Processa features
    const productFeatureIds = featuresByProductId.get(product.id) || [];
    const productFeaturesDetails = productFeatureIds
      .map(id => featuresMap.get(id))
      .filter(Boolean)
      .map(feature => {
        const featureTransKey = `product_features-${feature!.id}`;
        const featureTrans = translationsMap.get(featureTransKey);
        return {
          ...feature!,
          displayTitle: featureTrans?.get('title') || feature!.title
        };
      })
      .sort((a, b) => a.display_order - b.display_order);

    // Processa label
    let label = null;
    if (product.label) {
      const labelTransKey = `product_labels-${product.label.id}`;
      const labelTrans = translationsMap.get(labelTransKey);
      label = {
        ...product.label,
        displayTitle: labelTrans?.get('title') || product.label.title
      };
    }

    productsByCategory[product.category_id].push({
      ...product,
      label,
      features: productFeaturesDetails,
      allergens: productAllergensDetails,
      displayTitle,
      displayDescription,
      price_suffix: displayPriceSuffix,
      price_variant_1_name: displayVariant1Name,
      price_variant_2_name: displayVariant2Name
    } as Product);
  });

  console.log('✅ Products processing completed');
  return productsByCategory;
};

// Funzione per recuperare le note categorie
const fetchCategoryNotes = async (): Promise<CategoryNote[]> => {
  const cacheKey = 'categoryNotes';
  const cached = dataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const { data, error } = await supabase
      .from('category_notes')
      .select(`
        id,
        title,
        text,
        icon_url,
        display_order,
        created_at,
        updated_at,
        category_notes_categories!inner(category_id)
      `)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Errore nel caricamento delle note categorie:', error);
      return [];
    }

    const notesWithCategories = data?.map(note => ({
      ...note,
      categories: note.category_notes_categories?.map((cnc: any) => cnc.category_id) || []
    })) || [];

    dataCache.set(cacheKey, { data: notesWithCategories, timestamp: Date.now() });
    return notesWithCategories;
  } catch (error) {
    console.error('Errore nel fetch delle note categorie:', error);
    return [];
  }
};

// Funzione per recuperare gli allergeni con traduzioni
const fetchAllergensWithTranslations = async (language: string): Promise<Allergen[]> => {
  const cacheKey = `allergens-${language}`;
  const cached = dataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const [allergensResult, translationsResult] = await Promise.all([
    supabase.from('allergens').select('*').order('number', { ascending: true }),
    language !== 'it' 
      ? supabase.from('translations').select('*').eq('entity_type', 'allergens').eq('language', language)
      : Promise.resolve({ data: null })
  ]);

  if (allergensResult.error) throw allergensResult.error;

  const translationsMap = new Map<string, Map<string, string>>();
  translationsResult.data?.forEach((tr: any) => {
    if (!translationsMap.has(tr.entity_id)) {
      translationsMap.set(tr.entity_id, new Map());
    }
    translationsMap.get(tr.entity_id)!.set(tr.field, tr.translated_text);
  });

  const result = (allergensResult.data || []).map(allergen => {
    const translations = translationsMap.get(allergen.id);
    return {
      ...allergen,
      displayTitle: translations?.get('title') || allergen.title,
      displayDescription: translations?.get('description') || allergen.description
    };
  });

  dataCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
};

export const fetchMenuDataOptimized = async (language: string) => {
  const startTime = Date.now();
  console.log('🚀 Starting optimized menu data fetch for language:', language);

  try {
    // 1. Carica categorie e note in parallelo
    const [categories, categoryNotes] = await Promise.all([
      fetchCategories(),
      fetchCategoryNotes()
    ]);

    console.log('📂 Categories loaded:', categories.length);

    // 2. Se non ci sono categorie, ritorna dati vuoti
    if (categories.length === 0) {
      return { categories, products: {}, allergens: [], categoryNotes };
    }

    // 3. Carica prodotti e allergeni in parallelo
    const categoryIds = categories.map(c => c.id);
    const [products, allergens] = await Promise.all([
      fetchAllProductsOptimized(categoryIds, language),
      fetchAllergensWithTranslations(language)
    ]);

    const endTime = Date.now();
    console.log(`✅ Menu data fetch completed in ${endTime - startTime}ms`);

    return {
      categories,
      products,
      allergens,
      categoryNotes
    };
  } catch (error) {
    console.error('❌ Errore nel caricamento ottimizzato dei dati menu:', error);
    throw error;
  }
};

// Funzione per pulire la cache quando necessario
export const clearMenuDataCache = () => {
  dataCache.clear();
  console.log('🧹 Menu data cache cleared');
};
