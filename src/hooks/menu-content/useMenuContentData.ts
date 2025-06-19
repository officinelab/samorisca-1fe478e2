
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category, Product, Allergen, ProductFeature } from '@/types/database';
import { CategoryNote } from '@/types/categoryNotes';
import { PrintLayout } from '@/types/printLayout';

interface MenuContentData {
  categories: Category[];
  productsByCategory: Record<string, Product[]>;
  allergens: Allergen[];
  categoryNotes: CategoryNote[];
  categoryNotesRelations: Record<string, string[]>; // categoryId -> noteIds[]
  serviceCoverCharge: number;
  activeLayout: PrintLayout | null;
}

export const useMenuContentData = () => {
  const [data, setData] = useState<MenuContentData>({
    categories: [],
    productsByCategory: {},
    allergens: [],
    categoryNotes: [],
    categoryNotesRelations: {},
    serviceCoverCharge: 0,
    activeLayout: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMenuContentData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch active layout
        const { data: layouts, error: layoutError } = await supabase
          .from('print_layouts')
          .select('*')
          .eq('is_default', true)
          .single();

        if (layoutError) throw layoutError;

        // 2. Fetch active categories
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (categoriesError) throw categoriesError;

        // 3. Fetch all allergens
        const { data: allergens, error: allergensError } = await supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true });

        if (allergensError) throw allergensError;

        // 4. Fetch all active products with their relationships
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            label:label_id(*)
          `)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (productsError) throw productsError;

        // 5. Fetch product-allergen relationships
        const productIds = products?.map(p => p.id) || [];
        const { data: productAllergens, error: productAllergensError } = await supabase
          .from('product_allergens')
          .select('*')
          .in('product_id', productIds);

        if (productAllergensError) throw productAllergensError;

        // 6. Fetch product-feature relationships
        const { data: productFeatures, error: productFeaturesError } = await supabase
          .from('product_to_features')
          .select('*')
          .in('product_id', productIds);

        if (productFeaturesError) throw productFeaturesError;

        // 7. Fetch product features
        const { data: features, error: featuresError } = await supabase
          .from('product_features')
          .select('*')
          .order('display_order', { ascending: true });

        if (featuresError) throw featuresError;

        // 8. Fetch category notes
        const { data: categoryNotes, error: notesError } = await supabase
          .from('category_notes')
          .select('*')
          .order('display_order', { ascending: true });

        if (notesError) throw notesError;

        // 9. Fetch category notes relations
        const { data: notesRelations, error: relationsError } = await supabase
          .from('category_notes_categories')
          .select('*');

        if (relationsError) throw relationsError;

        // 10. Fetch service cover charge
        const { data: serviceCharge, error: serviceError } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'serviceCoverCharge')
          .single();

        if (serviceError && serviceError.code !== 'PGRST116') throw serviceError;

        // 11. Fetch English translations for product descriptions
        const { data: englishTranslations, error: translationsError } = await supabase
          .from('translations')
          .select('*')
          .eq('entity_type', 'products')
          .eq('field', 'description')
          .eq('language', 'en')
          .in('entity_id', productIds);

        if (translationsError) throw translationsError;

        // Create translations map
        const translationsMap = new Map<string, string>();
        englishTranslations?.forEach(translation => {
          if (translation.translated_text) {
            translationsMap.set(translation.entity_id, translation.translated_text);
          }
        });

        // Create allergens map for quick lookup
        const allergensMap = new Map(allergens?.map(a => [a.id, a]) || []);

        // Create product-allergen mapping
        const productAllergenMap = new Map<string, string[]>();
        productAllergens?.forEach(pa => {
          if (!productAllergenMap.has(pa.product_id)) {
            productAllergenMap.set(pa.product_id, []);
          }
          productAllergenMap.get(pa.product_id)!.push(pa.allergen_id);
        });

        // Create features map
        const featuresMap = new Map(features?.map(f => [f.id, f]) || []);

        // Create product-feature mapping
        const productFeatureMap = new Map<string, string[]>();
        productFeatures?.forEach(pf => {
          if (!productFeatureMap.has(pf.product_id)) {
            productFeatureMap.set(pf.product_id, []);
          }
          productFeatureMap.get(pf.product_id)!.push(pf.feature_id);
        });

        // Process data
        const productsByCategory: Record<string, Product[]> = {};
        
        // Group products by category and enrich with features and allergens
        products?.forEach(product => {
          if (!productsByCategory[product.category_id]) {
            productsByCategory[product.category_id] = [];
          }
          
          // Add allergens to product
          const productAllergenIds = productAllergenMap.get(product.id) || [];
          const productAllergensDetails = productAllergenIds
            .map(id => allergensMap.get(id))
            .filter(Boolean) as Allergen[];
          
          // Add features to product
          const productFeatureIds = productFeatureMap.get(product.id) || [];
          const productFeaturesDetails = productFeatureIds
            .map(id => featuresMap.get(id))
            .filter(Boolean) as ProductFeature[];
          
          // Add English description from translations
          const description_en = translationsMap.get(product.id) || null;
          
          productsByCategory[product.category_id].push({
            ...product,
            features: productFeaturesDetails,
            allergens: productAllergensDetails,
            description_en
          });
        });

        // Process category notes relations
        const categoryNotesRelations: Record<string, string[]> = {};
        notesRelations?.forEach(relation => {
          if (!categoryNotesRelations[relation.category_id]) {
            categoryNotesRelations[relation.category_id] = [];
          }
          categoryNotesRelations[relation.category_id].push(relation.note_id);
        });

        // Transform layout data from database format to TypeScript format
        const transformedLayout: PrintLayout | null = layouts ? {
          id: layouts.id,
          name: layouts.name,
          type: layouts.type as 'classic' | 'custom' | 'modern' | 'allergens',
          isDefault: layouts.is_default,
          productSchema: layouts.product_schema as 'schema1',
          elements: layouts.elements as any,
          cover: layouts.cover as any,
          allergens: layouts.allergens as any,
          categoryNotes: layouts.category_notes as any,
          productFeatures: layouts.product_features as any,
          servicePrice: layouts.service_price as any,
          spacing: layouts.spacing as any,
          page: layouts.page as any,
          header: undefined
        } : null;

        setData({
          categories: categories || [],
          productsByCategory,
          allergens: allergens || [],
          categoryNotes: categoryNotes || [],
          categoryNotesRelations,
          serviceCoverCharge: serviceCharge?.value ? Number(serviceCharge.value) : 0,
          activeLayout: transformedLayout
        });

      } catch (err: any) {
        console.error('Error loading menu content data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuContentData();
  }, []);

  return { data, isLoading, error };
};
