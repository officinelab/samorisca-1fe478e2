
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

        // 3. Fetch all active products with their relationships
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            label:label_id(*),
            product_allergens(allergen_id),
            product_to_features(feature_id)
          `)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (productsError) throw productsError;

        // 4. Fetch allergens
        const { data: allergens, error: allergensError } = await supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true });

        if (allergensError) throw allergensError;

        // 5. Fetch product features
        const { data: features, error: featuresError } = await supabase
          .from('product_features')
          .select('*')
          .order('display_order', { ascending: true });

        if (featuresError) throw featuresError;

        // 6. Fetch category notes
        const { data: categoryNotes, error: notesError } = await supabase
          .from('category_notes')
          .select('*')
          .order('display_order', { ascending: true });

        if (notesError) throw notesError;

        // 7. Fetch category notes relations
        const { data: notesRelations, error: relationsError } = await supabase
          .from('category_notes_categories')
          .select('*');

        if (relationsError) throw relationsError;

        // 8. Fetch service cover charge
        const { data: serviceCharge, error: serviceError } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'serviceCoverCharge')
          .single();

        if (serviceError && serviceError.code !== 'PGRST116') throw serviceError;

        // Process data
        const productsByCategory: Record<string, Product[]> = {};
        const featuresMap = new Map(features?.map(f => [f.id, f]) || []);
        
        // Group products by category and enrich with features
        products?.forEach(product => {
          if (!productsByCategory[product.category_id]) {
            productsByCategory[product.category_id] = [];
          }
          
          // Add features to product
          const productFeatures = product.product_to_features?.map(ptf => 
            featuresMap.get(ptf.feature_id)
          ).filter(Boolean) as ProductFeature[];
          
          productsByCategory[product.category_id].push({
            ...product,
            features: productFeatures
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
