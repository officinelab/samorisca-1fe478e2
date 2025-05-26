
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Package } from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product, Category } from "@/types/database";

interface ProductDetailProps {
  product: Product | null;
  selectedCategory: Category | null;
  onEditProduct: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  selectedCategory,
  onEditProduct
}) => {
  if (!product) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Seleziona un prodotto per visualizzare i dettagli.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className={dashboardStyles.detailHeader}>
        <h2 className={dashboardStyles.detailTitle}>Dettagli Prodotto</h2>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={onEditProduct}
          >
            <Edit className="h-4 w-4 mr-2" /> Modifica
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className={dashboardStyles.detailContent}>
          <div className={dashboardStyles.detailMainSection}>
            {product.image_url ? (
              <div className={dashboardStyles.detailImage}>
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={dashboardStyles.detailImagePlaceholder}>
                <Package className="h-10 w-10 text-gray-400" />
              </div>
            )}
            
            <div className={dashboardStyles.detailProductInfo}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className={dashboardStyles.detailProductTitle}>{product.title}</h1>
                  {product.label && (
                    <span 
                      className={dashboardStyles.detailProductLabel}
                      style={{ 
                        backgroundColor: product.label.color || '#e2e8f0',
                        color: product.label.color ? '#fff' : '#000'
                      }}
                    >
                      {product.label.title}
                    </span>
                  )}
                </div>
                {!product.is_active && (
                  <span className={dashboardStyles.detailUnavailableStatus}>
                    Non disponibile
                  </span>
                )}
              </div>
              
              {product.description && (
                <p className={dashboardStyles.detailProductDescription}>{product.description}</p>
              )}
              
              <div className={dashboardStyles.detailCategoryInfo}>
                <div className="flex items-center">
                  <span className={dashboardStyles.detailCategoryLabel}>Categoria: </span>
                  <span className={dashboardStyles.detailCategoryValue}>
                    {selectedCategory?.title || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <Card>
            <CardContent className="pt-6">
              <div className={dashboardStyles.tableContainer}>
                <div className={dashboardStyles.priceInfo}>
                  <span>
                    {product.price_standard} €{' '}
                    {product.has_price_suffix && product.price_suffix && (
                      <span className="text-gray-500 text-base">{product.price_suffix}</span>
                    )}
                  </span>
                </div>
                {product.has_multiple_prices && (
                  <div className={dashboardStyles.priceVariants}>
                    {product.price_variant_1_name && product.price_variant_1_value != null && (
                      <div className={dashboardStyles.priceVariant}>
                        <span>
                          {product.price_variant_1_value} €{' '}
                          <span className={dashboardStyles.priceVariantValue}>
                            {product.price_variant_1_name}
                          </span>
                        </span>
                      </div>
                    )}
                    {product.price_variant_2_name && product.price_variant_2_value != null && (
                      <div className={dashboardStyles.priceVariant}>
                        <span>
                          {product.price_variant_2_value} €{' '}
                          <span className={dashboardStyles.priceVariantValue}>
                            {product.price_variant_2_name}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {product.features && product.features.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Caratteristiche</h3>
                
                <div className={dashboardStyles.featuresGrid}>
                  {product.features.map((feature) => (
                    <div 
                      key={feature.id}
                      className={dashboardStyles.featuresDisplay}
                    >
                      {feature.icon_url && (
                        <img src={feature.icon_url} alt={feature.title} className={dashboardStyles.featureIcon} />
                      )}
                      {feature.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {product.allergens && product.allergens.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Allergeni</h3>
                
                <div className={dashboardStyles.featuresGrid}>
                  {product.allergens.map((allergen) => (
                    <div 
                      key={allergen.id}
                      className={dashboardStyles.allergensDisplay}
                    >
                      {allergen.number}: {allergen.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Informazioni tecniche</h3>
              
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">ID</TableCell>
                    <TableCell>{product.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ordine di visualizzazione</TableCell>
                    <TableCell>{product.display_order}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Creato il</TableCell>
                    <TableCell>
                      {product.created_at && new Date(product.created_at).toLocaleDateString('it-IT')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ultimo aggiornamento</TableCell>
                    <TableCell>
                      {product.updated_at && new Date(product.updated_at).toLocaleDateString('it-IT')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductDetail;
