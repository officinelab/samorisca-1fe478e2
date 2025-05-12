
import { Badge } from "@/components/ui/badge";

interface LabelBadgeProps {
  title: string;
  color?: string | null;
  textColor?: string | null;
  className?: string;
}

// Funzione per determinare il colore del testo più leggibile
export const getContrastTextColor = (bgColor?: string | null) => {
  if (!bgColor) return "#000000";
  
  // Converte il colore esadecimale in RGB
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calcola la luminosità
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Se la luminosità è alta, usa testo scuro, altrimenti chiaro
  return brightness > 128 ? "#000000" : "#FFFFFF";
};

export const LabelBadge = ({ title, color, textColor, className }: LabelBadgeProps) => {
  return (
    <Badge
      className={`font-normal ${className || ''}`}
      style={{
        backgroundColor: color || "#e2e8f0",
        color: textColor || getContrastTextColor(color),
      }}
    >
      {title || "Etichetta"}
    </Badge>
  );
};
