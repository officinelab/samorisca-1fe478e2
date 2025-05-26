
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultOpen = false,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("border rounded-lg shadow-sm", className)}
    >
      <div className={cn("flex items-center justify-between px-4 py-3 bg-muted/50", headerClassName)}>
        <h3 className="font-medium">{title}</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="sr-only">{isOpen ? "Chiudi" : "Apri"} sezione</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className={cn("p-4", contentClassName)}>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSection;
