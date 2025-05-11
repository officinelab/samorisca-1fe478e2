
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PrintLayout, PrintLayoutElementConfig } from "@/types/printLayout";
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
}

const ElementsTab = ({ layout, onElementChange, onElementMarginChange }: ElementsTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default ElementsTab;
