
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesConfig } from "@/types/printLayout";
import ElementEditor from "../../ElementEditor";
import ProductFeaturesIconsSection from "./ProductFeaturesIconsSection";

interface PriceElementsSectionProps {
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

const PriceElementsSection = ({ 
  layout, 
  onElementChange, 
  onElementMarginChange,
  onProductFeaturesChange 
}: PriceElementsSectionProps) => {
  // Create a suffix element with default margin for ElementEditor compatibility
  const suffixElementWithMargin = {
    ...layout.elements.suffix,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  };

  return (
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

      <ProductFeaturesIconsSection
        layout={layout}
        onProductFeaturesChange={onProductFeaturesChange}
      />

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
  );
};

export default PriceElementsSection;
