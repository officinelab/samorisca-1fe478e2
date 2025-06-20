
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Allergen, ProductFeature } from '@/types/database';
import { PrintLayout } from '@/types/printLayout';
import { mapSupabaseToLayout } from '@/hooks/menu-layouts/services/core/layoutTransformer';

interface AllergensData {
  allergens: Allergen[];
  productFeatures: ProductFeature[];
  activeLayout: PrintLayout | null;
  isLoading: boolean;
  error: string | null;
}

export const useAllergensData = (): AllergensData => {
  // Fetch allergens
  const { data: allergens = [], isLoading: allergensLoading, error: allergensError } = useQuery({
    queryKey: ['allergens'],
    queryFn: async () => {
      console.log('📊 Fetching allergens data...');
      const { data, error } = await supabase
        .from('allergens')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching allergens:', error);
        throw error;
      }

      console.log('✅ Allergens loaded:', data?.length || 0);
      return data || [];
    },
  });

  // Fetch product features
  const { data: productFeatures = [], isLoading: featuresLoading, error: featuresError } = useQuery({
    queryKey: ['product-features'],
    queryFn: async () => {
      console.log('📊 Fetching product features data...');
      const { data, error } = await supabase
        .from('product_features')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching product features:', error);
        throw error;
      }

      console.log('✅ Product features loaded:', data?.length || 0);
      return data || [];
    },
  });

  // Fetch active layout
  const { data: activeLayout = null, isLoading: layoutLoading, error: layoutError } = useQuery({
    queryKey: ['print-layouts', 'active'],
    queryFn: async () => {
      console.log('📊 Fetching active print layout...');
      const { data, error } = await supabase
        .from('print_layouts')
        .select('*')
        .eq('is_default', true)
        .single();

      if (error) {
        console.error('❌ Error fetching active layout:', error);
        throw error;
      }

      console.log('✅ Active layout loaded:', data?.name);
      
      // Use the existing transformer to properly handle the data types
      if (data) {
        return mapSupabaseToLayout(data);
      }
      
      return null;
    },
  });

  const isLoading = allergensLoading || featuresLoading || layoutLoading;
  const error = allergensError?.message || featuresError?.message || layoutError?.message || null;

  return {
    allergens,
    productFeatures,
    activeLayout,
    isLoading,
    error
  };
};
