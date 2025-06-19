
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesConfig } from "@/types/printLayout";
import ElementEditor from "../ElementEditor";

interface ElementsTabProps {
  layout: PrintLayout;
  onElementChange: (
    elementKey: keyof PrintLayout["elements"],
    field: keyof PrintLayoutElementConfig,
    value: any
  ) => void;
  onElementMarginChange: (
    elementKey: keyof PrintLayout["elements"],
    marginKey: keyof PrintLayoutElementConfig["margin"],
    value: number
  ) => void;
  onProductFeaturesChange: (
    field: keyof ProductFeaturesConfig,
    value: any
  ) => void;
}

const ElementsTab = ({ 
  layout, 
  onElementChange, 
  onElementMarginChange,
  onProductFeaturesChange 
}: ElementsTabProps) => {
  // Handle productFeatures icon configuration changes
  const handleProductFeaturesIconChange = (field: keyof ProductFeaturesConfig["icon"], value: number) => {
    const currentIcon = layout.productFeatures?.icon || { iconSize: 16, iconSpacing: 4, marginTop: 0, marginBottom: 0 };
    onProductFeaturesChange('icon', {
      ...currentIcon,
      [field]: value
    });
  };

  // Create a suffix element with default margin for ElementEditor compatibility
  const suffixElementWithMargin = {
    ...layout.elements.suffix,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="categoria" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categoria">Categoria e Prodotto</TabsTrigger>
          <TabsTrigger value="descrizioni">Descrizioni</TabsTrigger>
          <TabsTrigger value="prezzi">Prezzi e Allergeni</TabsTrigger>
        </TabsList>

        <TabsContent value="categoria" className="space-y-4 pt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="category">
              <AccordionTrigger>Categoria</AccordionTrigger>
              <AccordionContent>
                <ElementEditor
                  element={layout.elements.category}
                  onChange={(field, value) => onElementChange("category", field, value)}
                  onMarginChange={(field, value) => onElementMarginChange("category", field, value)}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="title">
              <AccordionTrigger>Titolo Prodotto</AccordionTrigger>
              <AccordionContent>
                <ElementEditor
                  element={layout.elements.title}
                  onChange={(field, value) => onElementChange("title", field, value)}
                  onMarginChange={(field, value) => onElementMarginChange("title", field, value)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="descrizioni" className="space-y-4 pt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Descrizione Prodotto</AccordionTrigger>
              <AccordionContent>
                <ElementEditor
                  element={layout.elements.description}
                  onChange={(field, value) => onElementChange("description", field, value)}
                  onMarginChange={(field, value) => onElementMarginChange("description", field, value)}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="descriptionEng">
              <AccordionTrigger>Descrizione Prodotto ENG</AccordionTrigger>
              <AccordionContent>
                <ElementEditor
                  element={layout.elements.descriptionEng}
                  onChange={(field, value) => onElementChange("descriptionEng", field, value)}
                  onMarginChange={(field, value) => onElementMarginChange("descriptionEng", field, value)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <TabsContent value="prezzi" className="space-y-4 pt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="allergens">
              <AccordionTrigger>Allergeni</AccordionTrigger>
              <AccordionContent>
                <ElementEditor
                  element={layout.elements.allergensList}
                  onChange={(field, value) => onElementChange("allergensList", field, value)}
                  onMarginChange={(field, value) => onElementMarginChange("allergensList", field, value)}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price">
              <AccordionTrigger>Prezzo</AccordionTrigger>
              <AccordionContent>
                <ElementEditor
                  element={layout.elements.price}
                  onChange={(field, value) => onElementChange("price", field, value)}
                  onMarginChange={(field, value) => onElementMarginChange("price", field, value)}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="productFeaturesIcons">
              <AccordionTrigger>Icone caratteristiche prodotto</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dimensione icone (px)</label>
                    <input
                      type="number"
                      min="8"
                      max="48"
                      value={layout.productFeatures?.icon?.iconSize || 16}
                      onChange={(e) => handleProductFeaturesIconChange('iconSize', parseInt(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Spaziatura tra icone (px)</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={layout.productFeatures?.icon?.iconSpacing || 4}
                      onChange={(e) => handleProductFeaturesIconChange('iconSpacing', parseInt(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Margine superiore (mm)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={layout.productFeatures?.icon?.marginTop || 0}
                      onChange={(e) => handleProductFeaturesIconChange('marginTop', parseFloat(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Margine inferiore (mm)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={layout.productFeatures?.icon?.marginBottom || 0}
                      onChange={(e) => handleProductFeaturesIconChange('marginBottom', parseFloat(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="suffix">
              <AccordionTrigger>Suffisso</AccordionTrigger>
              <AccordionContent>
                <ElementEditor
                  element={suffixElementWithMargin}
                  onChange={(field, value) => onElementChange("suffix", field, value)}
                  onMarginChange={(field, value) => onElementMarginChange("suffix", field, value)}
                  hideMarginControls={true}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="priceVariants">
              <AccordionTrigger>Varianti Prezzo</AccordionTrigger>
              <AccordionContent>
                <ElementEditor
                  element={layout.elements.priceVariants}
                  onChange={(field, value) => onElementChange("priceVariants", field, value)}
                  onMarginChange={(field, value) => onElementMarginChange("priceVariants", field, value)}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElementsTab;
