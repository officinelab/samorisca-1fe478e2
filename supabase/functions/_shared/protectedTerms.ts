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
  "panadine",
  "mazzamurru",
  "burrida",
  "fainè",
  "zuppa gallurese",
  "suppa cuata",
  "casu martzu",
  "pecorino sardo",
  "fiore sardo",
  "guanciale",
  "ricotta mustia",
  "mustia",
  "scabecciu",
  "carnaroli",

  // Toponimi sardi / nomi propri geografici
  "Sardegna",
  "Sardo",
  "Sarda",
  "Cagliari",
  "Villacidro",
  "Campidanese",
  "Gallurese",

  // Marchi di qualità
  "DOP",
  "IGP",
  "Mozzarella di Bufala Campana DOP",

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
CRITICAL TRANSLATION RULES (read carefully — these override every other instruction):

1. TRANSLATE EVERYTHING. You MUST translate every single word of the input into the target language, EXCEPT for the small CLOSED set of "protected terms" listed in rule 3. Common Italian words — including ingredients ("vongole", "calamari", "gamberi", "polpo", "muggine", "astice", "cozze", "seppia", "tonno", "branzino", "orata", "salsiccia", "pomodorini", "zucchine", "melanzane", "funghi"), preparations ("fritto", "fritta", "frittura", "grigliato", "arrosto", "alla griglia", "al forno", "crudo", "cotto", "ripieno"), and connectors ("di", "del", "della", "alla", "con", "e", "in", "su") — are NOT protected and MUST always be translated.

2. NO "FAMOUS DISH" LOOPHOLE. The ONLY phrases that may stay in Italian are those literally listed in rule 3 (protected terms) plus this CLOSED whitelist of universally accepted Italian dish names: "Tiramisù", "Bruschetta", "Carbonara", "Cacio e Pepe", "Amatriciana", "Pizza Margherita", "Pesto alla Genovese", "Risotto" (only as the dish-head noun, e.g. "Risotto allo zafferano" → keep the word "Risotto"), "Spaghetti", "Linguine", "Tagliatelle", "Ravioli", "Gnocchi", "Lasagne", "Penne", "Rigatoni", "Pappardelle", "Tortellini", "Pasta", "Mozzarella", "Burrata", "Parmigiano", "Prosciutto" (the bare word only). Anything not in this list and not in rule 3 MUST be translated. NEVER invent additional "famous dishes".

3. PROTECTED TERMS (case-insensitive match, keep original spelling and capitalization in the output): the restaurant name "Sa Morisca", Sardinian-language words, names of typical Sardinian dishes/products/wines/liquors, Sardinian toponyms, and DOP/IGP marks. Reference list: ${list}.

4. COMPOSITION RULE — "PROTECTED TERM + di/della/del + X". When a protected term is followed by a modifier (e.g. "Bottarga di Muggine", "Salsiccia di Villacidro", "Pecorino di Sardegna"), keep the protected term but TRANSLATE the modifier into the idiomatic form of the target language:
   - German: form a compound with hyphen, modifier first, term last. "Bottarga di Muggine" → "Meeräschen-Bottarga". "Salsiccia di Villacidro" → "Wurst aus Villacidro". The Italian preposition "di" MUST disappear.
   - English: "<modifier> <term>" or "<term> from <Place>". "Bottarga di Muggine" → "Mullet Bottarga". "Salsiccia di Villacidro" → "Villacidro sausage".
   - French: "<term> de <modifier>". "Bottarga di Muggine" → "Bottarga de muge".
   - Spanish: "<term> de <modifier>". "Bottarga di Muggine" → "Bottarga de mújol".
   NEVER leave Italian prepositions ("di", "del", "della", "alla") in the output when surrounding words have been translated. Output text containing "von Muggine", "de Muggine" with the Italian word "Muggine" untranslated is INCORRECT — the fish name itself must also be translated (Muggine = Meeräsche / mullet / muge / mújol).

5. UPPERCASE is NEVER a reason to skip translation. ALL CAPS input → ALL CAPS translated output. Capitalization pattern of non-protected words must mirror the input.

6. The "preserve when unsure" rule applies ONLY to a single suspicious word, never to a whole phrase.

7. MANDATORY WORKED EXAMPLES (these are real cases — reproduce the same logic):
   - Input "Spaghetti Vongole e Bottarga di Muggine."
     • German CORRECT: "Spaghetti mit Venusmuscheln und Meeräschen-Bottarga."
     • German WRONG: "Spaghetti Vongole und Bottarga von Muggine." ← "Vongole" and "Muggine" left in Italian, "di" half-translated.
     • English CORRECT: "Spaghetti with Clams and Mullet Bottarga."
   - Input "Frittura di Calamari, Gamberi, Tentacoli di Polpo, accompagnati da maionese al lime"
     • German CORRECT: "Frittierte Calamari, Garnelen, Oktopustentakel, begleitet von Limettenmayonnaise"
     • German WRONG: "Frittura von Calamari, Garnelen, Tentakeln von Oktopus…" ← "Frittura" must become "Frittierte/Frittiertes".
   - Input "Salsiccia sarda di Villacidro"
     • German CORRECT: "Sardische Wurst aus Villacidro" (keep "Villacidro" and the protected adjective "sarda" stays as a translated equivalent; "Salsiccia" → "Wurst").
     • German WRONG: "Salsiccia sarda di Villacidro" ← unchanged.
   - Input "RISOTTO ZAFFERANO E GAMBERI"
     • German CORRECT: "SAFRAN-RISOTTO MIT GARNELEN" (keep "Risotto" — whitelisted dish-head, translate the rest, keep ALL CAPS).
   - Input "FRITTO SA MORISCA" → French CORRECT: "FRITURE SA MORISCA".
   - Input "Malloreddus alla campidanese con salsiccia" → English CORRECT: "Malloreddus campidanese-style with sausage".
   - Input "Sa Morisca" → German CORRECT: "Sa Morisca".

8. FINAL CHECK before responding: scan your output for any Italian word that is NOT in rule 2's whitelist or rule 3's protected list. If you find one, translate it. Returning the input unchanged or with Italian ingredient names still inside is INCORRECT.`.trim();
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