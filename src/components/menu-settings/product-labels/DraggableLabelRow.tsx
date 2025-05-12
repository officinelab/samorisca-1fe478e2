
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { LabelBadge } from "./LabelBadge";
import { ProductLabel } from "@/hooks/menu-settings/useProductLabels";

interface DraggableLabelRowProps {
  label: ProductLabel;
  onEdit: (label: ProductLabel) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
}

export const DraggableLabelRow = ({
  label,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop
}: DraggableLabelRowProps) => {
  return (
    <TableRow
      key={label.id}
      draggable
      onDragStart={(e) => onDragStart(e, label.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, label.id)}
      className="cursor-move"
    >
      <TableCell>
        <div className="flex justify-center">
          <GripVertical size={16} className="text-gray-400" />
        </div>
      </TableCell>
      <TableCell>{label.title}</TableCell>
      <TableCell>
        <LabelBadge 
          title={label.title} 
          color={label.color} 
          textColor={label.text_color} 
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {label.color && (
            <div
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: label.color }}
            />
          )}
          <span className="text-xs">
            {label.color || 'Nessun colore'}
            {label.text_color && <span> / {label.text_color}</span>}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(label)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(label.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
