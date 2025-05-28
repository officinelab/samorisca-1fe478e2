
import React, { useEffect, useState } from "react";
import { CircleX, CircleCheck, CircleAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";

type Status = "missing" | "outdated" | "updated" | "loading" | "error";

// Refined type: all entities for this badge must have id and updated_at
type EntityWithUpdatedAt = { updated_at: string };

interface BadgeTranslationStatusProps {
  entityId: string;
  entityType: "products" | "categories" | "allergens" | "product_features" | "product_labels";
  fieldName: string;
  language: SupportedLanguage;
  refreshKey?: number;
}

/**
 * Badge che mostra lo stato della traduzione:
 * Rosso: traduzione mancante
 * Arancione: traduzione obsoleta
 * Verde: traduzione aggiornata
 * Grigio: errore
 */
export const BadgeTranslationStatus: React.FC<BadgeTranslationStatusProps> = ({
  entityId,
  entityType,
  fieldName,
  language,
  refreshKey
}) => {
  const [status, setStatus] = useState<Status>("loading");

  const fetchStatus = async () => {
    setStatus("loading");
    let updatedAt: string | null = null;

    let sourceTable = null;
    if (
      entityType === "products" ||
      entityType === "categories" ||
      entityType === "allergens" ||
      entityType === "product_features" ||
      entityType === "product_labels"
    ) {
      sourceTable = entityType;
    }
    if (!sourceTable) {
      setStatus("error");
      return;
    }

    // Add query select type explicitly
    const { data: entity, error } = await supabase
      .from(sourceTable)
      .select("updated_at")
      .eq("id", entityId)
      .maybeSingle<EntityWithUpdatedAt>();

    if (error || !entity) {
      setStatus("error");
      return;
    }
    updatedAt = entity.updated_at;

    // Fetch traduzione dalla tabella centralized translations
    const { data: translation, error: translationError } = await supabase
      .from("translations")
      .select("last_updated")
      .eq("entity_id", entityId)
      .eq("entity_type", entityType)
      .eq("field", fieldName)
      .eq("language", language)
      .maybeSingle();

    if (!translation || translationError) {
      setStatus("missing");
      return;
    }

    const entityUpdated = updatedAt ? new Date(updatedAt).getTime() : 0;
    const translationUpdated = translation.last_updated ? new Date(translation.last_updated).getTime() : 0;

    if (translationUpdated >= entityUpdated) {
      setStatus("updated");
    } else if (translationUpdated < entityUpdated) {
      setStatus("outdated");
    } else {
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [entityId, entityType, fieldName, language, refreshKey]);

  // Aggiungiamo un listener per l'evento globale di refresh
  useEffect(() => {
    const handleRefresh = () => {
      console.log(`[BadgeTranslationStatus] Received refresh event for ${entityType}:${entityId}:${fieldName}`);
      fetchStatus();
    };

    window.addEventListener("refresh-translation-status", handleRefresh);
    
    return () => {
      window.removeEventListener("refresh-translation-status", handleRefresh);
    };
  }, [entityId, entityType, fieldName, language]);

  // Badge UI
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
