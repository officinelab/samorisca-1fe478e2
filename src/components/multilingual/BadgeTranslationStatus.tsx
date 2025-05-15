
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
 * Questo componente mostra un piccolo badge colorato che rappresenta lo stato della traduzione:
 * - Rosso: la traduzione non esiste (missing)
 * - Arancione: traduzione obsoleta (outdated)
 * - Verde: traduzione aggiornata (updated)
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

      // 1. Prendi updated_at dalla tabella products 
      // 2. Prendi last_updated dalla tabella translations per la lingua richiesta

      const { data: product, error: productError } = await supabase
        .from("products")
        .select("updated_at")
        .eq("id", entityId)
        .maybeSingle();

      if (!active) return;

      if (productError || !product) {
        setStatus("error");
        return;
      }

      const { data: translation, error: translationError } = await supabase
        .from("translations")
        .select("last_updated")
        .eq("entity_id", entityId)
        .eq("entity_type", entityType)
        .eq("field", fieldName)
        .eq("language", language)
        .maybeSingle();

      if (!active) return;

      // Se non esiste traduzione → missing (rosso)
      if (!translation || translationError) {
        setStatus("missing");
        return;
      }

      const productUpdated = product.updated_at ? Date.parse(product.updated_at) : 0;
      const translationUpdated = translation.last_updated ? Date.parse(translation.last_updated) : 0;

      if (translationUpdated >= productUpdated) {
        setStatus("updated");      // Verde
      } else if (translationUpdated < productUpdated) {
        setStatus("outdated");    // Arancione
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

