
import React from "react";
import { Card, CardContent, CardImage } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product, Category } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { ProductFeaturesIcons } from "@/components/public-menu/product-card/ProductFeaturesIcons";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

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

  // Sezione Label prodotto
  const label = product.label;
  // Caratteristiche & Allergeni
  const features = product.features ?? [];
  const allergens = product.allergens ?? [];
  // Prezzi
  const priceStandard = product.price_standard ? Number(product.price_standard).toFixed(2) : null;
  const prices = [
    product.price_variant_1_value !== null && product.price_variant_1_name
      ? { label: product.price_variant_1_name, value: Number(product.price_variant_1_value).toFixed(2) }
      : null,
    product.price_variant_2_value !== null && product.price_variant_2_name
      ? { label: product.price_variant_2_name, value: Number(product.price_variant_2_value).toFixed(2) }
      : null
  ].filter(Boolean);
  const isActive = product.is_active;

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Header ristrutturato con flex per pulsante Modifica */}
      <Card className="mb-4">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Immagine grande */}
          <div className="flex-shrink-0 flex justify-center items-center">
            <CardImage 
              src={product.image_url || "/placeholder.svg"} 
              alt={product.title}
              square 
              className="w-32 h-32 rounded-md overflow-hidden border shadow-sm bg-gray-50"
            />
          </div>
          {/* Header info principali + azioni */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex flex-row items-start justify-between mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold">{product.title}</h2>
                  {isActive
                    ? <Badge variant="default" className="ml-1">Attivo</Badge>
                    : <Badge variant="secondary" className="ml-1">Disattivo</Badge>
                  }
                  {label &&
                    <Badge style={
                      label.color
                        ? { backgroundColor: label.color, color: label.text_color ?? "#fff" }
                        : {}
                    }>
                      {label.title}
                    </Badge>
                  }
                </div>
                <div className="text-gray-500 text-sm">
                  Categoria: <span className="font-semibold">{selectedCategory?.title || "-"}</span>
                </div>
              </div>
              <div className="shrink-0">
                <Button size="sm" onClick={onEditProduct} variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Modifica
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs mb-0">Descrizione</Label>
              <div className="text-gray-600 whitespace-pre-line mt-1">
                {product.description || <span className="italic text-gray-400">Nessuna descrizione</span>}
              </div>
            </div>
            {features.length > 0 && (
              <div>
                <Label className="text-xs mb-0">Caratteristiche</Label>
                <ProductFeaturesIcons features={features} />
              </div>
            )}
            <Separator className="my-2" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Prezzo standard</Label>
                <div className="font-semibold mt-1">{priceStandard ? `€ ${priceStandard}` : "—"}</div>
              </div>
              {prices.length > 0 && (
                <div>
                  <Label className="text-xs">Varianti prezzo</Label>
                  <div className="flex flex-col gap-1 mt-1">
                    {prices.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs">{p.label}</span> 
                        <span className="font-medium">€ {p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {product.price_suffix && (
              <div>
                <Label className="text-xs">Suffisso prezzo</Label>
                <div className="text-gray-700">{product.price_suffix}</div>
              </div>
            )}
          </div>
        </div>
      </Card>
      {/* Allergeni */}
      {allergens.length > 0 && (
        <Card className="mb-4">
          <CardContent>
            <Label className="text-xs">Allergeni</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {allergens.map((all) => (
                <div
                  key={all.id}
                  className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-xs"
                >
                  {all.icon_url && (
                    <img src={all.icon_url} alt={all.title} className="w-4 h-4 mr-1" />
                  )}
                  {all.number}: {all.title}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Dettagli tecnici */}
      <Card>
        <CardContent>
          <Label className="text-xs">Informazioni tecniche</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">ID</span>
              <span className="font-mono text-sm">{product.id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Ordine di visualizzazione</span>
              <span className="text-sm">{product.display_order}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Creato il</span>
              <span className="text-sm">
                {product.created_at
                  ? new Date(product.created_at).toLocaleDateString('it-IT')
                  : "—"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs">Ultimo aggiornamento</span>
              <span className="text-sm">
                {product.updated_at
                  ? new Date(product.updated_at).toLocaleDateString('it-IT')
                  : "—"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;
