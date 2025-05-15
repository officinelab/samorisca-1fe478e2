
import React from "react";
import { BadgeCheck, BadgeAlert, BadgeX } from "lucide-react";

type BadgeStatus = "missing" | "outdated" | "upToDate";

interface BadgeTranslationStatusProps {
  status: BadgeStatus;
}

export const BadgeTranslationStatus: React.FC<BadgeTranslationStatusProps> = ({ status }) => {
  let color = "";
  let title = "";
  let icon = null;
  switch (status) {
    case "missing":
      color = "#ea384c";
      title = "Traduzione mancante";
      icon = <BadgeX size={14} color="#ea384c" />;
      break;
    case "outdated":
      color = "#F97316";
      title = "Traduzione obsoleta/da aggiornare";
      icon = <BadgeAlert size={14} color="#F97316" />;
      break;
    case "upToDate":
      color = "#4cb050";
      title = "Traduzione aggiornata";
      icon = <BadgeCheck size={14} color="#4cb050" />;
      break;
  }

  return (
    <span title={title} className="ml-2 inline-flex items-center">
      <span
        className="w-3 h-3 rounded-full border border-white shadow"
        style={{ background: color, display: 'inline-block' }}
      ></span>
      <span className="sr-only">{title}</span>
      <span className="ml-1">{icon}</span>
    </span>
  );
};
