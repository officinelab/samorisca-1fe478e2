
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SaveLayoutSectionProps {
  onSave: () => void;
  validationError: string | null;
}

const SaveLayoutSection: React.FC<SaveLayoutSectionProps> = ({
  onSave,
  validationError
}) => {
  return (
    <div className="space-y-4">
      {validationError && (
        <Alert variant="destructive">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="p-4">
          <Button 
            onClick={onSave} 
            className="w-full"
            size="lg"
          >
            Salva Layout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaveLayoutSection;
