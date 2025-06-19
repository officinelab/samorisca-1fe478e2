
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";
import ElementEditor from "../../ElementEditor";

interface DescriptionElementsSectionProps {
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
}

const DescriptionElementsSection = ({ 
  layout, 
  onElementChange, 
  onElementMarginChange 
}: DescriptionElementsSectionProps) => {
  return (
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
  );
};

export default DescriptionElementsSection;
