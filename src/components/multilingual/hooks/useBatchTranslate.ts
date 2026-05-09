import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";
import { useTranslationService } from "@/hooks/translation";
import { toast } from "@/components/ui/use-toast";
import { checkRemainingTokens } from "@/hooks/translation/api/tokenManager";
import { BatchPhase, BatchProgress } from "../BatchTranslateDialog";

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

interface PrepareOptions {
  skipFreshnessCheck?: boolean;
  label?: string;
}

const initialProgress: BatchProgress = { done: 0, ok: 0, skipped: 0, failed: 0 };

export const useBatchTranslate = () => {
  const { translateText, getServiceName } = useTranslationService();

  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<BatchPhase>("confirm");
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [language, setLanguage] = useState<SupportedLanguage | null>(null);
  const [tokensRemaining, setTokensRemaining] = useState<number | null>(null);
  const [progress, setProgress] = useState<BatchProgress>(initialProgress);
  const [label, setLabel] = useState<string>("campi");
  const optionsRef = useRef<PrepareOptions>({});
  const abortedRef = useRef(false);

  const isTranslating = phase === "running";

  const prepare = async (
    rawJobs: BatchJob[],
    lang: SupportedLanguage,
    options?: PrepareOptions
  ) => {
    const filtered = rawJobs.filter(
      (j) => j.originalText && j.originalText.trim().length > 0
    );
    optionsRef.current = options ?? {};
    setLabel(options?.label ?? "campi");
    setJobs(filtered);
    setLanguage(lang);
    setProgress(initialProgress);
    setPhase("confirm");
    abortedRef.current = false;
    setOpen(true);
    const remaining = await checkRemainingTokens();
    setTokensRemaining(remaining);
  };

  const close = () => {
    if (phase === "running") return;
    setOpen(false);
    setJobs([]);
    setProgress(initialProgress);
    setPhase("confirm");
  };

  const abort = () => {
    abortedRef.current = true;
  };

  const confirm = async () => {
    if (!language || jobs.length === 0) return;
    const serviceName = getServiceName();
    const total = jobs.length;
    abortedRef.current = false;
    setProgress(initialProgress);
    setPhase("running");

    let done = 0;
    let ok = 0;
    let skipped = 0;
    let failed = 0;

    try {
      for (const job of jobs) {
        if (abortedRef.current) break;

        const need =
          optionsRef.current.skipFreshnessCheck ||
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
        setProgress({ done, ok, skipped, failed });
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("refresh-translation-status"));
        window.dispatchEvent(new CustomEvent("refresh-tokens"));
      }

      toast({
        title: abortedRef.current
          ? "Traduzione interrotta"
          : "Traduzione completata",
        description: `Tradotti ${ok} ${label}, ${skipped} saltati${
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
      setPhase("done");
    }
  };

  return {
    // dialog state
    open,
    setOpen,
    phase,
    progress,
    totalJobs: jobs.length,
    tokensRemaining,
    label,
    // actions
    prepare,
    confirm,
    abort,
    close,
    // legacy
    isTranslating,
  };
};