
import { PrintLayout } from "@/types/printLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PrintLayoutsList from "./PrintLayoutsList";

interface DefaultPrintLayoutCardProps {
  layout: PrintLayout | null;
}

const DefaultPrintLayoutCard = ({ layout }: DefaultPrintLayoutCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-base">
        Layout Predefinito
      </CardTitle>
      <CardDescription className="text-xs">
        Questo è l'unico layout disponibile per la stampa.
      </CardDescription>
    </CardHeader>
    <Separator />
    <CardContent className="py-4">
      {layout ? (
        <PrintLayoutsList
          layouts={[layout]}
          single
          onSelectLayout={undefined}
          onCloneLayout={undefined}
          onDeleteLayout={undefined}
          onSetDefaultLayout={undefined}
          defaultFirst={true}
        />
      ) : (
        <div className="text-center text-muted-foreground text-sm py-6">
          Nessun layout disponibile.
        </div>
      )}
    </CardContent>
  </Card>
);

export default DefaultPrintLayoutCard;
