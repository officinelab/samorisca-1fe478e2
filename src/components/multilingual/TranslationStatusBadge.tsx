
import React from "react";

type TranslationStatus = "missing" | "outdated" | "updated";

interface TranslationStatusBadgeProps {
  status: TranslationStatus;
}

const statusColor: Record<TranslationStatus, string> = {
  missing: "#ea384c",    // Rosso
  outdated: "#F97316",   // Arancione
  updated: "#62bc60"     // Verde acceso (più leggibile di #F2FCE2 che rischia di sparire su bianco)
};

const statusTitle: Record<TranslationStatus, string> = {
  missing: "Traduzione mancante",
  outdated: "Traduzione da aggiornare",
  updated: "Traduzione aggiornata"
};

export const TranslationStatusBadge: React.FC<TranslationStatusBadgeProps> = ({ status }) => (
  <span
    title={statusTitle[status]}
    style={{
      display: "inline-block",
      marginLeft: 8,
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: statusColor[status],
      border: "1px solid #ddd",
      verticalAlign: "middle"
    }}
    aria-label={statusTitle[status]}
  />
);
