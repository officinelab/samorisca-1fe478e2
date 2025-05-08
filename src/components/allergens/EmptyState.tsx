
import { AlertTriangle } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
      <p className="text-lg font-medium">Nessun allergene trovato</p>
      <p className="mt-1">Aggiungi il primo allergene per iniziare.</p>
    </div>
  );
};

export default EmptyState;
