import React, { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import {
  Category, Product, ProductFeature, Allergen, ProductLabel
} from "@/types/database";
import { ImageIcon, Plus, Upload, ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// IMPORT CORRETTI DEI COMPONENTI
import CategoriesList from "./components/CategoriesList";
import ProductsList from "./components/ProductsList";
import ProductDetailPanel from "./components/ProductDetailPanel";

const categorySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, {
    message: "Il nome deve essere di almeno 2 caratteri.",
  }),
  image_url: z.string().optional(),
  is_active: z.boolean().default(true),
  display_order: z.number().optional(),
});

const productSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().min(1, {
    message: "Devi selezionare una categoria.",
  }),
  title: z.string().min(2, {
    message: "Il nome deve essere di almeno 2 caratteri.",
  }),
  description: z.string().optional(),
  image_url: z.string().optional(),
  price_standard: z.number(),
  has_price_suffix: z.boolean().default(false),
  price_suffix: z.string().optional(),
  has_multiple_prices: z.boolean().default(false),
  price_variant_1_name: z.string().optional(),
  price_variant_1_value: z.number().optional(),
  price_variant_2_name: z.string().optional(),
  price_variant_2_value: z.number().optional(),
  features: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
  label: z.string().optional(),
  is_active: z.boolean().default(true),
  display_order: z.number().optional(),
});

const Dashboard: React.FC = () => {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isProductPanelOpen, setIsProductPanelOpen] = useState(false);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [isDeleteCategoryAlertOpen, setIsDeleteCategoryAlertOpen] = useState(false);
  const [isDeleteProductAlertOpen, setIsDeleteProductAlertOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);

  const { toast } = useToast();
  const formCategory = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      is_active: true,
    },
  });
  const formProduct = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_id: "",
      title: "",
      price_standard: 0,
      is_active: true,
      has_price_suffix: false,
      has_multiple_prices: false,
    },
  });

  function productToFormValues(product: Product): any {
    return {
      ...product,
      features: product.features ? product.features.map(f => f.id) : [],
      allergens: product.allergens ? product.allergens.map(a => a.id) : [],
      label: product.label ? product.label.id : undefined,
    };
  }

  // Funzione di mapping Category per default values
  function categoryToFormValues(category: Category): any {
    return {
      ...category,
      description: category.description ?? "",
    };
  }

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Could not fetch categories:", error);
      toast({
        title: "Errore!",
        description: "Impossibile caricare le categorie.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCategories(false);
    }
  }, [toast]);

  const fetchProducts = useCallback(async (categoryId: string) => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`/api/products?category_id=${categoryId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Could not fetch products:", error);
      toast({
        title: "Errore!",
        description: "Impossibile caricare i prodotti.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }, [toast]);

  const fetchFeatures = useCallback(async () => {
    try {
      const response = await fetch('/api/features');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFeatures(data);
    } catch (error) {
      console.error("Could not fetch features:", error);
      toast({
        title: "Errore!",
        description: "Impossibile caricare le caratteristiche.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchAllergens = useCallback(async () => {
    try {
      const response = await fetch('/api/allergens');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllergens(data);
    } catch (error) {
      console.error("Could not fetch allergens:", error);
      toast({
        title: "Errore!",
        description: "Impossibile caricare gli allergeni.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchLabels = useCallback(async () => {
    try {
      const response = await fetch('/api/labels');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLabels(data);
    } catch (error) {
      console.error("Could not fetch labels:", error);
      toast({
        title: "Errore!",
        description: "Impossibile caricare le etichette.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
    fetchFeatures();
    fetchAllergens();
    fetchLabels();
  }, [fetchCategories, fetchFeatures, fetchAllergens, fetchLabels]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
      setSelectedProduct(null);
    } else {
      setProducts([]);
    }
  }, [selectedCategory, fetchProducts]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (isMobile) {
      setIsProductPanelOpen(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    if (isMobile) {
      setIsProductPanelOpen(true);
    }
  };

  const handleAddCategory = () => {
    setIsEditingCategory(false);
    setCategoryToEdit(null);
    formCategory.reset({ title: "", is_active: true, image_url: "" });
    setIsCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setIsEditingCategory(true);
    setCategoryToEdit(category);
    formCategory.reset(categoryToFormValues(category));
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategoryIdToDelete(categoryId);
    setIsDeleteCategoryAlertOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryIdToDelete) return;

    try {
      //await deleteCategoryFromDB(categoryIdToDelete);
      setCategories(categories.filter(category => category.id !== categoryIdToDelete));
      setSelectedCategory(null);
      toast({
        title: "Successo!",
        description: "Categoria eliminata con successo.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Errore!",
        description: "Impossibile eliminare la categoria.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteCategoryAlertOpen(false);
      setCategoryIdToDelete(null);
    }
  };

  const handleAddProduct = () => {
    setIsEditingProduct(false);
    setProductToEdit(null);
    formProduct.reset({ category_id: selectedCategory || "", title: "", price_standard: 0, is_active: true, has_price_suffix: false, has_multiple_prices: false });
    setIsProductDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditingProduct(true);
    setProductToEdit(product);
    formProduct.reset(productToFormValues(product));
    setIsProductDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductIdToDelete(productId);
    setIsDeleteProductAlertOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productIdToDelete) return;

    try {
      //await deleteProductFromDB(productIdToDelete);
      setProducts(products.filter(product => product.id !== productIdToDelete));
      setSelectedProduct(null);
      toast({
        title: "Successo!",
        description: "Prodotto eliminato con successo.",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Errore!",
        description: "Impossibile eliminare il prodotto.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteProductAlertOpen(false);
      setProductIdToDelete(null);
    }
  };

  const handleCategoryReorder = async (categoryId: string, direction: "up" | "down") => {
    try {
      //const updatedCategories = await reorderCategory(categoryId, direction);
      //setCategories(updatedCategories);
    } catch (error) {
      console.error("Error reordering category:", error);
      toast({
        title: "Errore!",
        description: "Impossibile riordinare la categoria.",
        variant: "destructive",
      });
    }
  };

  const handleProductReorder = async (productId: string, direction: "up" | "down") => {
    try {
      //const updatedProducts = await reorderProduct(productId, direction);
      //setProducts(updatedProducts);
    } catch (error) {
      console.error("Error reordering product:", error);
      toast({
        title: "Errore!",
        description: "Impossibile riordinare il prodotto.",
        variant: "destructive",
      });
    }
  };

  const onSubmitCategory = async (values: any) => {
    try {
      const newCategory: Category = {
        ...values,
        id: values.id ?? uuidv4(),
        image_url: values.image_url ?? "",
        description: values.description ?? "",
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? categories.length,
      };
      if (isEditingCategory && categoryToEdit) {
        setCategories(categories.map(c => c.id === newCategory.id ? newCategory : c));
        toast({
          title: "Successo!",
          description: "Categoria aggiornata con successo.",
        });
      } else {
        setCategories([...categories, newCategory]);
        toast({
          title: "Successo!",
          description: "Categoria creata con successo.",
        });
      }
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error creating/updating category:", error);
      toast({
        title: "Errore!",
        description: "Impossibile creare/aggiornare la categoria.",
        variant: "destructive",
      });
    }
  };

  const onSubmitProduct = async (values: any) => {
    try {
      const newProduct: Product = {
        ...values,
        id: values.id ?? uuidv4(),
        image_url: values.image_url ?? "",
        description: values.description ?? "",
        price_standard: Number(values.price_standard ?? 0),
        price_variant_1_value: values.price_variant_1_value ? Number(values.price_variant_1_value) : undefined,
        price_variant_2_value: values.price_variant_2_value ? Number(values.price_variant_2_value) : undefined,
        features: values.features ? features.filter(f => values.features.includes(f.id)) : [],
        allergens: values.allergens ? allergens.filter(a => values.allergens.includes(a.id)) : [],
        label: values.label ? labels.find(l => l.id === values.label) : undefined,
        is_active: values.is_active ?? true,
        display_order: values.display_order ?? products.length,
        category_id: values.category_id ?? "",
      };

      if (isEditingProduct && productToEdit) {
        // Update existing product
        setProducts(products.map(p => p.id === newProduct.id ? newProduct : p));
        toast({
          title: "Successo!",
          description: "Prodotto aggiornato con successo.",
        });
      } else {
        // Create new product
        setProducts([...products, newProduct]);
        toast({
          title: "Successo!",
          description: "Prodotto creato con successo.",
        });
      }
      setIsProductDialogOpen(false);
    } catch (error) {
      console.error("Error creating/updating product:", error);
      toast({
        title: "Errore!",
        description: "Impossibile creare/aggiornare il prodotto.",
        variant: "destructive",
      });
    }
  };

  const handleBackToCategories = () => {
    setIsProductPanelOpen(false);
    setSelectedProduct(null);
  };

  const handleEditProductDetail = () => {
    if (selectedProduct) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        handleEditProduct(product);
      }
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Category List */}
      <div className="w-80 border-r bg-white flex-shrink-0">
        <CategoriesList
          categories={categories}
          selectedCategory={selectedCategory || ""}
          isLoadingCategories={isLoadingCategories}
          onSelectCategory={handleCategorySelect}
          onCategoryReorder={handleCategoryReorder}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onAddCategory={handleAddCategory}
        />
      </div>

      {/* Product List or Detail Panel */}
      <div className="flex-1 flex flex-col">
        {!isMobile || !isProductPanelOpen ? (
          /* Product List */
          <ProductsList
            products={products}
            selectedProduct={selectedProduct || ""}
            searchQuery={searchQuery}
            onSelectProduct={handleProductSelect}
            isLoadingProducts={isLoadingProducts}
            onProductReorder={handleProductReorder}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAddProduct={handleAddProduct}
            setSearchQuery={setSearchQuery}
            isMobile={isMobile}
            selectedCategory={selectedCategory}
            onBackToCategories={isMobile ? handleBackToCategories : undefined}
            showBackButton={isMobile && isProductPanelOpen}
            allergens={allergens}
          />
        ) : (
          /* Product Detail Panel */
          <ProductDetailPanel
            product={products.find(p => p.id === selectedProduct) || null}
            categories={categories}
            onEdit={handleEditProductDetail}
            onBack={isMobile ? handleBackToCategories : undefined}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingCategory ? "Modifica Categoria" : "Crea Nuova Categoria"}</DialogTitle>
            <DialogDescription>
              {isEditingCategory
                ? "Modifica i dettagli della categoria esistente."
                : "Crea una nuova categoria per organizzare i tuoi prodotti."}
            </DialogDescription>
          </DialogHeader>
          <Form {...formCategory}>
            <form onSubmit={formCategory.handleSubmit(onSubmitCategory)} className="space-y-4">
              <FormField
                control={formCategory.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome della categoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formCategory.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Immagine</FormLabel>
                    <FormControl>
                      <Input placeholder="URL dell'immagine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formCategory.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Attiva</FormLabel>
                      <FormDescription>
                        Seleziona per rendere visibile la categoria.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">{isEditingCategory ? "Aggiorna" : "Crea"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditingProduct ? "Modifica Prodotto" : "Crea Nuovo Prodotto"}</DialogTitle>
            <DialogDescription>
              {isEditingProduct
                ? "Modifica i dettagli del prodotto esistente."
                : "Crea un nuovo prodotto nel tuo catalogo."}
            </DialogDescription>
          </DialogHeader>
          <Form {...formProduct}>
            <form onSubmit={formProduct.handleSubmit(onSubmitProduct)} className="space-y-4">
              <FormField
                control={formProduct.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>{category.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formProduct.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome del prodotto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formProduct.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrizione del prodotto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formProduct.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Immagine</FormLabel>
                    <FormControl>
                      <Input placeholder="URL dell'immagine" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formProduct.control}
                name="price_standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prezzo Standard</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Prezzo standard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formProduct.control}
                name="has_price_suffix"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Ha un suffisso di prezzo?</FormLabel>
                      <FormDescription>
                        Seleziona se il prezzo ha un suffisso (es. al kg).
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {formProduct.watch("has_price_suffix") && (
                <FormField
                  control={formProduct.control}
                  name="price_suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffisso Prezzo</FormLabel>
                      <FormControl>
                        <Input placeholder="Suffisso del prezzo (es. al kg)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={formProduct.control}
                name="has_multiple_prices"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Ha prezzi multipli?</FormLabel>
                      <FormDescription>
                        Seleziona se il prodotto ha prezzi diversi in base alla variante.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {formProduct.watch("has_multiple_prices") && (
                <>
                  <FormField
                    control={formProduct.control}
                    name="price_variant_1_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Variante Prezzo 1</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome della variante (es. Porzione singola)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formProduct.control}
                    name="price_variant_1_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valore Variante Prezzo 1</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Valore della variante" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formProduct.control}
                    name="price_variant_2_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Variante Prezzo 2</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome della variante (es. Porzione doppia)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formProduct.control}
                    name="price_variant_2_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valore Variante Prezzo 2</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Valore della variante" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={formProduct.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Attivo</FormLabel>
                      <FormDescription>
                        Seleziona per rendere visibile il prodotto.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">{isEditingProduct ? "Aggiorna" : "Crea"}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Alert */}
      <AlertDialog open={isDeleteCategoryAlertOpen} onOpenChange={setIsDeleteCategoryAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà la categoria e tutti i prodotti associati.
              Questa operazione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryIdToDelete(null)}>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Product Alert */}
      <AlertDialog open={isDeleteProductAlertOpen} onOpenChange={setIsDeleteProductAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà il prodotto. Questa operazione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductIdToDelete(null)}>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
