
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TranslationField } from "./TranslationField";
import { CopyButton } from "./CopyButton";
import { SupportedLanguage } from "@/types/translation";

interface TranslatableItem {
  id: string;
  title: string;
  description?: string | null;
  type: "categories" | "allergens" | "product_features" | "product_labels";
}

interface TranslationsTableProps {
  items: TranslatableItem[];
  language: SupportedLanguage;
  loading: boolean;
}

export const TranslationsTable: React.FC<TranslationsTableProps> = ({
  items,
  language,
  loading,
}) => {
  if (loading) {
    return <div className="text-center py-8">Caricamento in corso...</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-8">Nessun elemento trovato</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Originale (Italiano)</TableHead>
          <TableHead className="w-2/3">Traduzione</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <TableRow>
              <TableCell className="align-top pt-4 flex items-center gap-2">
                <div className="font-medium">{item.title}</div>
                <CopyButton text={item.title} label="Copia titolo originale" />
              </TableCell>
              <TableCell className="pt-4">
                <TranslationField
                  id={item.id}
                  entityType={item.type}
                  fieldName="title"
                  originalText={item.title}
                  language={language}
                />
              </TableCell>
            </TableRow>

            {/* Riga descrizione SOLO se esiste */}
            {(item.description !== undefined && item.description !== null && item.description !== "") && (
              <TableRow>
                <TableCell className="align-top border-t-0 flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Descrizione: {item.description}
                  </div>
                  <CopyButton text={item.description} label="Copia descrizione originale" />
                </TableCell>
                <TableCell className="border-t-0">
                  <TranslationField
                    id={item.id}
                    entityType={item.type}
                    fieldName="description"
                    originalText={item.description}
                    language={language}
                    multiline
                  />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
