/**
 * Termini che NON devono mai essere tradotti dai servizi di traduzione
 * del menu (nome del ristorante, cucina/lingua sarda, toponimi, brand).
 *
 * Modificare questa lista per aggiungere/rimuovere termini protetti.
 * La lista viene iniettata nei prompt di OpenAI e Perplexity, e usata
 * come `ignore_tags` su DeepL (wrapping in <keep>...</keep>).
 */
export const PROTECTED_TERMS: string[] = [
  // Nome ristorante / brand
  "Sa Morisca",

  // Piatti e prodotti tipici sardi
  "malloreddus",
  "culurgiones",
  "culurgionis",
  "seadas",
  "sebadas",
  "pane carasau",
  "pane guttiau",
  "carasau",
  "fregola",
  "fregula",
  "porceddu",
  "porcheddu",
  "bottarga",
  "pardulas",
  "pirichittus",
  "su filindeu",
  "filindeu",
  "civraxiu",
  "coccoi",
  "panada",
  "mazzamurru",
  "burrida",
  "fainè",
  "zuppa gallurese",
  "suppa cuata",
  "casu martzu",
  "pecorino sardo",
  "fiore sardo",

  // Vini e liquori sardi
  "mirto",
  "filu 'e ferru",
  "cannonau",
  "vermentino",
  "vernaccia",
  "carignano",
  "monica",
  "nuragus",
];

/**
 * Frase da iniettare nei prompt LLM (OpenAI / Perplexity) per
 * preservare nomi propri e termini in lingua sarda.
 */
export function getProtectedTermsPromptSection(): string {
  const list = PROTECTED_TERMS.map((t) => `"${t}"`).join(", ");
  return `
CRITICAL TRANSLATION RULES (read carefully):

1. You MUST translate every word of the input into the target language, EXCEPT for the small set of "protected terms" listed below. Protected terms are the ONLY words that stay in the original language. All other words — including common Italian words like "fritto", "alla", "con", "del", "di", "piatto", "salsa", etc. — MUST be translated normally.

2. Protected terms (case-insensitive match, keep original spelling and capitalization in the output):
   - The restaurant name "Sa Morisca" (or "SA MORISCA", "sa morisca"): always kept exactly as in the input. Never translate it to "The Morisca", "La Morisca", "Die Morisca", "Le Morisca", etc.
   - Sardinian-language words and names of typical Sardinian dishes, products, wines and liquors. Non-exhaustive list: ${list}.

3. Uppercase formatting is NEVER a reason to skip translation. If the input is in ALL CAPS, translate it and return the result in ALL CAPS too. Capitalization pattern of non-protected words must mirror the input.

4. The "preserve when unsure" rule applies ONLY to a single suspicious word, never to the whole phrase. If one word might be a proper noun or Sardinian, preserve THAT word only and still translate every other word in the sentence.

5. Mandatory worked examples (follow the exact same logic):
   - Input (it): "FRITTO SA MORISCA" → French: "FRITURE SA MORISCA" (translate "FRITTO" → "FRITURE", keep "SA MORISCA", keep ALL CAPS).
   - Input (it): "Fritto Sa Morisca" → English: "Fried Sa Morisca".
   - Input (it): "Malloreddus alla campidanese con salsiccia" → English: "Malloreddus campidanese-style with sausage" (keep "Malloreddus", translate the rest).
   - Input (it): "Risotto del Golfo di Cagliari" → English: "Risotto from the Gulf of Cagliari" (keep "Cagliari", translate "del Golfo di").
   - Input (it): "Sa Morisca" → German: "Sa Morisca" (single protected term, no surrounding words to translate).

Reminder: returning the input unchanged when it contains non-protected words is INCORRECT. Always translate the non-protected portion.`.trim();
}

/**
 * Avvolge le occorrenze dei termini protetti con tag <keep>...</keep>
 * per essere usati con DeepL (`tag_handling=xml`, `ignore_tags=keep`).
 * Match case-insensitive ma il testo originale viene preservato.
 */
export function wrapProtectedTerms(text: string): string {
  let result = text;
  // Ordina per lunghezza decrescente per matchare prima i termini più lunghi
  const sorted = [...PROTECTED_TERMS].sort((a, b) => b.length - a.length);
  for (const term of sorted) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(?<!<keep>)\\b${escaped}\\b(?!</keep>)`, "gi");
    result = result.replace(re, (match) => `<keep>${match}</keep>`);
  }
  return result;
}

/**
 * Rimuove eventuali tag <keep> residui dall'output (DeepL li restituisce).
 */
export function unwrapProtectedTerms(text: string): string {
  return text.replace(/<\/?keep>/gi, "");
}