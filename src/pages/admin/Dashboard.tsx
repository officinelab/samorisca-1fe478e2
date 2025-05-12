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
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { Product } from "@/types";
import ProductForm from "@/components/menu-form/ProductForm";
import { toast } from "@/components/ui/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getProducts } from "@/lib/api/products";
import { CategoriesSelect } from "@/components/menu-form/CategoriesSelect";
import { ScrollArea } from "@/components/ui/scroll-area"

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
        {/* <Button variant="outline">Nuovo Prodotto</Button> */}
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
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category?.name}</TableCell>
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
    </div>
  );
};

export default Dashboard;
