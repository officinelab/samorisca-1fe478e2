
import { supabase } from "@/integrations/supabase/client";
import { ProductFeature, ProductLabel } from "@/types/database";

export async function fetchProductFeatures(language: string) {
  const { data: features, error: featErr } = await supabase
    .from('product_features')
    .select('*')
    .order('display_order', { ascending: true });
  if (featErr) throw featErr;
  return features || [];
}

export async function fetchProductLabels(language: string) {
  const { data: labels, error: labErr } = await supabase
    .from('product_labels')
    .select('*')
    .order('display_order', { ascending: true });
  if (labErr) throw labErr;
  return labels || [];
}
