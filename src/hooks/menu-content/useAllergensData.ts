
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Allergen, ProductFeature } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { mapSupabaseToLayout } from '@/hooks/menu-layouts/services/core/layoutTransformer';

export const useAllergensData = () => {
  // Fetch allergens
  const allergensQuery = useQuery({
    queryKey: ['allergens-print'],
    queryFn: async (): Promise<Allergen[]> => {
      console.log('📊 Fetching allergens data...');
      const { data, error } = await supabase
        .from('allergens')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      console.log('✅ Allergens loaded:', data?.length || 0);
      return data || [];
    }
  });

  // Fetch product features
  const productFeaturesQuery = useQuery({
    queryKey: ['product-features-print'],
    queryFn: async (): Promise<ProductFeature[]> => {
      console.log('📊 Fetching product features data...');
      const { data, error } = await supabase
        .from('product_features')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      console.log('✅ Product features loaded:', data?.length || 0);
      return data || [];
    }
  });

  // Fetch active print layout
  const layoutQuery = useQuery({
    queryKey: ['active-print-layout'],
    queryFn: async (): Promise<PrintLayout | null> => {
      console.log('📊 Fetching active print layout...');
      const { data, error } = await supabase
        .from('print_layouts')
        .select('*')
        .eq('is_default', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('⚠️ No default layout found');
          return null;
        }
        throw error;
      }
      
      const layout = mapSupabaseToLayout(data);
      console.log('✅ Active layout loaded:', layout.name);
      return layout;
    }
  });

  return {
    allergens: allergensQuery.data || [],
    productFeatures: productFeaturesQuery.data || [],
    activeLayout: layoutQuery.data,
    isLoading: allergensQuery.isLoading || productFeaturesQuery.isLoading || layoutQuery.isLoading,
    error: allergensQuery.error?.message || productFeaturesQuery.error?.message || layoutQuery.error?.message
  };
};
