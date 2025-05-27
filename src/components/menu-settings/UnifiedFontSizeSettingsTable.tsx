
import React from "react";

interface Props {
  fontSizes: {
    title: number;
    description: number;
    price: number;
  };
  onFontSizeChange: (key: "title" | "description" | "price", value: number) => void;
}

export const UnifiedFontSizeSettingsTable: React.FC<Props> = ({ fontSizes, onFontSizeChange }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border rounded-md text-center w-full min-w-[380px]">
        <thead>
          <tr className="bg-muted/50">
            <th className="p-2">Anteprima Desktop</th>
            <th className="p-2">Anteprima Mobile</th>
            <th className="p-2">Finestra dettagli prodotto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {[0, 1, 2].map(() => (
              <td key={Math.random()} className="p-1 align-middle font-semibold text-sm text-gray-700">
                Titolo
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2].map((_, idx) => (
              <td key={"title" + idx} className="p-1">
                <input
                  type="number"
                  min={14}
                  max={28}
                  value={fontSizes.title}
                  onChange={e => onFontSizeChange("title", Number(e.target.value))}
                  className="w-16 px-1 py-1 border rounded text-center"
                />
                <span className="ml-1 text-xs text-muted-foreground">px</span>
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2].map(() => (
              <td key={Math.random()} className="p-1 align-middle font-semibold text-sm text-gray-700">
                Descrizione
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2].map((_, idx) => (
              <td key={"desc" + idx} className="p-1">
                <input
                  type="number"
                  min={12}
                  max={22}
                  value={fontSizes.description}
                  onChange={e => onFontSizeChange("description", Number(e.target.value))}
                  className="w-16 px-1 py-1 border rounded text-center"
                />
                <span className="ml-1 text-xs text-muted-foreground">px</span>
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2].map(() => (
              <td key={Math.random()} className="p-1 align-middle font-semibold text-sm text-gray-700">
                Prezzo
              </td>
            ))}
          </tr>
          <tr>
            {[0, 1, 2].map((_, idx) => (
              <td key={"price" + idx} className="p-1">
                <input
                  type="number"
                  min={14}
                  max={28}
                  value={fontSizes.price}
                  onChange={e => onFontSizeChange("price", Number(e.target.value))}
                  className="w-16 px-1 py-1 border rounded text-center"
                />
                <span className="ml-1 text-xs text-muted-foreground">px</span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
