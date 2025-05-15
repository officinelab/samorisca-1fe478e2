
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, AlertCircle } from "lucide-react";

interface TranslationFieldButtonsProps {
  isTranslating: boolean;
  error: string | null;
  disabled: boolean;
  onTranslate: () => void;
  onRetry: () => void;
  tooltip: string;
  buttonLabel: React.ReactNode;
}

export function TranslationFieldButtons({
  isTranslating,
  error,
  disabled,
  onTranslate,
  onRetry,
  tooltip,
  buttonLabel,
}: TranslationFieldButtonsProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={error ? onRetry : onTranslate}
            disabled={isTranslating || disabled}
            className={`whitespace-nowrap ${error ? 'border-amber-500 hover:bg-amber-100' : ''}`}
          >
            {error ? (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Riprova</span>
              </div>
            ) : (
              buttonLabel || <Loader2 className="h-4 w-4 animate-spin" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {error ? 'Riprova la traduzione' : tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
