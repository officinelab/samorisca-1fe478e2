
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TranslationField } from "./TranslationField";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EntityOption {
  value: string;
  label: string;
  type: 'categories' | 'allergens' | 'product_features' | 'product_labels';
}

interface TranslatableItem {
  id: string;
  title: string;
  description?: string | null;
  type: string;
}

const entityOptions: EntityOption[] = [
  { value: 'categories', label: 'Categorie', type: 'categories' },
  { value: 'allergens', label: 'Allergeni', type: 'allergens' },
  { value: 'product_features', label: 'Caratteristiche', type: 'product_features' },
  { value: 'product_labels', label: 'Etichette', type: 'product_labels' },
];

interface GeneralTranslationsTabProps {
  language: SupportedLanguage;
}

export const GeneralTranslationsTab = ({ language }: GeneralTranslationsTabProps) => {
  const [selectedEntityType, setSelectedEntityType] = useState<EntityOption>(entityOptions[0]);
  const [items, setItems] = useState<TranslatableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from(selectedEntityType.type)
          .select('id, title, description')
          .order('display_order', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setItems(data.map(item => ({ 
          ...item, 
          type: selectedEntityType.type 
        })));
      } catch (error) {
        console.error(`Error fetching ${selectedEntityType.label}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [selectedEntityType]);

  const handleEntityTypeChange = (value: string) => {
    const selectedOption = entityOptions.find(option => option.value === value);
    if (selectedOption) {
      setSelectedEntityType(selectedOption);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tipo di contenuto</h3>
            <Select
              value={selectedEntityType.value}
              onValueChange={handleEntityTypeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona tipo" />
              </SelectTrigger>
              <SelectContent>
                {entityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Traduzioni</h3>
            
            {loading ? (
              <div className="text-center py-8">Caricamento in corso...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-8">Nessun elemento trovato</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Originale (Italiano)</TableHead>
                    <TableHead className="w-2/3">Traduzione</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <React.Fragment key={item.id}>
                      <TableRow>
                        <TableCell className="align-top pt-4">
                          <div className="font-medium">{item.title}</div>
                        </TableCell>
                        <TableCell className="pt-4">
                          <TranslationField
                            id={item.id}
                            entityType={item.type}
                            fieldName="title"
                            originalText={item.title}
                            language={language}
                          />
                        </TableCell>
                      </TableRow>
                      
                      {/* If item has description (like allergens), add another row for it */}
                      {item.description && (
                        <TableRow>
                          <TableCell className="align-top border-t-0">
                            <div className="text-sm text-muted-foreground">
                              Descrizione: {item.description}
                            </div>
                          </TableCell>
                          <TableCell className="border-t-0">
                            <TranslationField
                              id={item.id}
                              entityType={item.type}
                              fieldName="description"
                              originalText={item.description}
                              language={language}
                              multiline
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
