
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Info, FileText } from "lucide-react";
import { Category } from '@/types/database';
import { PageBreaksConfig } from '@/types/printLayout';

interface PageBreaksTabProps {
  pageBreaks: PageBreaksConfig;
  categories: Category[];
  onPageBreaksChange: (categoryId: string, checked: boolean) => void;
}

const PageBreaksTab: React.FC<PageBreaksTabProps> = ({
  pageBreaks,
  categories,
  onPageBreaksChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Interruzioni di Pagina
          </CardTitle>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Seleziona le categorie dopo le quali inserire un'interruzione di pagina. 
              La categoria successiva inizierà automaticamente dalla pagina seguente.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categorie con Interruzione di Pagina</Label>
            
            {categories.length === 0 ? (
              <div className="text-sm text-muted-foreground p-4 border rounded-lg">
                Nessuna categoria disponibile. Crea delle categorie nel menu per poter configurare le interruzioni di pagina.
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {categories
                  .filter(cat => cat.is_active)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pagebreak-${category.id}`}
                        checked={pageBreaks.categoryIds.includes(category.id)}
                        onCheckedChange={(checked) => 
                          onPageBreaksChange(category.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`pagebreak-${category.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {category.title}
                      </Label>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
          
          {pageBreaks.categoryIds.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Categorie selezionate:</strong> {pageBreaks.categoryIds.length}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Ogni categoria selezionata forzerà l'inizio di una nuova pagina per la categoria successiva.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageBreaksTab;
