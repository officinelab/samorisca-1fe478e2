
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFeature, ProductLabel, Allergen, Category } from "@/types/database";

export async function fetchProductsForCategories(params: {
  categories: Category[],
  featuresTranslations: Record<string, any[]>,
  labelsTranslations: Record<string, any[]>,
  language: string
}) {
  const { categories, featuresTranslations, labelsTranslations, language } = params;
  const productsMap: Record<string, Product[]> = {};

  for (const category of categories) {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*, label:label_id(*)')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (productsError) throw productsError;

    let productTranslations: Record<string, any[]> = {};
    if (productsData && productsData.length > 0 && language !== 'it') {
      const productIds = productsData.map(p => p.id);
      const { data: translationsData } = await supabase
        .from('translations')
        .select('*')
        .in('entity_id', productIds)
        .eq('entity_type', 'products')
        .eq('language', language);

      productTranslations = {};
      (translationsData || []).forEach(tr => {
        if (!productTranslations[tr.entity_id]) productTranslations[tr.entity_id] = [];
        productTranslations[tr.entity_id].push(tr);
      });
    }

    // Carico relations product->features, dettagli features e allergeni come nella funzione madre
    let productFeaturesRelations: { product_id: string, feature_id: string }[] = [];
    let featuresDataLocal: ProductFeature[] = [];
    if (productsData && productsData.length > 0) {
      const productIds = productsData.map(p => p.id);
      const { data: rel, error: relErr } = await supabase
        .from('product_to_features')
        .select('*')
        .in('product_id', productIds);
      if (relErr) throw relErr;
      productFeaturesRelations = rel || [];
      const allFeatureIds = Array.from(new Set(productFeaturesRelations.map(r => r.feature_id)));
      if (allFeatureIds.length > 0) {
        const { data: feats, error: featErr } = await supabase
          .from('product_features')
          .select('*')
          .in('id', allFeatureIds)
          .order('display_order', { ascending: true });
        if (featErr) throw featErr;
        featuresDataLocal = feats || [];
      }
    }

    const productsWithDetails = await Promise.all((productsData || []).map(async product => {
      // Allergen retrieval
      const { data: productAllergens, error: allergensError } = await supabase.from('product_allergens').select('allergen_id').eq('product_id', product.id);
      if (allergensError) throw allergensError;
      let productAllergensDetails: Allergen[] = [];
      if (productAllergens && productAllergens.length > 0) {
        const allergenIds = productAllergens.map(pa => pa.allergen_id);
        const { data: allergensDetails, error: detailsError } = await supabase.from('allergens').select('*').in('id', allergenIds).order('number', { ascending: true });
        if (detailsError) throw detailsError;

        let allergenTranslations: Record<string, any[]> = {};
        if (language !== 'it') {
          const { data: allergenTrans } = await supabase
            .from('translations')
            .select('*')
            .in('entity_id', allergenIds)
            .eq('entity_type', 'allergens')
            .eq('language', language);

          (allergenTrans || []).forEach(tr => {
            if (!allergenTranslations[tr.entity_id]) allergenTranslations[tr.entity_id] = [];
            allergenTranslations[tr.entity_id].push(tr);
          });
        }

        productAllergensDetails = (allergensDetails || []).map(allergen => {
          let translatedTitle = allergen.title;
          let translatedDescription = allergen.description;
          if (language !== 'it' && allergenTranslations[allergen.id]) {
            allergenTranslations[allergen.id].forEach(tr => {
              if (tr.field === "title" && tr.translated_text) translatedTitle = tr.translated_text;
              if (tr.field === "description" && tr.translated_text) translatedDescription = tr.translated_text;
            });
          }
          return {
            ...allergen,
            displayTitle: translatedTitle,
            displayDescription: translatedDescription
          };
        });
      }

      let displayTitle = product.title;
      let displayDescription = product.description;
      let displayPriceSuffix = product.price_suffix;
      let displayVariant1Name = product.price_variant_1_name;
      let displayVariant2Name = product.price_variant_2_name;

      if (language !== 'it' && productTranslations[product.id]) {
        productTranslations[product.id].forEach(tr => {
          if (tr.field === "title" && tr.translated_text) displayTitle = tr.translated_text;
          if (tr.field === "description" && tr.translated_text) displayDescription = tr.translated_text;
          if (tr.field === "price_suffix" && tr.translated_text) displayPriceSuffix = tr.translated_text;
          if (tr.field === "price_variant_1_name" && tr.translated_text) displayVariant1Name = tr.translated_text;
          if (tr.field === "price_variant_2_name" && tr.translated_text) displayVariant2Name = tr.translated_text;
        });
      }

      const myFeatureIds = productFeaturesRelations
        .filter(r => r.product_id === product.id)
        .map(r => r.feature_id);

      let myFeatures = featuresDataLocal
        .filter(f => myFeatureIds.includes(f.id))
        .map(f => {
          let displayTitle = f.title;
          if (language !== 'it' && featuresTranslations[f.id]) {
            featuresTranslations[f.id].forEach(tr => {
              if (tr.field === "title" && tr.translated_text) displayTitle = tr.translated_text;
            });
          }
          return { ...f, displayTitle };
        })
        .sort((a, b) => a.display_order - b.display_order);

      let label = null;
      if (product.label) {
        const baseLabel = product.label as ProductLabel;
        let displayTitle = baseLabel.title;
        if (language !== "it" && labelsTranslations[baseLabel.id]) {
          labelsTranslations[baseLabel.id].forEach(tr => {
            if (tr.field === "title" && tr.translated_text) displayTitle = tr.translated_text;
          });
        }
        label = { ...baseLabel, displayTitle };
      }

      return {
        ...product,
        label,
        features: myFeatures,
        allergens: productAllergensDetails,
        displayTitle,
        displayDescription,
        price_suffix: displayPriceSuffix,
        price_variant_1_name: displayVariant1Name,
        price_variant_2_name: displayVariant2Name
      } as Product;
    }));

    productsMap[category.id] = productsWithDetails;
  }

  return productsMap;
}
