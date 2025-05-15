
import React, { useEffect, useState } from "react";
import { CircleX, CircleCheck, CircleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";

type Status = "missing" | "outdated" | "updated" | "loading" | "error";

interface BadgeTranslationStatusProps {
  entityId: string;
  entityType: string; // può essere "products", "categories", ecc.
  fieldName: string;
  language: SupportedLanguage;
}

/**
 * Badge che mostra lo stato della traduzione:
 * - Rosso: traduzione mancante
 * - Arancione: traduzione obsoleta
 * - Verde: traduzione aggiornata
 */
export const BadgeTranslationStatus: React.FC<BadgeTranslationStatusProps> = ({
  entityId,
  entityType,
  fieldName,
  language,
}) => {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let active = true;
    async function fetchStatus() {
      setStatus("loading");

      // Decidi quale tabella interrogare
      let updatedAt: string | null = null;

      if (entityType === "products" || entityType === "categories") {
        const { data: entity, error } = await supabase
          .from(entityType)
          .select("updated_at")
          .eq("id", entityId)
          .maybeSingle();

        if (!active) return;

        if (error || !entity) {
          setStatus("error");
          return;
        }
        updatedAt = entity.updated_at;
      } else {
        console.warn(`BadgeTranslationStatus: entityType non supportato (${entityType})`);
        setStatus("error");
        return;
      }

      // Prende last_updated dalla tabella translations
      const { data: translation, error: translationError } = await supabase
        .from("translations")
        .select("last_updated")
        .eq("entity_id", entityId)
        .eq("entity_type", entityType)
        .eq("field", fieldName)
        .eq("language", language)
        .maybeSingle();

      if (!active) return;

      // Traduzione mancante?
      if (!translation || translationError) {
        setStatus("missing");
        return;
      }

      // Confronto robusto dei timestamp: verde anche se i valori coincidono esattamente
      const entityUpdated = updatedAt ? new Date(updatedAt).getTime() : 0;
      const translationUpdated = translation.last_updated ? new Date(translation.last_updated).getTime() : 0;

      if (translationUpdated >= entityUpdated) {
        // Traduzione aggiornata, anche se le date coincidono
        setStatus("updated");
      } else if (translationUpdated < entityUpdated) {
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

  // Badge grafico
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
