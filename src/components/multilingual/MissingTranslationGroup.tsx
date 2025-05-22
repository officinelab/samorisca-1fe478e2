
import { TableTranslationLayout } from "./TableTranslationLayout";
import { SupportedLanguage } from "@/types/translation";

interface GroupRowConfig {
  label: string;
  fieldName: string;
  original: string;
  translationField: boolean;
  multiline: boolean;
  isMissing: boolean;
  badgeType?: "missing" | "outdated";
}

interface MissingTranslationGroupProps {
  groupKey: string;
  entity: any;
  entityType: string;
  fields: { field: string; badge: "missing" | "outdated" }[];
  language: SupportedLanguage;
}

const principalFields: Record<string, string[]> = {
  products: ["title", "description", "price_suffix", "price_variant_1_name", "price_variant_2_name"],
  categories: ["title", "description"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
};

const translatableFields: Record<string, string[]> = {
  categories: ["title", "description"],
  products: ["title", "description", "price_suffix", "price_variant_1_name", "price_variant_2_name"],
  allergens: ["title", "description"],
  product_features: ["title"],
  product_labels: ["title"],
};

const fieldLabels: Record<string, string> = {
  title: "Nome",
  description: "Descrizione",
  price_suffix: "Suffisso prezzo",
  price_variant_1_name: "Variante 1 nome",
  price_variant_2_name: "Variante 2 nome"
};

export const MissingTranslationGroup = ({
  groupKey,
  entity,
  entityType,
  fields,
  language,
}: MissingTranslationGroupProps) => {
  if (!entity) return null;

  const toBeTranslatedFields = fields.map(f => f.field);
  const badgeMap = Object.fromEntries(fields.map(f => [f.field, f.badge]));
  const rows: GroupRowConfig[] = (principalFields[entityType] || [])
    .filter(fieldName =>
      (translatableFields[entityType] || []).includes(fieldName) &&
      entity[fieldName] !== undefined &&
      entity[fieldName] !== null &&
      (typeof entity[fieldName] !== "string" || entity[fieldName].trim() !== "")
    )
    .map(fieldName => ({
      label: fieldLabels[fieldName] ?? fieldName,
      fieldName,
      original: entity[fieldName] !== undefined && entity[fieldName] !== null ? String(entity[fieldName]) : "",
      translationField: true,
      multiline: fieldName === "description",
      isMissing: toBeTranslatedFields.includes(fieldName),
      badgeType: badgeMap[fieldName],
    }));

  if (rows.length === 0) return null;

  return (
    <TableTranslationLayout
      key={groupKey}
      title={entity.title || "(senza titolo)"}
      subtitle={entity.description || ""}
      rows={rows}
      language={language}
      entityType={entityType}
      entityId={entity.id}
    />
  );
};
