
import { PrintLayout } from "@/types/printLayout";
// Step 1: Import zod ed estendi la validazione
import { z } from "zod";

/**
 * Definizione schema Zod per PrintLayout
 * Esplicita tutti i campi previsti per una validazione completa.
 */
const PrintLayoutElementConfigSchema = z.object({
  visible: z.boolean(),
  fontFamily: z.string().min(1),
  fontSize: z.number().positive(),
  fontColor: z.string().regex(/^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, {
    message: "Il colore deve essere un esadecimale valido (es. #123ABC)",
  }),
  fontStyle: z.enum(["normal", "italic", "bold"]),
  alignment: z.enum(["left", "center", "right"]),
  margin: z.object({
    top: z.number().min(0),
    right: z.number().min(0),
    bottom: z.number().min(0),
    left: z.number().min(0),
  }),
});

const PageMarginsSchema = z.object({
  marginTop: z.number().min(0),
  marginRight: z.number().min(0),
  marginBottom: z.number().min(0),
  marginLeft: z.number().min(0),
});

const PrintLayoutSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["classic", "custom", "modern", "allergens"]),
  isDefault: z.boolean(),
  productSchema: z.enum(["schema1", "schema2", "schema3"]),
  elements: z.object({
    category: PrintLayoutElementConfigSchema,
    title: PrintLayoutElementConfigSchema,
    description: PrintLayoutElementConfigSchema,
    price: PrintLayoutElementConfigSchema,
    allergensList: PrintLayoutElementConfigSchema,
    priceVariants: PrintLayoutElementConfigSchema,
  }),
  cover: z.object({
    logo: z.object({
      maxWidth: z.number().min(0).max(100),
      maxHeight: z.number().min(0).max(100),
      alignment: z.enum(["left", "center", "right"]),
      marginTop: z.number().min(0),
      marginBottom: z.number().min(0),
      visible: z.boolean(),
    }),
    title: PrintLayoutElementConfigSchema,
    subtitle: PrintLayoutElementConfigSchema,
  }),
  allergens: z.object({
    title: PrintLayoutElementConfigSchema,
    description: PrintLayoutElementConfigSchema,
    item: z.object({
      number: PrintLayoutElementConfigSchema,
      title: PrintLayoutElementConfigSchema,
      spacing: z.number().min(0),
      backgroundColor: z.string(),
      borderRadius: z.number().min(0),
      padding: z.number().min(0),
    }),
  }),
  spacing: z.object({
    betweenCategories: z.number().min(0),
    betweenProducts: z.number().min(0),
    categoryTitleBottomMargin: z.number().min(0),
  }),
  page: PageMarginsSchema.extend({
    useDistinctMarginsForPages: z.boolean(),
    oddPages: PageMarginsSchema,
    evenPages: PageMarginsSchema,
  }),
});

/**
 * Valida un layout con lo schema Zod.
 * Lancia errore se la validazione fallisce.
 */
export const validatePrintLayout = (layout: PrintLayout) => {
  const valid = PrintLayoutSchema.safeParse(layout);
  if (!valid.success) {
    // Per debug, stampa errori in modo leggibile
    console.error("PrintLayout validation error:", valid.error.issues);
    throw new Error(
      "Layout non valido. Dettagli:\n" +
        valid.error.issues.map((issue) => `- ${issue.path.join(".")}: ${issue.message}`).join("\n")
    );
  }
  return layout;
};

// Mantiene la funzione precedente per garantire margini coerenti (side-effect sul layout)
import { syncPageMargins, ensureValidMargins } from "../layoutOperations";

/**
 * Ensures that a layout has valid page margins E schema coerente
 */
export const ensureValidPageMargins = (layout: PrintLayout): PrintLayout => {
  // Prima assicurati che i margini siano validi a livello di campo
  const layoutWithValidMargins = ensureValidMargins(layout);

  // Poi sincronizza le proprietà odd/even se serve
  const layoutSynced = syncPageMargins(layoutWithValidMargins);

  // Esegui validazione schema completa (lancia se non valido)
  return validatePrintLayout(layoutSynced);
};

