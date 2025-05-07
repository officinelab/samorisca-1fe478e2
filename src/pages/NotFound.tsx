
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-6 max-w-md">
        <img src="/placeholder.svg" alt="Sa Morisca Logo" className="h-16 mx-auto mb-4" />
        
        <h1 className="text-4xl font-bold">Pagina non trovata</h1>
        
        <p className="text-gray-600">
          La pagina che stai cercando non esiste o potrebbe essere stata spostata.
        </p>
        
        <div className="space-x-4">
          <Button asChild>
            <Link to="/menu">Vai al Menu</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Area Amministratore</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
