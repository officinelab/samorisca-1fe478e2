
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { ProductFeature } from "@/types/database";
import FeatureIconPreview from "./FeatureIconPreview";

interface FeatureRowProps {
  feature: ProductFeature;
  onEdit: (feature: ProductFeature) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetId: string) => void;
}

export const FeatureRow: React.FC<FeatureRowProps> = ({
  feature,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  return (
    <TableRow 
      key={feature.id}
      draggable
      onDragStart={(e) => onDragStart(e, feature.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, feature.id)}
      className="cursor-move"
    >
      <TableCell>
        <div className="flex justify-center">
          <GripVertical size={16} className="text-gray-400" />
        </div>
      </TableCell>
      <TableCell>{feature.title}</TableCell>
      <TableCell>
        <FeatureIconPreview iconUrl={feature.icon_url} title={feature.title} />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(feature)}
          >
            <Pencil size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(feature.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default FeatureRow;
