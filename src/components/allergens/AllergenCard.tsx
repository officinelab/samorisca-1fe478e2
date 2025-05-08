
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Allergen } from "@/types/database";
import { Edit, Trash2 } from "lucide-react";

interface AllergenCardProps {
  allergen: Allergen;
  onEdit: (allergen: Allergen) => void;
  onDelete: (id: string) => void;
}

const AllergenCard = ({ allergen, onEdit, onDelete }: AllergenCardProps) => {
  return (
    <Card className="overflow-hidden w-full">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-start justify-between">
            {/* Colonna 1a - Informazioni allergene */}
            <div className="flex-grow space-y-2">
              {/* Prima riga con 3 colonne */}
              <div className="flex items-center gap-1">
                {/* Colonna 1b - Numero */}
                <div>
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-800 font-bold">
                    {allergen.number}
                  </span>
                </div>
                
                {/* Colonna 2b - Icona */}
                <div className="mx-1">
                  {allergen.icon_url && (
                    <div className="w-10 h-10 bg-gray-50 rounded overflow-hidden">
                      <img 
                        src={allergen.icon_url}
                        alt={`Icona per ${allergen.title}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {!allergen.icon_url && (
                    <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center text-gray-300">
                      <span className="text-xs">No icon</span>
                    </div>
                  )}
                </div>
                
                {/* Colonna 3b - Titolo */}
                <div>
                  <h3 className="font-medium">{allergen.title}</h3>
                </div>
              </div>
              
              {/* Seconda riga - Descrizione */}
              {allergen.description && (
                <div>
                  <p className="text-sm text-gray-500">{allergen.description}</p>
                </div>
              )}
            </div>
            
            {/* Colonna 2a - Azioni */}
            <div className="flex space-x-1">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onEdit(allergen)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => onDelete(allergen.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllergenCard;
