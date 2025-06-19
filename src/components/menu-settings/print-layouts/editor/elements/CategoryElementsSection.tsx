
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";
import ElementEditor from "../../ElementEditor";

interface CategoryElementsSectionProps {
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

const CategoryElementsSection = ({ 
  layout, 
  onElementChange, 
  onElementMarginChange 
}: CategoryElementsSectionProps) => {
  return (
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
  );
};

export default CategoryElementsSection;
