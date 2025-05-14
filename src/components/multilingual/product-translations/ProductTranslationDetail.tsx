import { Product } from "@/types/database";
import { TranslationField } from "@/components/multilingual/TranslationField";
import { SupportedLanguage } from "@/types/translation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CopyButton } from "../CopyButton";

interface ProductTranslationDetailProps {
  product: Product | null;
  language: SupportedLanguage;
}

export const ProductTranslationDetail = ({ product, language }: ProductTranslationDetailProps) => {
  if (!product) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Seleziona un prodotto per visualizzare e modificare le traduzioni
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        {product.image_url && (
          <img 
            src={product.image_url}
            alt={product.title}
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{product.title}</h2>
          {product.description && (
            <p className="text-muted-foreground text-sm mt-1">
              {product.description}
            </p>
          )}
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Originale (Italiano)</TableHead>
            <TableHead className="w-2/3">Traduzione</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Title translation */}
          <TableRow>
            <TableCell className="align-top font-medium flex items-center gap-2">
              Nome: {product.title}
              <CopyButton text={product.title} label="Copia nome originale" />
            </TableCell>
            <TableCell>
              <TranslationField
                id={product.id}
                entityType="products"
                fieldName="title"
                originalText={product.title}
                language={language}
              />
            </TableCell>
          </TableRow>
          
          {/* Description translation (if available) */}
          {product.description && (
            <TableRow>
              <TableCell className="align-top flex items-center gap-2">
                <div>
                  <div className="font-medium">Descrizione:</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {product.description}
                  </div>
                </div>
                <CopyButton text={product.description} label="Copia descrizione originale" />
              </TableCell>
              <TableCell>
                <TranslationField
                  id={product.id}
                  entityType="products"
                  fieldName="description"
                  originalText={product.description}
                  language={language}
                  multiline
                />
              </TableCell>
            </TableRow>
          )}
          
          {/* Price suffix translation (if available) */}
          {product.has_price_suffix && product.price_suffix && (
            <TableRow>
              <TableCell className="align-top font-medium flex items-center gap-2">
                Suffisso prezzo: {product.price_suffix}
                <CopyButton text={product.price_suffix} label="Copia suffisso prezzo originale" />
              </TableCell>
              <TableCell>
                <TranslationField
                  id={product.id}
                  entityType="products"
                  fieldName="price_suffix"
                  originalText={product.price_suffix}
                  language={language}
                />
              </TableCell>
            </TableRow>
          )}
          
          {/* Price variant names translations (if available) */}
          {product.has_multiple_prices && product.price_variant_1_name && (
            <TableRow>
              <TableCell className="align-top font-medium flex items-center gap-2">
                Variante 1: {product.price_variant_1_name}
                <CopyButton text={product.price_variant_1_name} label="Copia variante 1 originale" />
              </TableCell>
              <TableCell>
                <TranslationField
                  id={product.id}
                  entityType="products"
                  fieldName="price_variant_1_name"
                  originalText={product.price_variant_1_name}
                  language={language}
                />
              </TableCell>
            </TableRow>
          )}
          
          {product.has_multiple_prices && product.price_variant_2_name && (
            <TableRow>
              <TableCell className="align-top font-medium flex items-center gap-2">
                Variante 2: {product.price_variant_2_name}
                <CopyButton text={product.price_variant_2_name} label="Copia variante 2 originale" />
              </TableCell>
              <TableCell>
                <TranslationField
                  id={product.id}
                  entityType="products"
                  fieldName="price_variant_2_name"
                  originalText={product.price_variant_2_name}
                  language={language}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
