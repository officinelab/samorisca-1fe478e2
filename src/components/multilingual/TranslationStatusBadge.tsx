
import React from "react";

interface TranslationStatusBadgeProps {
  status: "missing" | "outdated" | "updated";
}

export const statusColors = {
  missing: "bg-red-500",
  outdated: "bg-amber-400",
  updated: "bg-green-500",
};

export const statusTitles = {
  missing: "Traduzione mancante",
  outdated: "Traduzione da aggiornare",
  updated: "Traduzione aggiornata",
};

const TranslationStatusBadge: React.FC<TranslationStatusBadgeProps> = ({ status }) => (
  <span
    className={`inline-block w-3.5 h-3.5 rounded-full align-middle border border-white shadow ${statusColors[status]}`}
    title={statusTitles[status]}
    aria-label={statusTitles[status]}
    data-testid={`status-badge-${status}`}
  />
);

export default TranslationStatusBadge;
