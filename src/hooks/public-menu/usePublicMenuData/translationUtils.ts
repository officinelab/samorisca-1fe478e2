
export const createTranslationsMap = (translationsData: any[]): Map<string, Map<string, string>> => {
  const translationsMap = new Map<string, Map<string, string>>();
  
  translationsData?.forEach((tr: any) => {
    const key = `${tr.entity_type}-${tr.entity_id}`;
    if (!translationsMap.has(key)) {
      translationsMap.set(key, new Map());
    }
    translationsMap.get(key)!.set(tr.field, tr.translated_text);
  });
  
  return translationsMap;
};

export const applyTranslations = (
  entityId: string,
  entityType: string,
  originalValues: Record<string, any>,
  translationsMap: Map<string, Map<string, string>>
): Record<string, any> => {
  const translationKey = `${entityType}-${entityId}`;
  const translations = translationsMap.get(translationKey);
  
  if (!translations) {
    return originalValues;
  }
  
  const result = { ...originalValues };
  translations.forEach((translatedText, field) => {
    if (translatedText && originalValues[field] !== undefined) {
      result[field] = translatedText;
    }
  });
  
  return result;
};
