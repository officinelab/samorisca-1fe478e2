
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";

export async function fetchAllergens(language: string) {
  const { data: allergensData, error: allergensError } = await supabase.from('allergens').select('*').order('number', { ascending: true });
  if (allergensError) throw allergensError;

  let allergenTranslations: Record<string, any[]> = {};
  if (allergensData && allergensData.length > 0 && language !== 'it') {
    const { data: allergenTrans } = await supabase.from('translations')
      .select('*')
      .in('entity_id', allergensData.map(a => a.id))
      .eq('entity_type', 'allergens')
      .eq('language', language);
    (allergenTrans || []).forEach(tr => {
      if (!allergenTranslations[tr.entity_id]) allergenTranslations[tr.entity_id] = [];
      allergenTranslations[tr.entity_id].push(tr);
    });
  }

  return (allergensData || []).map(allergen => {
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
