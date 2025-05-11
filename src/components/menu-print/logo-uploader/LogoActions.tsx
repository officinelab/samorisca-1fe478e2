
import React from "react";
import { Button } from "@/components/ui/button";

interface LogoActionsProps {
  isUploading: boolean;
  hasLogo: boolean;
  onRemove: () => void;
  triggerFileInput: () => void;
}

export const LogoActions: React.FC<LogoActionsProps> = ({
  isUploading,
  hasLogo,
  onRemove,
  triggerFileInput
}) => {
  if (!hasLogo) {
    return null;
  }
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        Cambia Logo
      </Button>
      <Button 
        variant="destructive" 
        size="sm"
        onClick={onRemove}
        disabled={isUploading}
      >
        Rimuovi Logo
      </Button>
    </div>
  );
};

export default LogoActions;
