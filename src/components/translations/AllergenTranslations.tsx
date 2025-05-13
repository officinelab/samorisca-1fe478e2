
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

interface AllergenTranslationsProps {
  onTranslationComplete: () => void;
}

const AllergenTranslations = ({ onTranslationComplete }: AllergenTranslationsProps) => {
  const { toast } = useToast();
  const [allergens, setAllergens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [translatingAllergen, setTranslatingAllergen] = useState<string | null>(null);
  
  const { 
    isLoading: isTranslating, 
    translateText, 
    saveTranslation, 
    checkTranslationStatus 
  } = useTranslationService();
  
  // Carica gli allergeni
  useEffect(() => {
    fetchAllergens();
  }, []);
  
  const fetchAllergens = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('allergens')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      for (const allergen of data || []) {
        await checkTranslationsStatus(allergen);
      }
      
      setAllergens(data || []);
    } catch (error) {
      console.error('Errore nel caricamento degli allergeni:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare gli allergeni.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Controlla lo stato delle traduzioni per un allergene
  const checkTranslationsStatus = async (allergen: any) => {
    allergen.translationStatus = {};
    
    for (const lang of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      // Controlla la traduzione del titolo
      const titleStatus = await checkTranslationStatus(
        'allergen',
        allergen.id,
        'title',
        lang,
        allergen.title
      );
      
      // Controlla la traduzione della descrizione (se esiste)
      let descriptionStatus = { exists: true, needsUpdate: false };
      if (allergen.description) {
        descriptionStatus = await checkTranslationStatus(
          'allergen',
          allergen.id,
          'description',
          lang,
          allergen.description
        );
      }
      
      allergen.translationStatus[lang] = {
        title: titleStatus,
        description: descriptionStatus
      };
    }
    
    return allergen;
  };
  
  // Ottiene lo stato di traduzione per un allergene e una lingua
  const getTranslationStatus = (allergen: any, language: SupportedLanguage) => {
    if (!allergen.translationStatus || !allergen.translationStatus[language]) {
      return 'pending';
    }
    
    const titleStatus = allergen.translationStatus[language].title;
    const descriptionStatus = allergen.translationStatus[language].description;
    
    // Se il titolo non esiste o richiede aggiornamento, la traduzione è necessaria
    if (!titleStatus.exists || titleStatus.needsUpdate) {
      return 'needed';
    }
    
    // Se c'è una descrizione e richiede aggiornamento, la traduzione è necessaria
    if (allergen.description && (!descriptionStatus.exists || descriptionStatus.needsUpdate)) {
      return 'needed';
    }
    
    // Altrimenti è completa
    return 'complete';
  };
  
  // Traduce un singolo allergene
  const translateAllergen = async (allergen: any) => {
    try {
      setTranslatingAllergen(allergen.id);
      
      // Traduci il titolo
      if (
        !allergen.translationStatus[selectedLanguage].title.exists ||
        allergen.translationStatus[selectedLanguage].title.needsUpdate
      ) {
        const translatedTitle = await translateText(
          allergen.title,
          selectedLanguage
        );
        
        if (translatedTitle) {
          await saveTranslation(
            'allergen',
            allergen.id,
            'title',
            selectedLanguage,
            translatedTitle,
            allergen.title
          );
          
          // Aggiorna l'allergene localmente
          allergen[`title_${selectedLanguage}`] = translatedTitle;
        }
      }
      
      // Traduci la descrizione se esiste
      if (
        allergen.description && 
        (!allergen.translationStatus[selectedLanguage].description.exists ||
         allergen.translationStatus[selectedLanguage].description.needsUpdate)
      ) {
        const translatedDescription = await translateText(
          allergen.description,
          selectedLanguage
        );
        
        if (translatedDescription) {
          await saveTranslation(
            'allergen',
            allergen.id,
            'description',
            selectedLanguage,
            translatedDescription,
            allergen.description
          );
          
          // Aggiorna l'allergene localmente
          allergen[`description_${selectedLanguage}`] = translatedDescription;
        }
      }
      
      // Aggiorna lo stato delle traduzioni
      await checkTranslationsStatus(allergen);
      
      // Aggiorna la lista degli allergeni
      setAllergens([...allergens]);
      
      // Notifica il componente padre
      onTranslationComplete();
      
      toast({
        title: "Traduzione completata",
        description: `L'allergene "${allergen.title}" è stato tradotto in ${SUPPORTED_LANGUAGES[selectedLanguage]}.`,
      });
    } catch (error) {
      console.error('Errore nella traduzione dell\'allergene:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante la traduzione dell'allergene.",
      });
    } finally {
      setTranslatingAllergen(null);
    }
  };
  
  // Traduce tutti gli allergeni selezionati
  const translateSelected = async () => {
    for (const allergenId of selectedAllergens) {
      const allergen = allergens.find(a => a.id === allergenId);
      if (allergen) {
        await translateAllergen(allergen);
      }
    }
    
    setSelectedAllergens([]);
  };
  
  // Gestisce la selezione di un allergene
  const toggleAllergenSelection = (allergenId: string) => {
    if (selectedAllergens.includes(allergenId)) {
      setSelectedAllergens(selectedAllergens.filter(id => id !== allergenId));
    } else {
      setSelectedAllergens([...selectedAllergens, allergenId]);
    }
  };
  
  // Seleziona o deseleziona tutti gli allergeni
  const toggleSelectAll = () => {
    if (selectedAllergens.length === allergens.length) {
      setSelectedAllergens([]);
    } else {
      setSelectedAllergens(allergens.map(allergen => allergen.id));
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
        <h3 className="text-lg font-medium">Traduzioni Allergeni</h3>
        
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
            disabled={isTranslating || selectedAllergens.length === 0}
          >
            {isTranslating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Languages className="h-4 w-4 mr-2" />
            )}
            Traduci selezionati
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedAllergens.length === allergens.length && allergens.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Seleziona tutti"
                />
              </TableHead>
              <TableHead className="w-16">N°</TableHead>
              <TableHead>Allergene</TableHead>
              <TableHead>Stato Traduzione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">Caricamento allergeni...</p>
                </TableCell>
              </TableRow>
            ) : allergens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">Nessun allergene trovato.</p>
                </TableCell>
              </TableRow>
            ) : (
              allergens.map(allergen => {
                const translationStatus = getTranslationStatus(allergen, selectedLanguage);
                
                return (
                  <TableRow key={allergen.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAllergens.includes(allergen.id)}
                        onCheckedChange={() => toggleAllergenSelection(allergen.id)}
                        aria-label={`Seleziona ${allergen.title}`}
                      />
                    </TableCell>
                    <TableCell>{allergen.number}</TableCell>
                    <TableCell>
                      <div className="font-medium">{allergen.title}</div>
                      {allergen.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-md">
                          {allergen.description}
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
                        onClick={() => translateAllergen(allergen)}
                        disabled={translatingAllergen === allergen.id || (translationStatus === 'complete')}
                      >
                        {translatingAllergen === allergen.id ? (
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

export default AllergenTranslations;
