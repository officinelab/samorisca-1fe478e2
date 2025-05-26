
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/database";
import ProductAllergensCheckboxes from "@/components/product/ProductAllergensCheckboxes";
import ProductFeaturesCheckboxes from "@/components/product/ProductFeaturesCheckboxes";

/**
 * Interfaccia per le props della finestra modale di modifica prodotto
 */
interface StandaloneProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

// Componente indipendente: Modifica prodotto con gestione locale dello stato (demo)
const StandaloneProductEditDialog: React.FC<StandaloneProductEditDialogProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  // Stato locale per i campi della scheda prodotto
  const [title, setTitle] = useState(product.title || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price_standard ? String(product.price_standard) : "");
  const [isActive, setIsActive] = useState(product.is_active ?? true);
  const [imageUrl, setImageUrl] = useState(product.image_url || "");
  // Checkbox multiple
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>(
    Array.isArray(product.allergens) ? product.allergens.map(a => a.id) : []
  );
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>(
    Array.isArray(product.features) ? product.features.map(f => f.id) : []
  );
  // Campo etichetta (id, opzionale)
  const [labelId, setLabelId] = useState(product.label_id || "");
  // Altri campi demo: suffisso e varianti prezzo (opzionali)
  const [priceSuffix, setPriceSuffix] = useState(product.price_suffix || "");
  const [priceVariant1Name, setPriceVariant1Name] = useState(product.price_variant_1_name || "");
  const [priceVariant1Value, setPriceVariant1Value] = useState(
    product.price_variant_1_value ? String(product.price_variant_1_value) : ""
  );
  const [priceVariant2Name, setPriceVariant2Name] = useState(product.price_variant_2_name || "");
  const [priceVariant2Value, setPriceVariant2Value] = useState(
    product.price_variant_2_value ? String(product.price_variant_2_value) : ""
  );
  const [hasMultiplePrices, setHasMultiplePrices] = useState(Boolean(product.has_multiple_prices));
  const [hasPriceSuffix, setHasPriceSuffix] = useState(Boolean(product.has_price_suffix));

  // Reset locale ogni volta che cambi prodotto o si apre la dialog
  useEffect(() => {
    setTitle(product.title || "");
    setDescription(product.description || "");
    setPrice(product.price_standard ? String(product.price_standard) : "");
    setIsActive(product.is_active ?? true);
    setImageUrl(product.image_url || "");
    setSelectedAllergenIds(Array.isArray(product.allergens) ? product.allergens.map(a => a.id) : []);
    setSelectedFeatureIds(Array.isArray(product.features) ? product.features.map(f => f.id) : []);
    setLabelId(product.label_id || "");
    setPriceSuffix(product.price_suffix || "");
    setPriceVariant1Name(product.price_variant_1_name || "");
    setPriceVariant1Value(product.price_variant_1_value ? String(product.price_variant_1_value) : "");
    setPriceVariant2Name(product.price_variant_2_name || "");
    setPriceVariant2Value(product.price_variant_2_value ? String(product.price_variant_2_value) : "");
    setHasMultiplePrices(Boolean(product.has_multiple_prices));
    setHasPriceSuffix(Boolean(product.has_price_suffix));
  }, [product, open]);

  // Simula salvataggio locale (DEMO)
  const handleSave = () => {
    // Qui metteresti la logica reale di update/salvataggio
    onOpenChange(false);
    alert("Prodotto aggiornato (demo).\n" + 
      `Nome: ${title}\n` +
      `Allergeni selezionati: ${selectedAllergenIds.join(",")}\n` +
      `Caratteristiche selezionate: ${selectedFeatureIds.join(",")}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Modifica prodotto (Modal Indipendente)</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 pb-2" onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}>
          <div>
            <Label>Nome prodotto</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Descrizione</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Prezzo Standard (€)</Label>
            <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <Label>Immagine (URL)</Label>
            <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <span>Attivo</span>
          </div>
          <div>
            <Label>Suffisso prezzo</Label>
            <Input value={priceSuffix} onChange={e => setPriceSuffix(e.target.value)} placeholder="es: a porzione, al pezzo"/>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={hasMultiplePrices} onCheckedChange={setHasMultiplePrices} />
            <span>Ha varianti di prezzo</span>
          </div>
          {hasMultiplePrices && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Variante 1 (nome)</Label>
                  <Input value={priceVariant1Name} onChange={e => setPriceVariant1Name(e.target.value)} />
                </div>
                <div>
                  <Label>Variante 1 (prezzo €)</Label>
                  <Input type="number" step="0.01" value={priceVariant1Value} onChange={e => setPriceVariant1Value(e.target.value)} />
                </div>
                <div>
                  <Label>Variante 2 (nome)</Label>
                  <Input value={priceVariant2Name} onChange={e => setPriceVariant2Name(e.target.value)} />
                </div>
                <div>
                  <Label>Variante 2 (prezzo €)</Label>
                  <Input type="number" step="0.01" value={priceVariant2Value} onChange={e => setPriceVariant2Value(e.target.value)} />
                </div>
              </div>
            </>
          )}

          <ProductAllergensCheckboxes
            productId={product.id}
            selectedAllergenIds={selectedAllergenIds}
            setSelectedAllergenIds={setSelectedAllergenIds}
            loading={false}
          />

          <ProductFeaturesCheckboxes
            productId={product.id}
            selectedFeatureIds={selectedFeatureIds}
            setSelectedFeatureIds={setSelectedFeatureIds}
            loading={false}
          />

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit" variant="default">Salva modifiche</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StandaloneProductEditDialog;
