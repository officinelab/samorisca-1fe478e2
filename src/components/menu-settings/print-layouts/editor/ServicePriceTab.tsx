
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintLayout, PrintLayoutElementConfig, ServicePriceConfig } from "@/types/printLayout";
import ElementEditor from "../ElementEditor";

interface ServicePriceTabProps {
  layout: PrintLayout;
  onServicePriceChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onServicePriceMarginChange: (marginKey: keyof PrintLayoutElementConfig["margin"], value: number) => void;
}

const ServicePriceTab = ({ 
  layout, 
  onServicePriceChange, 
  onServicePriceMarginChange 
}: ServicePriceTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurazione Prezzo Servizio</CardTitle>
        </CardHeader>
        <CardContent>
          <ElementEditor
            element={layout.servicePrice}
            onChange={onServicePriceChange}
            onMarginChange={onServicePriceMarginChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicePriceTab;
