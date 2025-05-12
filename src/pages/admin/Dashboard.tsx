
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash, ChevronUp } from 'lucide-react';
import { Product } from "@/types/database";
import ProductForm from "@/components/product/ProductForm";
import { toast } from "@/components/ui/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area"

// Funzione per ottenere i prodotti
const getProducts = async (searchTerm: string, categoryId: string | null) => {
  let query = supabase
    .from('products')
    .select('*, category:category_id(*), label:label_id(*)');
  
  if (searchTerm) {
    query = query.ilike('title', `%${searchTerm}%`);
  }
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query.order('display_order');
  
  if (error) {
    throw error;
  }
  
  return data || [];
};

// Funzione per eliminare un prodotto
const deleteProduct = async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Componente per selezionare le categorie
const CategoriesSelect = ({ onChange, value }: { onChange: (value: string | null) => void, value: string | null }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Errore nel caricamento categorie:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <div className="space-y-2">
      <Button
        variant={value === null ? "default" : "outline"}
        className="w-full justify-start"
        onClick={() => onChange(null)}
      >
        Tutte le categorie
      </Button>
      
      {isLoading ? (
        <div className="py-2 text-center text-sm text-muted-foreground">Caricamento...</div>
      ) : (
        categories.map(category => (
          <Button
            key={category.id}
            variant={value === category.id ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onChange(category.id)}
          >
            {category.title}
          </Button>
        ))
      )}
    </div>
  );
};

// Componente di ricerca ottimizzato che mantiene il focus
const SearchBar = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Cerca prodotti..."
        value={searchTerm}
        onChange={handleChange}
        className="pl-10"
      />
    </div>
  );
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Gestione del pulsante "Torna su"
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Fetch products
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory],
    queryFn: () => getProducts(searchTerm, selectedCategory),
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Prodotto eliminato con successo!');
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate and refetch products
    },
    onError: (error) => {
      toast.error(`Errore durante l'eliminazione del prodotto: ${error.message}`);
    },
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    // Scorrimento automatico verso l'alto quando si modifica un prodotto
    scrollToTop();
  };

  const handleCancelEdit = () => {
    setSelectedProduct(null);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      await deleteProductMutation.mutateAsync(productId);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestione Menu</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <SearchBar onSearch={handleSearch} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Categories */}
        <div className="md:col-span-1">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Categorie</h2>
              <CategoriesSelect onChange={handleCategoryChange} value={selectedCategory} />
            </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <div className="md:col-span-3">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Prodotti</h2>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">Caricamento...</TableCell>
                      </TableRow>
                    )}
                    {isError && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">Errore nel caricamento dei prodotti.</TableCell>
                      </TableRow>
                    )}
                    {products && products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.title}</TableCell>
                        <TableCell>{product.category?.title}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Apri menù</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(product)}>
                                <Pencil className="mr-2 h-4 w-4" /> Modifica
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                                <Trash className="mr-2 h-4 w-4" /> Elimina
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Form */}
      {selectedProduct && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Modifica Prodotto</h2>
          <Card>
            <CardContent>
              <ProductForm product={selectedProduct} onCancel={handleCancelEdit} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all"
          aria-label="Torna all'inizio"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
