
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow 
} from "@/components/ui/table";
import { Product } from "@/types/database";

interface ProductTechnicalInfoProps {
  product: Product;
}

const ProductTechnicalInfo: React.FC<ProductTechnicalInfoProps> = ({
  product
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Informazioni tecniche</h3>
        
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">ID</TableCell>
              <TableCell>{product.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ordine di visualizzazione</TableCell>
              <TableCell>{product.display_order}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Creato il</TableCell>
              <TableCell>
                {product.created_at && new Date(product.created_at).toLocaleDateString('it-IT')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Ultimo aggiornamento</TableCell>
              <TableCell>
                {product.updated_at && new Date(product.updated_at).toLocaleDateString('it-IT')}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductTechnicalInfo;
