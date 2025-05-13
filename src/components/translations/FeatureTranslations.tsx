
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

interface FeatureTranslationsProps {
  onTranslationComplete: () => void;
}

const FeatureTranslations = ({ onTranslationComplete }: FeatureTranslationsProps) => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [translatingFeature, setTranslatingFeature] = useState<string | null>(null);
  
  const { 
    isLoading: isTranslating, 
    translateText, 
    saveTranslation, 
    checkTranslationStatus 
  } = useTranslationService();
  
  // Carica le caratteristiche
  useEffect(() => {
    fetchFeatures();
  }, []);
  
  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_features')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      for (const feature of data || []) {
        await checkTranslationsStatus(feature);
      }
      
      setFeatures(data || []);
    } catch (error) {
      console.error('Errore nel caricamento delle caratteristiche:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare le caratteristiche.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Controlla lo stato delle traduzioni per una caratteristica
  const checkTranslationsStatus = async (feature: any) => {
    feature.translationStatus = {};
    
    for (const lang of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      // Controlla la traduzione del titolo
      const titleStatus = await checkTranslationStatus(
        'product_feature',
        feature.id,
        'title',
        lang,
        feature.title
      );
      
      feature.translationStatus[lang] = {
        title: titleStatus
      };
    }
    
    return feature;
  };
  
  // Ottiene lo stato di traduzione per una caratteristica e una lingua
  const getTranslationStatus = (feature: any, language: SupportedLanguage) => {
    if (!feature.translationStatus || !feature.translationStatus[language]) {
      return 'pending';
    }
    
    const titleStatus = feature.translationStatus[language].title;
    
    // Se il titolo non esiste o richiede aggiornamento, la traduzione è necessaria
    if (!titleStatus.exists || titleStatus.needsUpdate) {
      return 'needed';
    }
    
    // Altrimenti è completa
    return 'complete';
  };
  
  // Traduce una singola caratteristica
  const translateFeature = async (feature: any) => {
    try {
      setTranslatingFeature(feature.id);
      
      // Traduci il titolo
      if (
        !feature.translationStatus[selectedLanguage].title.exists ||
        feature.translationStatus[selectedLanguage].title.needsUpdate
      ) {
        const translatedTitle = await translateText(
          feature.title,
          selectedLanguage
        );
        
        if (translatedTitle) {
          await saveTranslation(
            'product_feature',
            feature.id,
            'title',
            selectedLanguage,
            translatedTitle,
            feature.title
          );
          
          // Aggiorna la caratteristica localmente
          feature[`title_${selectedLanguage}`] = translatedTitle;
        }
      }
      
      // Aggiorna lo stato delle traduzioni
      await checkTranslationsStatus(feature);
      
      // Aggiorna la lista delle caratteristiche
      setFeatures([...features]);
      
      // Notifica il componente padre
      onTranslationComplete();
      
      toast({
        title: "Traduzione completata",
        description: `La caratteristica "${feature.title}" è stata tradotta in ${SUPPORTED_LANGUAGES[selectedLanguage]}.`,
      });
    } catch (error) {
      console.error('Errore nella traduzione della caratteristica:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante la traduzione della caratteristica.",
      });
    } finally {
      setTranslatingFeature(null);
    }
  };
  
  // Traduce tutte le caratteristiche selezionate
  const translateSelected = async () => {
    for (const featureId of selectedFeatures) {
      const feature = features.find(f => f.id === featureId);
      if (feature) {
        await translateFeature(feature);
      }
    }
    
    setSelectedFeatures([]);
  };
  
  // Gestisce la selezione di una caratteristica
  const toggleFeatureSelection = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };
  
  // Seleziona o deseleziona tutte le caratteristiche
  const toggleSelectAll = () => {
    if (selectedFeatures.length === features.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(features.map(feature => feature.id));
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
        <h3 className="text-lg font-medium">Traduzioni Caratteristiche</h3>
        
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
            disabled={isTranslating || selectedFeatures.length === 0}
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
                  checked={selectedFeatures.length === features.length && features.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Seleziona tutte"
                />
              </TableHead>
              <TableHead>Caratteristica</TableHead>
              <TableHead>Stato Traduzione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">Caricamento caratteristiche...</p>
                </TableCell>
              </TableRow>
            ) : features.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <p className="text-muted-foreground">Nessuna caratteristica trovata.</p>
                </TableCell>
              </TableRow>
            ) : (
              features.map(feature => {
                const translationStatus = getTranslationStatus(feature, selectedLanguage);
                
                return (
                  <TableRow key={feature.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => toggleFeatureSelection(feature.id)}
                        aria-label={`Seleziona ${feature.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{feature.title}</div>
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(translationStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => translateFeature(feature)}
                        disabled={translatingFeature === feature.id || (translationStatus === 'complete')}
                      >
                        {translatingFeature === feature.id ? (
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

export default FeatureTranslations;
