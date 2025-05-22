
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CopyButton } from "./CopyButton";
import { TranslationField } from "./TranslationField";
import { Badge } from "@/components/ui/badge";
import { SupportedLanguage } from "@/types/translation";
import { cn } from "@/lib/utils";

// Props
interface ItemRowConfig {
  label: string;
  fieldName: string;
  original: string;
  translationField?: boolean;
  multiline?: boolean;
  isMissing?: boolean; // necessario per badge/colore evidenza
  badgeType?: "missing" | "outdated";
}
interface TableTranslationLayoutProps {
  title?: string;
  subtitle?: string;
  rows: ItemRowConfig[];
  language: SupportedLanguage;
  entityType: string;
  entityId: string;
  onTranslationSaved?: () => void;
}

export const TableTranslationLayout: React.FC<TableTranslationLayoutProps> = ({
  title,
  subtitle,
  rows,
  language,
  entityType,
  entityId,
  onTranslationSaved,
}) => {
  return (
    <div className="mb-7 border shadow bg-white/90 rounded-lg px-6 py-5">
      {title && (
        <div className="font-bold text-2xl tracking-tight mb-1">{title}</div>
      )}
      {subtitle && (
        <div className="text-muted-foreground mb-5">{subtitle}</div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/5 text-muted-foreground font-semibold text-base">Originale (Italiano)</TableHead>
            <TableHead className="w-3/5 text-muted-foreground font-semibold text-base">Traduzione</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row.fieldName}>
              <TableCell className={cn("align-top whitespace-pre-line", idx !== 0 && "pt-5")}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{row.label}:</span>
                  {row.original && (
                    <>
                      <span className={cn("ml-1", row.translationField ? "" : "text-muted-foreground")}>{row.original}</span>
                      <CopyButton text={row.original} label={`Copia ${row.label} originale`} size={17} />
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className={cn("align-top flex items-start gap-2", idx !== 0 && "pt-5")}>
                {row.translationField ? (
                  <div className="w-full flex flex-col">
                    <div className="flex items-center gap-2">
                      <TranslationField
                        id={entityId}
                        entityType={entityType as any}
                        fieldName={row.fieldName}
                        originalText={row.original || ""}
                        language={language}
                        multiline={row.multiline}
                        onTranslationSaved={onTranslationSaved}
                      />
                      {row.isMissing && row.badgeType && (
                        <Badge variant={row.badgeType === "missing" ? "destructive" : "secondary"}>
                          {row.badgeType === "missing" ? "Manca traduzione" : "Da aggiornare"}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">--</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
