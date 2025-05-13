
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
import { 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Languages,
  ChevronDown,
  Search
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  useTranslationService, 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES 
} from "@/hooks/translations/useTranslationService";

interface ProductTranslationsProps {
  onTranslationComplete: () => void;
}

const ProductTranslations = ({ onTranslationComplete }: ProductTranslationsProps) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [translatingProduct, setTranslatingProduct] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    categoryId: '',
    search: ''
  });
  
  const { 
    isLoading: isTranslating, 
    translateText, 
    saveTranslation, 
    checkTranslationStatus 
  } = useTranslationService();
  
  // Carica i prodotti e le categorie
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);
  
  // Filtra i prodotti quando cambia il filtro
  useEffect(() => {
    if (!loading) {
      fetchProducts();
    }
  }, [filter]);
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, title')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error) {
      console.error('Errore nel caricamento delle categorie:', error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select('*, category:categories(title)')
        .order('display_order', { ascending: true });
      
      if (filter.categoryId) {
        query = query.eq('category_id', filter.categoryId);
      }
      
      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      for (const product of data || []) {
        await checkTranslationsStatus(product);
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Errore nel caricamento dei prodotti:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Impossibile caricare i prodotti.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Controlla lo stato delle traduzioni per un prodotto
  const checkTranslationsStatus = async (product: any) => {
    product.translationStatus = {};
    
    for (const lang of Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]) {
      // Controlla la traduzione del titolo
      const titleStatus = await checkTranslationStatus(
        'product',
        product.id,
        'title',
        lang,
        product.title
      );
      
      // Controlla la traduzione della descrizione (se esiste)
      let descriptionStatus = { exists: true, needsUpdate: false };
      if (product.description) {
        descriptionStatus = await checkTranslationStatus(
          'product',
          product.id,
          'description',
          lang,
          product.description
        );
      }
      
      product.translationStatus[lang] = {
        title: titleStatus,
        description: descriptionStatus
      };
    }
    
    return product;
  };
  
  // Ottiene lo stato di traduzione per un prodotto e una lingua
  const getTranslationStatus = (product: any, language: SupportedLanguage) => {
    if (!product.translationStatus || !product.translationStatus[language]) {
      return 'pending';
    }
    
    const titleStatus = product.translationStatus[language].title;
    const descriptionStatus = product.translationStatus[language].description;
    
    // Se il titolo non esiste o richiede aggiornamento, la traduzione è necessaria
    if (!titleStatus.exists || titleStatus.needsUpdate) {
      return 'needed';
    }
    
    // Se c'è una descrizione e richiede aggiornamento, la traduzione è necessaria
    if (product.description && (!descriptionStatus.exists || descriptionStatus.needsUpdate)) {
      return 'needed';
    }
    
    // Altrimenti è completa
    return 'complete';
  };
  
  // Traduce un singolo prodotto
  const translateProduct = async (product: any) => {
    try {
      setTranslatingProduct(product.id);
      
      // Traduci il titolo
      if (
        !product.translationStatus[selectedLanguage].title.exists ||
        product.translationStatus[selectedLanguage].title.needsUpdate
      ) {
        const translatedTitle = await translateText(
          product.title,
          selectedLanguage
        );
        
        if (translatedTitle) {
          await saveTranslation(
            'product',
            product.id,
            'title',
            selectedLanguage,
            translatedTitle,
            product.title
          );
          
          // Aggiorna il prodotto localmente
          product[`title_${selectedLanguage}`] = translatedTitle;
        }
      }
      
      // Traduci la descrizione se esiste
      if (
        product.description && 
        (!product.translationStatus[selectedLanguage].description.exists ||
         product.translationStatus[selectedLanguage].description.needsUpdate)
      ) {
        const translatedDescription = await translateText(
          product.description,
          selectedLanguage
        );
        
        if (translatedDescription) {
          await saveTranslation(
            'product',
            product.id,
            'description',
            selectedLanguage,
            translatedDescription,
            product.description
          );
          
          // Aggiorna il prodotto localmente
          product[`description_${selectedLanguage}`] = translatedDescription;
        }
      }
      
      // Aggiorna lo stato delle traduzioni
      await checkTranslationsStatus(product);
      
      // Aggiorna la lista dei prodotti
      setProducts([...products]);
      
      // Notifica il componente padre
      onTranslationComplete();
      
      toast({
        title: "Traduzione completata",
        description: `Il prodotto "${product.title}" è stato tradotto in ${SUPPORTED_LANGUAGES[selectedLanguage]}.`,
      });
    } catch (error) {
      console.error('Errore nella traduzione del prodotto:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante la traduzione del prodotto.",
      });
    } finally {
      setTranslatingProduct(null);
    }
  };
  
  // Traduce tutti i prodotti selezionati
  const translateSelected = async () => {
    for (const productId of selectedProducts) {
      const product = products.find(p => p.id === productId);
      if (product) {
        await translateProduct(product);
      }
    }
    
    setSelectedProducts([]);
  };
  
  // Gestisce la selezione di un prodotto
  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  // Seleziona o deseleziona tutti i prodotti
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
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
        <h3 className="text-lg font-medium">Traduzioni Prodotti</h3>
        
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
            disabled={isTranslating || selectedProducts.length === 0}
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
      
      <div className="flex items-center space-x-2 mb-4">
        <Select
          value={filter.categoryId}
          onValueChange={(value) => setFilter({ ...filter, categoryId: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tutte le categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tutte le categorie</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cerca prodotti..."
            className="pl-8"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Seleziona tutti"
                />
              </TableHead>
              <TableHead>Prodotto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Stato Traduzione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">Caricamento prodotti...</p>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">Nessun prodotto trovato.</p>
                </TableCell>
              </TableRow>
            ) : (
              products.map(product => {
                const translationStatus = getTranslationStatus(product, selectedLanguage);
                
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                        aria-label={`Seleziona ${product.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.title}</div>
                      {product.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-md">
                          {product.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{product.category?.title}</TableCell>
                    <TableCell>
                      {renderStatusBadge(translationStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => translateProduct(product)}
                        disabled={translatingProduct === product.id || (translationStatus === 'complete')}
                      >
                        {translatingProduct === product.id ? (
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

export default ProductTranslations;
