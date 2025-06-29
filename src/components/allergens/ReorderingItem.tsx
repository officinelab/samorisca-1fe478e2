
import { Button } from "@/components/ui/button";
import { Allergen } from "@/types/database";

interface ReorderingItemProps {
  allergen: Allergen;
  index: number;
  totalItems: number;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const ReorderingItem = ({ allergen, index, totalItems, onMove }: ReorderingItemProps) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-md border">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold">{allergen.number}</span>
        {allergen.icon_url && (
          <div className="w-8 h-8 bg-gray-50 rounded overflow-hidden">
            <img 
              src={allergen.icon_url}
              alt={`Icona per ${allergen.title}`}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <span className="font-medium">{allergen.title}</span>
      </div>
      <div className="flex space-x-1">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => onMove(index, 'up')}
          disabled={index === 0}
        >
          ↑
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => onMove(index, 'down')}
          disabled={index === totalItems - 1}
        >
          ↓
        </Button>
      </div>
    </div>
  );
};

export default ReorderingItem;
