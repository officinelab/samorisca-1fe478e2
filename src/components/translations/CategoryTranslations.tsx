
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  useTranslationService, 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES 
} from "@/hooks/translations/useTranslationService";

interface CategoryTranslationsProps {
  onTranslationComplete: () => void;
}

const CategoryTranslations = ({ onTranslationComplete }: CategoryTranslationsProps) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [translatingCategory, setTranslatingCategory] = useState<string | null>(null);
  
  const { 
    isLoading: isTranslating, 
    translateText, 
    saveTranslation, 
    checkTranslationStatus 
  } = useTranslationService();
  
  // Carica le categorie
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      for (const category of data || []) {
        await checkTranslationsStatus(category);
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Errore nel caricamento delle categorie:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare le categorie.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Controlla lo stato delle traduzioni per una categoria
  const checkTranslationsStatus = async (category: any) => {
    category.translationStatus = {};
    
    for (const lang of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      // Controlla la traduzione del titolo
      const titleStatus = await checkTranslationStatus(
        'category',
        category.id,
        'title',
        lang,
        category.title
      );
      
      // Controlla la traduzione della descrizione (se esiste)
      let descriptionStatus = { exists: true, needsUpdate: false };
      if (category.description) {
        descriptionStatus = await checkTranslationStatus(
          'category',
          category.id,
          'description',
          lang,
          category.description
        );
      }
      
      category.translationStatus[lang] = {
        title: titleStatus,
        description: descriptionStatus
      };
    }
    
    return category;
  };
  
  // Ottiene lo stato di traduzione per una categoria e una lingua
  const getTranslationStatus = (category: any, language: SupportedLanguage) => {
    if (!category.translationStatus || !category.translationStatus[language]) {
      return 'pending';
    }
    
    const titleStatus = category.translationStatus[language].title;
    const descriptionStatus = category.translationStatus[language].description;
    
    // Se il titolo non esiste o richiede aggiornamento, la traduzione è necessaria
    if (!titleStatus.exists || titleStatus.needsUpdate) {
      return 'needed';
    }
    
    // Se c'è una descrizione e richiede aggiornamento, la traduzione è necessaria
    if (category.description && (!descriptionStatus.exists || descriptionStatus.needsUpdate)) {
      return 'needed';
    }
    
    // Altrimenti è completa
    return 'complete';
  };
  
  // Traduce una singola categoria
  const translateCategory = async (category: any) => {
    try {
      setTranslatingCategory(category.id);
      
      // Traduci il titolo
      if (
        !category.translationStatus[selectedLanguage].title.exists ||
        category.translationStatus[selectedLanguage].title.needsUpdate
      ) {
        const translatedTitle = await translateText(
          category.title,
          selectedLanguage
        );
        
        if (translatedTitle) {
          await saveTranslation(
            'category',
            category.id,
            'title',
            selectedLanguage,
            translatedTitle,
            category.title
          );
          
          // Aggiorna la categoria localmente
          category[`title_${selectedLanguage}`] = translatedTitle;
        }
      }
      
      // Traduci la descrizione se esiste
      if (
        category.description && 
        (!category.translationStatus[selectedLanguage].description.exists ||
         category.translationStatus[selectedLanguage].description.needsUpdate)
      ) {
        const translatedDescription = await translateText(
          category.description,
          selectedLanguage
        );
        
        if (translatedDescription) {
          await saveTranslation(
            'category',
            category.id,
            'description',
            selectedLanguage,
            translatedDescription,
            category.description
          );
          
          // Aggiorna la categoria localmente
          category[`description_${selectedLanguage}`] = translatedDescription;
        }
      }
      
      // Aggiorna lo stato delle traduzioni
      await checkTranslationsStatus(category);
      
      // Aggiorna la lista delle categorie
      setCategories([...categories]);
      
      // Notifica il componente padre
      onTranslationComplete();
      
      toast({
        title: "Traduzione completata",
        description: `La categoria "${category.title}" è stata tradotta in ${SUPPORTED_LANGUAGES[selectedLanguage]}.`,
      });
    } catch (error) {
      console.error('Errore nella traduzione della categoria:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante la traduzione della categoria.",
      });
    } finally {
      setTranslatingCategory(null);
    }
  };
  
  // Traduce tutte le categorie selezionate
  const translateSelected = async () => {
    for (const categoryId of selectedCategories) {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        await translateCategory(category);
      }
    }
    
    setSelectedCategories([]);
  };
  
  // Gestisce la selezione di una categoria
  const toggleCategorySelection = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  // Seleziona o deseleziona tutte le categorie
  const toggleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(category => category.id));
    }
  };
  
  // Rende una badge per lo stato della traduzione
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Completa
          </Badge>
        );
      case 'needed':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Da aggiornare
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
            In attesa
          </Badge>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Traduzioni Categorie</h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => (
              <Button
                key={code}
                variant={selectedLanguage === code ? "default" : "ghost"}
                className="rounded-none px-3"
                onClick={() => setSelectedLanguage(code as SupportedLanguage)}
              >
                {code.toUpperCase()}
              </Button>
            ))}
          </div>
          
          <Button
            onClick={translateSelected}
            disabled={isTranslating || selectedCategories.length === 0}
          >
            {isTranslating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Languages className="h-4 w-4 mr-2" />
            )}
            Traduci selezionate
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCategories.length === categories.length && categories.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Seleziona tutte"
                />
              </TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Stato Traduzione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">Caricamento categorie...</p>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <p className="text-muted-foreground">Nessuna categoria trovata.</p>
                </TableCell>
              </TableRow>
            ) : (
              categories.map(category => {
                const translationStatus = getTranslationStatus(category, selectedLanguage);
                
                return (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => toggleCategorySelection(category.id)}
                        aria-label={`Seleziona ${category.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{category.title}</div>
                      {category.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-md">
                          {category.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(translationStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => translateCategory(category)}
                        disabled={translatingCategory === category.id || (translationStatus === 'complete')}
                      >
                        {translatingCategory === category.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Languages className="h-4 w-4" />
                        )}
                        <span className="sr-only">Traduci</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryTranslations;
