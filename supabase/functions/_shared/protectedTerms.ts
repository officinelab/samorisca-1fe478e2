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
- NEVER translate proper nouns: restaurant names, brand names, people, streets, towns, regions. In particular "Sa Morisca" (the restaurant name) MUST always be kept exactly as "Sa Morisca", with the same capitalization and spacing, in every target language. Do not turn it into "The Morisca", "La Morisca", "Die Morisca" or similar.
- NEVER translate words from the Sardinian language or names of typical Sardinian dishes, products, wines and liquors. They must stay identical to the original (same spelling, same capitalization). A non-exhaustive list of protected terms: ${list}.
- If a Sardinian dish name is followed by a description (e.g. "Malloreddus alla campidanese con salsiccia"), keep the dish name unchanged and translate ONLY the descriptive part.
- If you are not sure whether a word is a proper noun or a Sardinian term, PRESERVE it as-is rather than translating it.`.trim();
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