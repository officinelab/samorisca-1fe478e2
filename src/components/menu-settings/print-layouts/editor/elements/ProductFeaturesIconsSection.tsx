
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PrintLayout, ProductFeaturesConfig } from "@/types/printLayout";

interface ProductFeaturesIconsSectionProps {
  layout: PrintLayout;
  onProductFeaturesChange: (
    field: keyof ProductFeaturesConfig,
    value: any
  ) => void;
}

const ProductFeaturesIconsSection = ({ 
  layout, 
  onProductFeaturesChange 
}: ProductFeaturesIconsSectionProps) => {
  // Handle productFeatures icon configuration changes
  const handleProductFeaturesIconChange = (field: keyof ProductFeaturesConfig["icon"], value: number) => {
    console.log(`Updating ${field} to ${value}`); // Debug log
    const currentIcon = layout.productFeatures?.icon || { iconSize: 16, iconSpacing: 4, marginTop: 0, marginBottom: 0 };
    const newIcon = {
      ...currentIcon,
      [field]: value
    };
    console.log('New icon config:', newIcon); // Debug log
    onProductFeaturesChange('icon', newIcon);
  };

  return (
    <AccordionItem value="productFeaturesIcons">
      <AccordionTrigger>Icone caratteristiche prodotto</AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="icon-size">Dimensione icone (px)</Label>
            <Input
              id="icon-size"
              type="number"
              min="8"
              max="48"
              value={layout.productFeatures?.icon?.iconSize ?? 16}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                console.log('Input change for iconSize:', value); // Debug log
                if (!isNaN(value)) {
                  handleProductFeaturesIconChange('iconSize', value);
                }
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon-spacing">Spaziatura tra icone (px)</Label>
            <Input
              id="icon-spacing"
              type="number"
              min="0"
              max="20"
              value={layout.productFeatures?.icon?.iconSpacing ?? 4}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                console.log('Input change for iconSpacing:', value); // Debug log
                if (!isNaN(value)) {
                  handleProductFeaturesIconChange('iconSpacing', value);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin-top">Margine superiore (mm)</Label>
            <Input
              id="margin-top"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={layout.productFeatures?.icon?.marginTop ?? 0}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                console.log('Input change for marginTop:', value); // Debug log
                if (!isNaN(value)) {
                  handleProductFeaturesIconChange('marginTop', value);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin-bottom">Margine inferiore (mm)</Label>
            <Input
              id="margin-bottom"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={layout.productFeatures?.icon?.marginBottom ?? 0}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                console.log('Input change for marginBottom:', value); // Debug log
                if (!isNaN(value)) {
                  handleProductFeaturesIconChange('marginBottom', value);
                }
              }}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ProductFeaturesIconsSection;
