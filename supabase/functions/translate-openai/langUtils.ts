
/**
 * Utility per conversione codici lingua in nomi estesi.
 */
export function mapLanguageCode(code: string): string {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish',
  };
  return languageNames[code] || 'English';
}
