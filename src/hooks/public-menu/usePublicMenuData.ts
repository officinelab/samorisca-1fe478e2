import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Allergen, Category, Product, ProductFeature, ProductLabel } from "@/types/database";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const usePublicMenuData = (isPreview = false, previewLanguage = 'it') => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(previewLanguage);
  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
    }
  }, [isPreview, previewLanguage]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Categorie
        const {
          data: categoriesData,
          error: categoriesError
        } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order', {
          ascending: true
        });

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        let featuresTranslations: Record<string, any[]> = {};
        let featuresData: ProductFeature[] = [];
        let labelsTranslations: Record<string, any[]> = {};
        let labelsData: ProductLabel[] = [];

        // Fetch features (with translations)
        {
          const { data: features, error: featErr } = await supabase
            .from('product_features')
            .select('*')
            .order('display_order', { ascending: true });
          if (featErr) throw featErr;
          featuresData = features || [];

          if (featuresData.length > 0 && language !== 'it') {
            const { data: featuresTrans } = await supabase
              .from('translations')
              .select('*')
              .in('entity_id', featuresData.map(f => f.id))
              .eq('entity_type', 'product_features')
              .eq('language', language);
            (featuresTrans || []).forEach(tr => {
              if (!featuresTranslations[tr.entity_id]) featuresTranslations[tr.entity_id] = [];
              featuresTranslations[tr.entity_id].push(tr);
            });
          }
        }

        // Fetch product labels (with translations)
        {
          const { data: labels, error: labErr } = await supabase
            .from('product_labels')
            .select('*')
            .order('display_order', { ascending: true });
          if (labErr) throw labErr;
          labelsData = labels || [];

          if (labelsData.length > 0 && language !== 'it') {
            const { data: labelsTrans } = await supabase
              .from('translations')
              .select('*')
              .in('entity_id', labelsData.map(l => l.id))
              .eq('entity_type', 'product_labels')
              .eq('language', language);
            (labelsTrans || []).forEach(tr => {
              if (!labelsTranslations[tr.entity_id]) labelsTranslations[tr.entity_id] = [];
              labelsTranslations[tr.entity_id].push(tr);
            });
          }
        }

        if (categoriesData && categoriesData.length > 0) {
          const productsMap: Record<string, Product[]> = {};
          for (const category of categoriesData) {
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('*, label:label_id(*)')
              .eq('category_id', category.id)
              .eq('is_active', true)
              .order('display_order', { ascending: true });

            if (productsError) throw productsError;

            // PRELOAD tutte le traduzioni disponibili per prodotti di questa categoria per la lingua selezionata
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

            // ... allergeni e features come prima
            let productFeaturesRelations: { product_id: string, feature_id: string }[] = [];
            let featuresData: ProductFeature[] = [];
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
                featuresData = feats || [];
              }
            }

            const productsWithDetails = await Promise.all((productsData || []).map(async product => {
              const { data: productAllergens, error: allergensError } = await supabase.from('product_allergens').select('allergen_id').eq('product_id', product.id);
              if (allergensError) throw allergensError;
              let productAllergensDetails: Allergen[] = [];
              if (productAllergens && productAllergens.length > 0) {
                const allergenIds = productAllergens.map(pa => pa.allergen_id);
                const { data: allergensDetails, error: detailsError } = await supabase.from('allergens').select('*').in('id', allergenIds).order('number', {
                  ascending: true
                });
                if (detailsError) throw detailsError;

                // Fetch translations degli allergeni se necessario
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

              // Traduzioni titolo/descrizione/variant_name/prodotto dal db translations
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

              // Valorizza le traduzioni delle caratteristiche
              let myFeatures = featuresData
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

              // Etichetta prodotto, includendo la traduzione
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
                label: label,
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
          setProducts(productsMap);
        }

        // Carica tutti gli allergeni con traduzioni
        const {
          data: allergensData,
          error: allergensError
        } = await supabase.from('allergens').select('*').order('number', { ascending: true });
        if (allergensError) throw allergensError;

        let allergenTranslations: Record<string, any[]> = {};
        if (allergensData && allergensData.length > 0 && language !== 'it') {
          const {
            data: allergenTrans
          } = await supabase.from('translations')
            .select('*')
            .in('entity_id', allergensData.map(a => a.id))
            .eq('entity_type', 'allergens')
            .eq('language', language);
          (allergenTrans || []).forEach(tr => {
            if (!allergenTranslations[tr.entity_id]) allergenTranslations[tr.entity_id] = [];
            allergenTranslations[tr.entity_id].push(tr);
          });
        }

        const translatedAllergens = (allergensData || []).map(allergen => {
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

        setAllergens(translatedAllergens);

      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        toast.error("Errore nel caricamento del menu. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [language, isPreview, previewLanguage]);

  return {
    categories,
    products,
    allergens,
    isLoading,
    language,
    setLanguage
  };
};
