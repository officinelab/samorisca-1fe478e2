import React from "react";
import { PrintLayoutElementConfig, Margin } from "@/types/printLayout";

interface ElementEditorProps {
  element: PrintLayoutElementConfig;
  onChange: (field: keyof PrintLayoutElementConfig, value: any) => void;
  onMarginChange: (field: keyof Margin, value: number) => void;
}

const ElementEditor = ({
  element,
  onChange,
  onMarginChange,
}: ElementEditorProps) => {
  return (
    <div className="space-y-4">
      {/* Tipo carattere */}
      <div>
        <label className="block text-sm">Tipo carattere</label>
        <input
          type="text"
          value={element.fontFamily}
          onChange={e => onChange("fontFamily", e.target.value)}
          className="input"
        />
      </div>
      {/* Dimensione carattere */}
      <div>
        <label className="block text-sm">Dimensione carattere (pt)</label>
        <input
          type="number"
          value={element.fontSize}
          onChange={e => onChange("fontSize", Number(e.target.value))}
          className="input"
        />
      </div>
      {/* Colore carattere */}
      <div>
        <label className="block text-sm">Colore carattere</label>
        <input
          type="color"
          value={element.fontColor}
          onChange={e => onChange("fontColor", e.target.value)}
          className="input"
        />
      </div>
      {/* Stile carattere */}
      <div>
        <label className="block text-sm">Stile carattere</label>
        <select
          value={element.fontStyle}
          onChange={e => onChange("fontStyle", e.target.value)}
          className="select"
        >
          <option value="normal">Normale</option>
          <option value="italic">Italico</option>
          <option value="bold">Grassetto</option>
        </select>
      </div>
      {/* Allineamento */}
      <div>
        <label className="block text-sm">Allineamento</label>
        <select
          value={element.alignment}
          onChange={e => onChange("alignment", e.target.value)}
          className="select"
        >
          <option value="left">Sinistra</option>
          <option value="center">Centro</option>
          <option value="right">Destra</option>
        </select>
      </div>
      {/* Margini */}
      <div>
        <label className="block text-sm">Margini (mm)</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs">Top</label>
            <input
              type="number"
              value={element.margin.top}
              onChange={e => onMarginChange("top", Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs">Right</label>
            <input
              type="number"
              value={element.margin.right}
              onChange={e => onMarginChange("right", Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs">Bottom</label>
            <input
              type="number"
              value={element.margin.bottom}
              onChange={e => onMarginChange("bottom", Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs">Left</label>
            <input
              type="number"
              value={element.margin.left}
              onChange={e => onMarginChange("left", Number(e.target.value))}
              className="input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementEditor;
