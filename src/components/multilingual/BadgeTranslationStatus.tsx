
import React, { useEffect, useState } from "react";
import { CircleX, CircleCheck, CircleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";

type Status = "missing" | "outdated" | "updated" | "loading" | "error";

interface BadgeTranslationStatusProps {
  entityId: string;
  entityType: string;
  fieldName: string;
  language: SupportedLanguage;
}

/**
 * Badge di stato: rosso se manca, arancione se obsoleto, verde se ok.
 */
export const BadgeTranslationStatus: React.FC<BadgeTranslationStatusProps> = ({
  entityId,
  entityType,
  fieldName,
  language
}) => {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    async function fetchStatus() {
      setStatus("loading");

      // Determina che tabella interrogare:
      const baseTable = entityType === "categories" ? "categories" : "products";

      // 1. Ottieni updated_at dalla tabella base (products o categories)
      const { data: baseEntity, error: baseError } = await supabase
        .from(baseTable)
        .select("updated_at")
        .eq("id", entityId)
        .maybeSingle();

      if (!active) return;

      if (baseError || !baseEntity) {
        setStatus("error");
        return;
      }

      // 2. Ottieni last_updated dalla tabella translations
      const { data: translation, error: translationError } = await supabase
        .from("translations")
        .select("last_updated")
        .eq("entity_id", entityId)
        .eq("entity_type", entityType)
        .eq("field", fieldName)
        .eq("language", language)
        .maybeSingle();

      if (!active) return;

      if (translationError || !translation) {
        setStatus("missing");
        return;
      }

      const baseUpdated = baseEntity.updated_at ? Date.parse(baseEntity.updated_at) : 0;
      const translationUpdated = translation.last_updated ? Date.parse(translation.last_updated) : 0;

      if (translationUpdated >= baseUpdated) {
        setStatus("updated");
      } else if (translationUpdated < baseUpdated) {
        setStatus("outdated");
      } else {
        setStatus("error");
      }
    }

    fetchStatus();
    return () => {
      active = false;
    };
  }, [entityId, entityType, fieldName, language]);

  // Badge visuale
  if (status === "loading") {
    return (
      <span className="flex items-center ml-1">
        <span className="w-3 h-3 rounded-full bg-gray-300 animate-pulse" aria-label="Controllo stato..." />
      </span>
    );
  }
  if (status === "missing") {
    return (
      <span className="flex items-center ml-1" title="Traduzione mancante">
        <CircleX className="w-3.5 h-3.5 text-red-600" fill="#ef4444" strokeWidth={2} />
      </span>
    );
  }
  if (status === "outdated") {
    return (
      <span className="flex items-center ml-1" title="Traduzione da aggiornare">
        <CircleAlert className="w-3.5 h-3.5 text-amber-500" fill="#fbbf24" strokeWidth={2} />
      </span>
    );
  }
  if (status === "updated") {
    return (
      <span className="flex items-center ml-1" title="Traduzione aggiornata">
        <CircleCheck className="w-3.5 h-3.5 text-green-600" fill="#22c55e" strokeWidth={2} />
      </span>
    );
  }
  return (
    <span className="flex items-center ml-1" title="Errore nel controllo badge">
      <CircleX className="w-3.5 h-3.5 text-gray-400" />
    </span>
  );
};
