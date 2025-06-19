
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrintLayout, PrintLayoutElementConfig, ProductFeaturesConfig } from "@/types/printLayout";
import CategoryElementsSection from "./elements/CategoryElementsSection";
import DescriptionElementsSection from "./elements/DescriptionElementsSection";
import PriceElementsSection from "./elements/PriceElementsSection";

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
  return (
    <div className="space-y-4">
      <Tabs defaultValue="categoria" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categoria">Categoria e Prodotto</TabsTrigger>
          <TabsTrigger value="descrizioni">Descrizioni</TabsTrigger>
          <TabsTrigger value="prezzi">Prezzi e Allergeni</TabsTrigger>
        </TabsList>

        <TabsContent value="categoria" className="space-y-4 pt-4">
          <CategoryElementsSection
            layout={layout}
            onElementChange={onElementChange}
            onElementMarginChange={onElementMarginChange}
          />
        </TabsContent>

        <TabsContent value="descrizioni" className="space-y-4 pt-4">
          <DescriptionElementsSection
            layout={layout}
            onElementChange={onElementChange}
            onElementMarginChange={onElementMarginChange}
          />
        </TabsContent>

        <TabsContent value="prezzi" className="space-y-4 pt-4">
          <PriceElementsSection
            layout={layout}
            onElementChange={onElementChange}
            onElementMarginChange={onElementMarginChange}
            onProductFeaturesChange={onProductFeaturesChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElementsTab;
