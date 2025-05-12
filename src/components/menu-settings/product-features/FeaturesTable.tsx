
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductFeature } from "@/types/database";
import FeatureRow from "./FeatureRow";
import EmptyFeatureState from "./EmptyFeatureState";

interface FeaturesTableProps {
  features: ProductFeature[];
  isLoading: boolean;
  onAddNew: () => void;
  onEdit: (feature: ProductFeature) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetId: string) => void;
}

export const FeaturesTable: React.FC<FeaturesTableProps> = ({
  features,
  isLoading,
  onAddNew,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (features.length === 0) {
    return <EmptyFeatureState onAddNew={onAddNew} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: "50px" }}></TableHead>
          <TableHead>Titolo</TableHead>
          <TableHead>Icona</TableHead>
          <TableHead style={{ width: "100px" }}>Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {features.map((feature) => (
          <FeatureRow 
            key={feature.id}
            feature={feature}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default FeaturesTable;
