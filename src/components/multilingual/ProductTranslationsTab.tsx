
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TranslationField } from "./TranslationField";
import { supabase } from "@/integrations/supabase/client";
import { SupportedLanguage } from "@/types/translation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category, Product } from "@/types/database";

interface ProductTranslationsTabProps {
  language: SupportedLanguage;
}

export const ProductTranslationsTab = ({ language }: ProductTranslationsTabProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, title, is_active, display_order, image_url, description')
          .order('display_order', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setCategories(data || []);
        
        if (data && data.length > 0) {
          setSelectedCategoryId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (!selectedCategoryId) return;
    
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setSelectedProduct(null);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, title, description, 
            price_standard, price_suffix, 
            price_variant_1_name, price_variant_2_name,
            has_price_suffix, has_multiple_prices,
            image_url, category_id, is_active, display_order
          `)
          .eq('category_id', selectedCategoryId)
          .order('display_order', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategoryId]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
  };
  
  const handleProductSelect = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, title, description, 
          price_standard, price_suffix, 
          price_variant_1_name, price_variant_2_name,
          has_price_suffix, has_multiple_prices,
          image_url, category_id, is_active, display_order,
          label:label_id(id, title, color),
          allergens:product_allergens(allergen:allergen_id(id, title, number)),
          features:product_to_features(feature:feature_id(id, title))
        `)
        .eq('id', productId)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Format product with allergens and features arrays
      const formattedProduct = {
        ...data,
        allergens: data.allergens?.map((a: any) => a.allergen) || [],
        features: data.features?.map((f: any) => f.feature) || []
      } as unknown as Product;
      
      setSelectedProduct(formattedProduct);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categoria</h3>
              {loadingCategories ? (
                <div>Caricamento categorie...</div>
              ) : (
                <Select
                  value={selectedCategoryId}
                  onValueChange={handleCategoryChange}
                  disabled={categories.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Prodotti</h3>
              {loadingProducts ? (
                <div>Caricamento prodotti...</div>
              ) : products.length === 0 ? (
                <div>Nessun prodotto in questa categoria</div>
              ) : (
                <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      className={`w-full text-left p-3 hover:bg-muted transition-colors ${
                        selectedProduct?.id === product.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleProductSelect(product.id)}
                    >
                      {product.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            {!selectedProduct ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Seleziona un prodotto per visualizzare e modificare le traduzioni
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  {selectedProduct.image_url && (
                    <img 
                      src={selectedProduct.image_url}
                      alt={selectedProduct.title}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
                    {selectedProduct.description && (
                      <p className="text-muted-foreground text-sm mt-1">
                        {selectedProduct.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Originale (Italiano)</TableHead>
                      <TableHead className="w-2/3">Traduzione</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Title translation */}
                    <TableRow>
                      <TableCell className="align-top font-medium">
                        Nome: {selectedProduct.title}
                      </TableCell>
                      <TableCell>
                        <TranslationField
                          id={selectedProduct.id}
                          entityType="products"
                          fieldName="title"
                          originalText={selectedProduct.title}
                          language={language}
                        />
                      </TableCell>
                    </TableRow>
                    
                    {/* Description translation (if available) */}
                    {selectedProduct.description && (
                      <TableRow>
                        <TableCell className="align-top">
                          <div className="font-medium">Descrizione:</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {selectedProduct.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <TranslationField
                            id={selectedProduct.id}
                            entityType="products"
                            fieldName="description"
                            originalText={selectedProduct.description}
                            language={language}
                            multiline
                          />
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {/* Price suffix translation (if available) */}
                    {selectedProduct.has_price_suffix && selectedProduct.price_suffix && (
                      <TableRow>
                        <TableCell className="align-top font-medium">
                          Suffisso prezzo: {selectedProduct.price_suffix}
                        </TableCell>
                        <TableCell>
                          <TranslationField
                            id={selectedProduct.id}
                            entityType="products"
                            fieldName="price_suffix"
                            originalText={selectedProduct.price_suffix}
                            language={language}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {/* Price variant names translations (if available) */}
                    {selectedProduct.has_multiple_prices && selectedProduct.price_variant_1_name && (
                      <TableRow>
                        <TableCell className="align-top font-medium">
                          Variante 1: {selectedProduct.price_variant_1_name}
                        </TableCell>
                        <TableCell>
                          <TranslationField
                            id={selectedProduct.id}
                            entityType="products"
                            fieldName="price_variant_1_name"
                            originalText={selectedProduct.price_variant_1_name}
                            language={language}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                    
                    {selectedProduct.has_multiple_prices && selectedProduct.price_variant_2_name && (
                      <TableRow>
                        <TableCell className="align-top font-medium">
                          Variante 2: {selectedProduct.price_variant_2_name}
                        </TableCell>
                        <TableCell>
                          <TranslationField
                            id={selectedProduct.id}
                            entityType="products"
                            fieldName="price_variant_2_name"
                            originalText={selectedProduct.price_variant_2_name}
                            language={language}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
