
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PrintLayout } from "@/types/printLayout";
import { Category } from "@/types/database";
import { X, Plus, FileBreak } from "lucide-react";

interface PageBreaksTabProps {
  layout: PrintLayout;
  categories: Category[];
  onPageBreaksChange: (categoryIds: string[]) => void;
}

const PageBreaksTab: React.FC<PageBreaksTabProps> = ({
  layout,
  categories,
  onPageBreaksChange
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>("");
  
  const currentPageBreaks = layout.pageBreaks?.categoryIds || [];
  
  // Filtra le categorie disponibili (esclude quelle già selezionate)
  const availableCategories = categories.filter(cat => 
    !currentPageBreaks.includes(cat.id)
  );
  
  const handleAddPageBreak = () => {
    if (selectedCategoryId && !currentPageBreaks.includes(selectedCategoryId)) {
      const newPageBreaks = [...currentPageBreaks, selectedCategoryId];
      onPageBreaksChange(newPageBreaks);
      setSelectedCategoryId("");
    }
  };
  
  const handleRemovePageBreak = (categoryId: string) => {
    const newPageBreaks = currentPageBreaks.filter(id => id !== categoryId);
    onPageBreaksChange(newPageBreaks);
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.title || 'Categoria non trovata';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <FileBreak className="w-5 h-5" />
          Interruzioni di Pagina
        </h3>
        <p className="text-sm text-muted-foreground">
          Seleziona le categorie dopo le quali inserire un'interruzione di pagina. 
          La categoria successiva inizierà automaticamente dalla pagina seguente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aggiungi Interruzione</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="category-select">Seleziona categoria</Label>
              <Select 
                value={selectedCategoryId} 
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Scegli una categoria..." />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAddPageBreak}
              disabled={!selectedCategoryId}
              className="mt-6"
            >
              <Plus className="w-4 h-4 mr-1" />
              Aggiungi
            </Button>
          </div>
          
          {availableCategories.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Tutte le categorie hanno già un'interruzione di pagina configurata.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Interruzioni Configurate</CardTitle>
        </CardHeader>
        <CardContent>
          {currentPageBreaks.length > 0 ? (
            <div className="space-y-2">
              {currentPageBreaks.map(categoryId => (
                <div 
                  key={categoryId}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileBreak className="w-4 h-4 text-primary" />
                    <span className="font-medium">{getCategoryName(categoryId)}</span>
                    <Badge variant="secondary" className="text-xs">
                      Interruzione dopo l'ultima voce
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePageBreak(categoryId)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Nessuna interruzione di pagina configurata.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Come funzionano le interruzioni di pagina</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• L'interruzione viene applicata <strong>dopo l'ultimo prodotto</strong> della categoria selezionata</li>
          <li>• La categoria successiva inizierà automaticamente dalla <strong>pagina seguente</strong></li>
          <li>• Le interruzioni sono applicate sia nell'anteprima che nel PDF finale</li>
          <li>• L'ordine delle interruzioni segue l'ordine delle categorie nel menu</li>
        </ul>
      </div>
    </div>
  );
};

export default PageBreaksTab;
