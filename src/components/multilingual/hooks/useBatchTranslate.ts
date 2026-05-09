import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";
import { useTranslationService } from "@/hooks/translation";
import { toast } from "@/components/ui/use-toast";

export type BatchEntityType =
  | "categories"
  | "allergens"
  | "product_features"
  | "product_labels"
  | "category_notes"
  | "products";

export interface BatchJob {
  entityType: BatchEntityType;
  entityId: string;
  fieldName: string;
  originalText: string;
}

async function checkIfNeedsTranslation(
  entityType: BatchEntityType,
  entityId: string,
  fieldName: string,
  language: SupportedLanguage
): Promise<boolean> {
  try {
    const { data: entity } = await supabase
      .from(entityType as any)
      .select("updated_at")
      .eq("id", entityId)
      .single();

    const { data: translation } = await supabase
      .from("translations")
      .select("last_updated")
      .eq("entity_id", entityId)
      .eq("entity_type", entityType)
      .eq("field", fieldName)
      .eq("language", language)
      .maybeSingle();

    if (!translation) return true;
    const eUp = (entity as any)?.updated_at
      ? new Date((entity as any).updated_at).getTime()
      : 0;
    const tUp = translation.last_updated
      ? new Date(translation.last_updated).getTime()
      : 0;
    return tUp < eUp;
  } catch (e) {
    console.error("checkIfNeedsTranslation error", e);
    return true;
  }
}

export const useBatchTranslate = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const { translateText, getServiceName } = useTranslationService();

  const translateFields = async (
    jobs: BatchJob[],
    language: SupportedLanguage,
    options?: { skipFreshnessCheck?: boolean; label?: string }
  ) => {
    if (jobs.length === 0) return;
    setIsTranslating(true);
    const serviceName = getServiceName();
    const total = jobs.length;
    let done = 0;
    let ok = 0;
    let skipped = 0;
    let failed = 0;

    toast({
      title: "Traduzione in corso",
      description: `Inizio traduzione di ${total} ${
        options?.label ?? "campi"
      } con ${serviceName}...`,
    });

    try {
      for (const job of jobs) {
        if (!job.originalText || !job.originalText.trim()) {
          done++;
          continue;
        }
        const need =
          options?.skipFreshnessCheck ||
          (await checkIfNeedsTranslation(
            job.entityType,
            job.entityId,
            job.fieldName,
            language
          ));
        if (!need) {
          skipped++;
        } else {
          try {
            const res = await translateText(
              job.originalText,
              language,
              job.entityId,
              job.entityType,
              job.fieldName
            );
            if (res?.success) ok++;
            else failed++;
          } catch (e) {
            console.error("translateText failed", e);
            failed++;
          }
        }
        done++;
        if (done % 3 === 0 || done === total) {
          toast({
            title: "Traduzione in corso",
            description: `Completati ${done} di ${total} con ${serviceName}...`,
          });
        }
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("refresh-translation-status"));
      }

      toast({
        title: "Traduzione completata",
        description: `Tradotti ${ok} campi, ${skipped} saltati${
          failed ? `, ${failed} falliti` : ""
        } (${serviceName}).`,
      });
    } catch (e) {
      console.error("Batch translate error", e);
      toast({
        variant: "destructive",
        title: "Errore di traduzione",
        description: "Si è verificato un errore durante la traduzione automatica.",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  return { isTranslating, translateFields };
};