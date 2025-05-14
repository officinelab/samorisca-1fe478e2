import React from "react";
import { Product } from "@/types/database";

interface ProductDetailPanelProps {
  product: Product;
}

const ProductDetailPanel: React.FC<ProductDetailPanelProps> = ({ product }) => {
  // Recupera il prezzo standard e il suffisso, con fallback
  const prezzoStandard = product.price_standard;
  const suffisso = product.has_price_suffix && product.price_suffix
    ? product.price_suffix
    : "";

  // Recupera eventuali varianti (se presenti)
  const varianti = [
    {
      value: product.price_variant_1_value,
      name: product.price_variant_1_name,
    },
    {
      value: product.price_variant_2_value,
      name: product.price_variant_2_name,
    },
  ].filter((v) => !!v.value);

  return (
    <div className="p-4">
      {/* Header */}
      <header className="flex items-center justify-between pb-4">
        <h2 className="text-lg font-semibold">{product.title}</h2>
      </header>

      {/* Informazioni di base */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Informazioni di base</h3>
        <div className="text-base">
          <div>
            <strong>Nome:</strong> {product.title}
          </div>
          <div>
            <strong>Descrizione:</strong> {product.description || "Nessuna descrizione"}
          </div>
          <div>
            <strong>Categoria ID:</strong> {product.category_id}
          </div>
          <div>
            <strong>Attivo:</strong> {product.is_active ? "Sì" : "No"}
          </div>
        </div>
      </section>

      {/* Sezione Prezzi */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Prezzi</h3>
        <div className="text-base">
          {/* Prezzo standard con suffisso */}
          {prezzoStandard !== null && prezzoStandard !== undefined && (
            <div className="mb-2">
              {prezzoStandard.toLocaleString("it-IT", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
              })}{" "}
              {suffisso}
            </div>
          )}

          {/* Varianti prezzo */}
          {varianti.map((v, idx) => (
            <div key={idx} className="pl-2 text-sm text-gray-700">
              {v.value?.toLocaleString("it-IT", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
              })}{" "}
              {v.name ? v.name : ""}
            </div>
          ))}
        </div>
      </section>

      {/* Sezione Allergeni */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Allergeni</h3>
        {product.allergens && product.allergens.length > 0 ? (
          <ul>
            {product.allergens.map((allergen) => (
              <li key={allergen.id} className="text-base">
                {allergen.title}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-base">Nessun allergene associato</div>
        )}
      </section>

      {/* Sezione Caratteristiche */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Caratteristiche</h3>
        {product.features && product.features.length > 0 ? (
          <ul>
            {product.features.map((feature) => (
              <li key={feature.id} className="text-base">
                {feature.title}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-base">Nessuna caratteristica associata</div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailPanel;
