
import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DraggableLabelRow } from "./DraggableLabelRow";
import { ProductLabel } from "@/hooks/menu-settings/useProductLabels";

interface LabelsTableProps {
  labels: ProductLabel[];
  isLoading: boolean;
  onAddLabel: () => void;
  onEditLabel: (label: ProductLabel) => void;
  onDeleteLabel: (id: string) => void;
  onRefresh: () => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
}

export const LabelsTable = ({
  labels,
  isLoading,
  onAddLabel,
  onEditLabel,
  onDeleteLabel,
  onRefresh,
  onDragStart,
  onDragOver,
  onDrop
}: LabelsTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (labels.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">Nessuna etichetta trovata</p>
        <Button variant="link" onClick={onAddLabel}>
          Crea la prima etichetta
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onAddLabel} className="flex items-center gap-2">
          <Plus size={16} /> Nuova Etichetta
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          title="Aggiorna"
        >
          <RefreshCw size={18} />
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "50px" }}></TableHead>
            <TableHead>Titolo</TableHead>
            <TableHead>Anteprima</TableHead>
            <TableHead>Colori</TableHead>
            <TableHead style={{ width: "100px" }}>Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labels.map((label) => (
            <DraggableLabelRow
              key={label.id}
              label={label}
              onEdit={onEditLabel}
              onDelete={onDeleteLabel}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
};
