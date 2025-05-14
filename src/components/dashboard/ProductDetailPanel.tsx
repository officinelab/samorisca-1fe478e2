
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Package, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export interface ProductDetailPanelProps {
  product: any;
  categories: Array<any>;
  onEdit: () => void;
}

const ProductDetailPanel: React.FC<ProductDetailPanelProps> = ({
  product,
  categories,
  onEdit,
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
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Dettagli Prodotto</h2>
        <div className="flex space-x-2">
          <Button size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" /> Modifica
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          <div className="flex space-x-4">
            {product.image_url ? (
              <div className="w-32 h-32 rounded-md overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{product.title}</h1>
                  {product.label && (
                    <span
                      className="px-2 py-0.5 rounded-full text-sm inline-block mt-1"
                      style={{
                        backgroundColor: product.label.color || "#e2e8f0",
                        color: product.label.color ? "#fff" : "#000",
                      }}
                    >
                      {product.label.title}
                    </span>
                  )}
                </div>
                {!product.is_active && (
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    Non disponibile
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-gray-700 mt-2">{product.description}</p>
              )}

              <div className="mt-4">
                <div className="flex items-center">
                  <span className="text-gray-600 font-medium">Categoria: </span>
                  <span className="ml-2">
                    {
                      categories.find((c: any) => c.id === product.category_id)
                        ?.title || ""
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Prezzi */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {/* Mostra solo il prezzo con il suffisso, senza testo "Prezzo standard" */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>
                    {product.price_standard} €
                    {" "}
                    {product.has_price_suffix && product.price_suffix && (
                      <span className="text-gray-500 text-base">
                        {product.price_suffix}
                      </span>
                    )}
                  </span>
                </div>
                {/* Varianti prezzo: solo valore e nome variante */}
                {product.has_multiple_prices && (
                  <div className="flex flex-col gap-1">
                    {product.price_variant_1_name &&
                      product.price_variant_1_value !== null && (
                        <div className="flex justify-between items-center">
                          <span>
                            {product.price_variant_1_value} €{" "}
                            <span className="text-gray-700 text-sm">
                              {product.price_variant_1_name}
                            </span>
                          </span>
                        </div>
                      )}
                    {product.price_variant_2_name &&
                      product.price_variant_2_value !== null && (
                        <div className="flex justify-between items-center">
                          <span>
                            {product.price_variant_2_value} €{" "}
                            <span className="text-gray-700 text-sm">
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

          {/* Caratteristiche */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Caratteristiche</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature: any) => (
                    <div
                      key={feature.id}
                      className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
                    >
                      {feature.icon_url && (
                        <img
                          src={feature.icon_url}
                          alt={feature.title}
                          className="w-4 h-4 mr-1"
                        />
                      )}
                      {feature.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Allergeni */}
          {product.allergens && product.allergens.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Allergeni</h3>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map((allergen: any) => (
                    <div
                      key={allergen.id}
                      className="bg-gray-100 rounded-full px-3 py-1"
                    >
                      {allergen.number}: {allergen.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info tecniche */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">
                Informazioni tecniche
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">ID</TableCell>
                    <TableCell>{product.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Ordine di visualizzazione
                    </TableCell>
                    <TableCell>{product.display_order}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Creato il</TableCell>
                    <TableCell>
                      {product.created_at &&
                        new Date(product.created_at).toLocaleDateString(
                          "it-IT"
                        )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Ultimo aggiornamento
                    </TableCell>
                    <TableCell>
                      {product.updated_at &&
                        new Date(product.updated_at).toLocaleDateString(
                          "it-IT"
                        )}
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

export default ProductDetailPanel;
