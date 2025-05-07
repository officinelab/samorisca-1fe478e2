
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, Save, X, Move, Check } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Tipi
interface Category {
  id: string;
  title: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

interface Product {
  id: string;
  category_id: string;
  title: string; // Ridenominata da name a title per corrispondere alla tabella
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  price_standard?: number;
  has_multiple_prices?: boolean;
  price_variant_1_name?: string | null;
  price_variant_1_value?: number | null;
  price_variant_2_name?: string | null;
  price_variant_2_value?: number | null;
  allergens?: { id: string; number: number; title: string }[];
}

interface ProductPrice {
  id: string;
  product_id: string;
  name: string | null;
  price: number;
  display_order: number;
}

interface Allergen {
  id: string;
  number: number;
  title: string;
}

interface ProductAllergen {
  id: string;
  product_id: string;
  allergen_id: string;
}

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);

  // Carica le categorie, i prodotti e gli allergeni
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carica le categorie ordinate per display_order
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true }) as { data: Category[] | null; error: any };

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        if (categoriesData && categoriesData.length > 0) {
          // Seleziona automaticamente la prima categoria
          setSelectedCategory(categoriesData[0].id);
          
          // Carica i prodotti per la prima categoria
          await loadProducts(categoriesData[0].id);
        }

        // Carica tutti gli allergeni
        const { data: allergensData, error: allergensError } = await supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true }) as { data: Allergen[] | null; error: any };

        if (allergensError) throw allergensError;
        setAllergens(allergensData || []);

      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        toast.error("Errore nel caricamento dei dati. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Carica i prodotti per una categoria specifica
  const loadProducts = async (categoryId: string) => {
    try {
      // Carica i prodotti
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true }) as { data: Product[] | null; error: any };

      if (productsError) throw productsError;
      
      // Per ogni prodotto, carica gli allergeni associati
      const productsWithAllergens = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: productAllergens, error: allergensError } = await supabase
            .from('product_allergens')
            .select('allergen_id')
            .eq('product_id', product.id) as { data: ProductAllergen[] | null; error: any };
          
          if (allergensError) throw allergensError;
          
          // Se ci sono allergeni, recupera i dettagli
          let productAllergensDetails: { id: string; number: number; title: string }[] = [];
          if (productAllergens && productAllergens.length > 0) {
            const allergenIds = productAllergens.map(pa => pa.allergen_id);
            const { data: allergensDetails, error: detailsError } = await supabase
              .from('allergens')
              .select('id, number, title')
              .in('id', allergenIds) as { data: Allergen[] | null; error: any };
            
            if (detailsError) throw detailsError;
            productAllergensDetails = allergensDetails || [];
          }
          
          return { ...product, allergens: productAllergensDetails };
        })
      );
      
      setProducts(productsWithAllergens);
    } catch (error) {
      console.error('Errore nel caricamento dei prodotti:', error);
      toast.error("Errore nel caricamento dei prodotti. Riprova più tardi.");
    }
  };

  // Gestisce la selezione di una categoria
  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    await loadProducts(categoryId);
  };

  // Aggiunge una nuova categoria
  const handleAddCategory = async (categoryData: Partial<Category>) => {
    try {
      // Determina il prossimo display_order
      const maxOrder = Math.max(...categories.map(c => c.display_order), 0);
      const newOrder = maxOrder + 1;
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...categoryData, display_order: newOrder }])
        .select() as { data: Category[] | null; error: any };
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setCategories([...categories, data[0]]);
        setSelectedCategory(data[0].id);
        await loadProducts(data[0].id);
        toast.success("Categoria aggiunta con successo!");
      }
    } catch (error) {
      console.error('Errore nell\'aggiunta della categoria:', error);
      toast.error("Errore nell'aggiunta della categoria. Riprova più tardi.");
    }
  };

  // Aggiorna una categoria esistente
  const handleUpdateCategory = async (categoryId: string, categoryData: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', categoryId) as { error: any };
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      setCategories(categories.map(cat => 
        cat.id === categoryId ? { ...cat, ...categoryData } : cat
      ));
      
      toast.success("Categoria aggiornata con successo!");
    } catch (error) {
      console.error('Errore nell\'aggiornamento della categoria:', error);
      toast.error("Errore nell'aggiornamento della categoria. Riprova più tardi.");
    }
  };

  // Elimina una categoria
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa categoria? Verranno eliminati anche tutti i prodotti associati.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      
      // Se abbiamo eliminato la categoria selezionata, seleziona la prima categoria disponibile
      if (selectedCategory === categoryId) {
        const newSelectedCategory = updatedCategories.length > 0 ? updatedCategories[0].id : null;
        setSelectedCategory(newSelectedCategory);
        if (newSelectedCategory) {
          await loadProducts(newSelectedCategory);
        } else {
          setProducts([]);
        }
      }
      
      toast.success("Categoria eliminata con successo!");
    } catch (error) {
      console.error('Errore nell\'eliminazione della categoria:', error);
      toast.error("Errore nell'eliminazione della categoria. Riprova più tardi.");
    }
  };

  // Riordina le categorie
  const handleReorderCategories = async (reorderedCategories: Category[]) => {
    try {
      // Aggiorna l'ordine nel database
      for (let i = 0; i < reorderedCategories.length; i++) {
        const { error } = await supabase
          .from('categories')
          .update({ display_order: i })
          .eq('id', reorderedCategories[i].id);
        
        if (error) throw error;
      }
      
      // Aggiorna lo stato locale
      setCategories(reorderedCategories);
      setIsReordering(false);
      toast.success("Ordine delle categorie aggiornato con successo!");
    } catch (error) {
      console.error('Errore nel riordinamento delle categorie:', error);
      toast.error("Errore nel riordinamento delle categorie. Riprova più tardi.");
    }
  };

  // Aggiunge un nuovo prodotto
  const handleAddProduct = async (productData: Partial<Product>) => {
    if (!selectedCategory) return;

    try {
      // Determina il prossimo display_order per i prodotti nella categoria
      const maxOrder = Math.max(...products.map(p => p.display_order), 0);
      const newOrder = maxOrder + 1;
      
      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          ...productData, 
          category_id: selectedCategory,
          display_order: newOrder,
        }])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Gestisci gli allergeni se presenti
        if (productData.allergens && productData.allergens.length > 0) {
          const allergenInserts = productData.allergens.map(allergen => ({
            product_id: data[0].id,
            allergen_id: allergen.id,
          }));

          const { error: allergensError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (allergensError) throw allergensError;
        }

        // Aggiorna i prodotti
        await loadProducts(selectedCategory);
        toast.success("Prodotto aggiunto con successo!");
      }
    } catch (error) {
      console.error('Errore nell\'aggiunta del prodotto:', error);
      toast.error("Errore nell'aggiunta del prodotto. Riprova più tardi.");
    }
  };

  // Aggiorna un prodotto esistente
  const handleUpdateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);
      
      if (error) throw error;
      
      // Gestisci gli allergeni se presenti nella modifica
      if (productData.allergens !== undefined) {
        // Rimuovi tutte le associazioni esistenti
        const { error: deleteError } = await supabase
          .from('product_allergens')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
        
        // Aggiungi le nuove associazioni
        if (productData.allergens.length > 0) {
          const allergenInserts = productData.allergens.map(allergen => ({
            product_id: productId,
            allergen_id: allergen.id,
          }));

          const { error: insertError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (insertError) throw insertError;
        }
      }
      
      // Aggiorna i prodotti
      if (selectedCategory) {
        await loadProducts(selectedCategory);
      }
      
      toast.success("Prodotto aggiornato con successo!");
    } catch (error) {
      console.error('Errore nell\'aggiornamento del prodotto:', error);
      toast.error("Errore nell'aggiornamento del prodotto. Riprova più tardi.");
    }
  };

  // Elimina un prodotto
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // Aggiorna lo stato locale
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Prodotto eliminato con successo!");
    } catch (error) {
      console.error('Errore nell\'eliminazione del prodotto:', error);
      toast.error("Errore nell'eliminazione del prodotto. Riprova più tardi.");
    }
  };

  // Riordina i prodotti
  const handleReorderProducts = async (reorderedProducts: Product[]) => {
    try {
      // Aggiorna l'ordine nel database
      for (let i = 0; i < reorderedProducts.length; i++) {
        const { error } = await supabase
          .from('products')
          .update({ display_order: i })
          .eq('id', reorderedProducts[i].id);
        
        if (error) throw error;
      }
      
      // Aggiorna lo stato locale
      setProducts(reorderedProducts);
      toast.success("Ordine dei prodotti aggiornato con successo!");
    } catch (error) {
      console.error('Errore nel riordinamento dei prodotti:', error);
      toast.error("Errore nel riordinamento dei prodotti. Riprova più tardi.");
    }
  };

  // Componente per il caricamento delle immagini
  const ImageUploader = ({ 
    currentImage, 
    onImageUploaded, 
    label = "Immagine"
  }: { 
    currentImage?: string | null, 
    onImageUploaded: (url: string) => void,
    label?: string 
  }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      // Valida il tipo di file
      if (!file.type.startsWith('image/')) {
        toast.error("Per favore seleziona un'immagine valida");
        return;
      }
      
      setIsUploading(true);
      
      try {
        // Crea un'anteprima locale
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        // Carica l'immagine su Supabase Storage
        const filePath = `menu/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('menu-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        // Ottieni l'URL pubblico dell'immagine
        const { data: publicUrlData } = supabase.storage
          .from('menu-images')
          .getPublicUrl(data.path);
        
        onImageUploaded(publicUrlData.publicUrl);
      } catch (error) {
        console.error('Errore nel caricamento dell\'immagine:', error);
        toast.error("Errore nel caricamento dell'immagine. Riprova più tardi.");
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {previewUrl && (
          <div className="relative w-full h-48 mb-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
        <div className="flex items-center">
          <Label 
            htmlFor="image-upload" 
            className="cursor-pointer border border-dashed border-gray-300 rounded-md px-4 py-2 w-full text-center hover:bg-gray-50"
          >
            {isUploading ? "Caricamento in corso..." : "Carica immagine"}
          </Label>
          <Input 
            id="image-upload" 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>
      </div>
    );
  };

  // Componente per l'aggiunta/modifica delle categorie
  const CategoryForm = ({ 
    initialData, 
    onSubmit,
    onCancel 
  }: { 
    initialData?: Category, 
    onSubmit: (data: Partial<Category>) => void,
    onCancel: () => void 
  }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        title,
        image_url: imageUrl,
        is_active: isActive
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Nome Categoria</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome della categoria"
            required
          />
        </div>
        
        <ImageUploader
          currentImage={imageUrl}
          onImageUploaded={setImageUrl}
          label="Immagine Categoria"
        />
        
        <div className="flex items-center justify-between">
          <Label htmlFor="is-active">Attiva</Label>
          <Switch 
            id="is-active" 
            checked={isActive} 
            onCheckedChange={setIsActive}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Annulla</Button>
          <Button type="submit">Salva</Button>
        </div>
      </form>
    );
  };

  // Componente per l'aggiunta/modifica dei prodotti
  const ProductForm = ({ 
    initialData,
    onSubmit,
    onCancel
  }: { 
    initialData?: Product,
    onSubmit: (data: Partial<Product>) => void,
    onCancel: () => void
  }) => {
    const [name, setName] = useState(initialData?.name || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
    const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
    const [priceStandard, setPriceStandard] = useState(initialData?.price_standard?.toString() || "");
    const [hasMultiplePrices, setHasMultiplePrices] = useState(initialData?.has_multiple_prices || false);
    const [priceVariant1Name, setPriceVariant1Name] = useState(initialData?.price_variant_1_name || "");
    const [priceVariant1Value, setPriceVariant1Value] = useState(initialData?.price_variant_1_value?.toString() || "");
    const [priceVariant2Name, setPriceVariant2Name] = useState(initialData?.price_variant_2_name || "");
    const [priceVariant2Value, setPriceVariant2Value] = useState(initialData?.price_variant_2_value?.toString() || "");
    const [selectedAllergens, setSelectedAllergens] = useState<Allergen[]>(initialData?.allergens || []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        name,
        description,
        image_url: imageUrl,
        is_active: isActive,
        price_standard: parseFloat(priceStandard),
        has_multiple_prices: hasMultiplePrices,
        price_variant_1_name: hasMultiplePrices ? priceVariant1Name : null,
        price_variant_1_value: hasMultiplePrices && priceVariant1Value ? parseFloat(priceVariant1Value) : null,
        price_variant_2_name: hasMultiplePrices ? priceVariant2Name : null,
        price_variant_2_value: hasMultiplePrices && priceVariant2Value ? parseFloat(priceVariant2Value) : null,
        allergens: selectedAllergens
      });
    };

    const toggleAllergen = (allergen: Allergen) => {
      if (selectedAllergens.some(a => a.id === allergen.id)) {
        setSelectedAllergens(selectedAllergens.filter(a => a.id !== allergen.id));
      } else {
        setSelectedAllergens([...selectedAllergens, allergen]);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Prodotto</Label>
          <Input 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome del prodotto"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrizione</Label>
          <Textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione del prodotto"
            rows={3}
          />
        </div>
        
        <ImageUploader
          currentImage={imageUrl}
          onImageUploaded={setImageUrl}
          label="Immagine Prodotto"
        />
        
        <div className="flex items-center justify-between">
          <Label htmlFor="is-product-active">Attivo</Label>
          <Switch 
            id="is-product-active" 
            checked={isActive} 
            onCheckedChange={setIsActive}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Prezzo (€)</Label>
          <Input 
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={priceStandard}
            onChange={(e) => setPriceStandard(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="has-multiple-prices">Prezzi multipli</Label>
          <Switch 
            id="has-multiple-prices" 
            checked={hasMultiplePrices} 
            onCheckedChange={setHasMultiplePrices}
          />
        </div>
        
        {hasMultiplePrices && (
          <div className="border rounded-md p-3 space-y-3 bg-gray-50">
            <h4 className="font-medium">Varianti di prezzo</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="variant1-name">Nome Variante 1</Label>
                <Input 
                  id="variant1-name"
                  value={priceVariant1Name}
                  onChange={(e) => setPriceVariant1Name(e.target.value)}
                  placeholder="Es. Bottiglia"
                />
              </div>
              <div>
                <Label htmlFor="variant1-price">Prezzo Variante 1 (€)</Label>
                <Input 
                  id="variant1-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceVariant1Value}
                  onChange={(e) => setPriceVariant1Value(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="variant2-name">Nome Variante 2</Label>
                <Input 
                  id="variant2-name"
                  value={priceVariant2Name}
                  onChange={(e) => setPriceVariant2Name(e.target.value)}
                  placeholder="Es. Calice"
                />
              </div>
              <div>
                <Label htmlFor="variant2-price">Prezzo Variante 2 (€)</Label>
                <Input 
                  id="variant2-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceVariant2Value}
                  onChange={(e) => setPriceVariant2Value(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label className="block">Allergeni</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {allergens.map((allergen) => (
              <div 
                key={allergen.id} 
                className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                  selectedAllergens.some(a => a.id === allergen.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => toggleAllergen(allergen)}
              >
                {allergen.number}: {allergen.title}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Annulla</Button>
          <Button type="submit">Salva</Button>
        </div>
      </form>
    );
  };

  // Componente per la gestione delle categorie
  const CategoriesManager = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [reorderingList, setReorderingList] = useState<Category[]>([]);

    const startReordering = () => {
      setIsReordering(true);
      setReorderingList([...categories]);
    };

    const cancelReordering = () => {
      setIsReordering(false);
    };

    const moveCategory = (index: number, direction: 'up' | 'down') => {
      if (
        (direction === 'up' && index === 0) || 
        (direction === 'down' && index === reorderingList.length - 1)
      ) {
        return;
      }

      const newList = [...reorderingList];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
      setReorderingList(newList);
    };

    const saveReordering = () => {
      handleReorderCategories(reorderingList);
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Categorie</h2>
          {isReordering ? (
            <div className="space-x-2">
              <Button onClick={cancelReordering} variant="outline">
                <X className="h-4 w-4 mr-1" /> Annulla
              </Button>
              <Button onClick={saveReordering} variant="default">
                <Save className="h-4 w-4 mr-1" /> Salva
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Button onClick={startReordering} variant="outline">
                <Move className="h-4 w-4 mr-1" /> Riordina
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <PlusCircle className="h-4 w-4 mr-1" /> Aggiungi
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="space-y-2">
            {isReordering ? (
              // Modalità riordinamento
              reorderingList.map((category, index) => (
                <div 
                  key={category.id}
                  className="flex items-center justify-between bg-white p-3 rounded-md border"
                >
                  <div className="flex items-center">
                    <span className="font-medium">{category.title}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => moveCategory(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => moveCategory(index, 'down')}
                      disabled={index === reorderingList.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              // Modalità normale
              categories.map((category) => (
                <div 
                  key={category.id}
                  className={`flex items-center justify-between p-3 rounded-md border cursor-pointer ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-sm overflow-hidden mr-3">
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : null}
                    </div>
                    <span className="font-medium">{category.title}</span>
                    {!category.is_active && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-gray-300 text-gray-700 rounded-full">
                        Inattiva
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(category);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}

            {categories.length === 0 && !isLoading && (
              <div className="text-center py-6 text-gray-500">
                Nessuna categoria trovata. Aggiungi una nuova categoria per iniziare.
              </div>
            )}

            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Dialog per aggiungere una categoria */}
        <Dialog 
          open={showAddDialog} 
          onOpenChange={(open) => !open && setShowAddDialog(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aggiungi Categoria</DialogTitle>
            </DialogHeader>
            <CategoryForm 
              onSubmit={(data) => {
                handleAddCategory(data);
                setShowAddDialog(false);
              }}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog per modificare una categoria */}
        <Dialog 
          open={!!editingCategory} 
          onOpenChange={(open) => !open && setEditingCategory(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifica Categoria</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <CategoryForm 
                initialData={editingCategory}
                onSubmit={(data) => {
                  handleUpdateCategory(editingCategory.id, data);
                  setEditingCategory(null);
                }}
                onCancel={() => setEditingCategory(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Componente per la gestione dei prodotti
  const ProductsManager = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isReorderingProducts, setIsReorderingProducts] = useState(false);
    const [reorderingProductsList, setReorderingProductsList] = useState<Product[]>([]);

    const startReordering = () => {
      setIsReorderingProducts(true);
      setReorderingProductsList([...products]);
    };

    const cancelReordering = () => {
      setIsReorderingProducts(false);
    };

    const moveProduct = (index: number, direction: 'up' | 'down') => {
      if (
        (direction === 'up' && index === 0) || 
        (direction === 'down' && index === reorderingProductsList.length - 1)
      ) {
        return;
      }

      const newList = [...reorderingProductsList];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
      setReorderingProductsList(newList);
    };

    const saveReordering = () => {
      handleReorderProducts(reorderingProductsList);
      setIsReorderingProducts(false);
    };

    // Trova la categoria selezionata
    const selectedCategoryData = categories.find(c => c.id === selectedCategory);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {selectedCategoryData 
              ? `Prodotti: ${selectedCategoryData.title}`
              : "Seleziona una categoria"
            }
          </h2>
          {selectedCategory && (
            isReorderingProducts ? (
              <div className="space-x-2">
                <Button onClick={cancelReordering} variant="outline">
                  <X className="h-4 w-4 mr-1" /> Annulla
                </Button>
                <Button onClick={saveReordering} variant="default">
                  <Save className="h-4 w-4 mr-1" /> Salva
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button onClick={startReordering} variant="outline">
                  <Move className="h-4 w-4 mr-1" /> Riordina
                </Button>
                <Button onClick={() => setShowAddDialog(true)}>
                  <PlusCircle className="h-4 w-4 mr-1" /> Aggiungi
                </Button>
              </div>
            )
          )}
        </div>

        {selectedCategory ? (
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-3">
              {isReorderingProducts ? (
                // Modalità riordinamento prodotti
                reorderingProductsList.map((product, index) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between bg-white p-3 rounded-md border"
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => moveProduct(index, 'up')}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => moveProduct(index, 'down')}
                        disabled={index === reorderingProductsList.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                // Modalità normale prodotti
                products.map((product) => (
                  <Card key={product.id} className={`${!product.is_active ? 'opacity-70' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <div className="flex space-x-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-4">
                        {/* Informazioni prodotto */}
                        <div className="flex-1 min-w-[60%]">
                          {product.description && (
                            <p className="text-gray-600 text-sm">{product.description}</p>
                          )}
                          
                          {/* Allergeni */}
                          {product.allergens && product.allergens.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Allergeni:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.allergens.map(allergen => (
                                  <span key={allergen.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                    {allergen.number}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Prezzi */}
                          <div className="mt-2">
                            {product.has_multiple_prices ? (
                              <div className="space-y-1">
                                <p className="font-medium">{product.price_standard} €</p>
                                {product.price_variant_1_name && (
                                  <p className="text-sm">{product.price_variant_1_name}: {product.price_variant_1_value} €</p>
                                )}
                                {product.price_variant_2_name && (
                                  <p className="text-sm">{product.price_variant_2_name}: {product.price_variant_2_value} €</p>
                                )}
                              </div>
                            ) : (
                              <p className="font-medium">{product.price_standard} €</p>
                            )}
                          </div>
                          
                          {/* Badge per prodotto inattivo */}
                          {!product.is_active && (
                            <div className="mt-2">
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                Non disponibile
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Immagine prodotto */}
                        {product.image_url && (
                          <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              {products.length === 0 && !isLoading && (
                <div className="text-center py-6 text-gray-500">
                  Nessun prodotto trovato in questa categoria. Aggiungi un nuovo prodotto per iniziare.
                </div>
              )}

              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-36 w-full" />
                  <Skeleton className="h-36 w-full" />
                  <Skeleton className="h-36 w-full" />
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Seleziona una categoria per visualizzare e gestire i prodotti.
          </div>
        )}

        {/* Dialog per aggiungere un prodotto */}
        <Dialog 
          open={showAddDialog} 
          onOpenChange={(open) => !open && setShowAddDialog(false)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Aggiungi Prodotto</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              <ProductForm 
                onSubmit={(data) => {
                  handleAddProduct(data);
                  setShowAddDialog(false);
                }}
                onCancel={() => setShowAddDialog(false)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Dialog per modificare un prodotto */}
        <Dialog 
          open={!!editingProduct} 
          onOpenChange={(open) => !open && setEditingProduct(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Modifica Prodotto</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[80vh]">
              {editingProduct && (
                <ProductForm 
                  initialData={editingProduct}
                  onSubmit={(data) => {
                    handleUpdateProduct(editingProduct.id, data);
                    setEditingProduct(null);
                  }}
                  onCancel={() => setEditingProduct(null)}
                />
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <Tabs defaultValue="categories" className="space-y-4">
      <TabsList>
        <TabsTrigger value="categories">Categorie</TabsTrigger>
        <TabsTrigger value="products">Prodotti</TabsTrigger>
      </TabsList>
      
      <TabsContent value="categories" className="mt-6">
        <CategoriesManager />
      </TabsContent>
      
      <TabsContent value="products" className="mt-6">
        <ProductsManager />
      </TabsContent>
    </Tabs>
  );
};

export default Dashboard;
