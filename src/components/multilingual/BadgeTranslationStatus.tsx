
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, BadgeAlert, BadgeX } from "lucide-react";

type StatusType = "missing" | "outdated" | "upToDate";

interface BadgeTranslationStatusProps {
  status: StatusType;
}

export const BadgeTranslationStatus = ({ status }: BadgeTranslationStatusProps) => {
  if (status === "missing") {
    return (
      <Badge variant="destructive" className="flex gap-1 items-center" title="Da tradurre">
        <BadgeX className="h-3 w-3" /> <span className="hidden md:inline">Da tradurre</span>
      </Badge>
    );
  }

  if (status === "outdated") {
    return (
      <Badge className="bg-orange-500 text-white flex gap-1 items-center" title="Non aggiornata">
        <BadgeAlert className="h-3 w-3" /> <span className="hidden md:inline">Da aggiornare</span>
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-green-600 text-white flex gap-1 items-center" title="Aggiornata">
      <BadgeCheck className="h-3 w-3" /> <span className="hidden md:inline">Aggiornata</span>
    </Badge>
  );
};
