
import * as React from "react";

interface ColorPickerInputProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  "#000000", "#222222", "#333333", "#555555", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
  "#9b87f5", "#7E69AB", "#6E59A5", "#8E9196", "#D6BCFA", "#F2FCE2", "#FEF7CD", "#FEC6A1",
  "#E5DEFF", "#FFDEE2", "#FDE1D3", "#D3E4FD", "#F1F0FB", "#8B5CF6", "#D946EF", "#F97316",
  "#0EA5E9", "#403E43"
];

const ColorPickerInput: React.FC<ColorPickerInputProps> = ({ value, onChange }) => {
  const [current, setCurrent] = React.useState(value);

  React.useEffect(() => {
    setCurrent(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={current}
        onChange={handleChange}
        className="w-8 h-8 border rounded"
        style={{ padding: 0 }}
        aria-label="Color Picker"
      />
      <input
        type="text"
        className="w-24 border rounded px-2 py-1"
        value={current}
        onChange={handleChange}
        aria-label="Colore HEX"
      />
      {/* Preset swatches */}
      <div className="flex flex-wrap gap-1 ml-2">
        {PRESET_COLORS.map(c => (
          <button
            type="button"
            key={c}
            className="w-6 h-6 rounded border"
            style={{
              background: c,
              border: c.toLowerCase() === current.toLowerCase() ? "2px solid #222" : "1px solid #ccc"
            }}
            onClick={() => {
              setCurrent(c);
              onChange(c);
            }}
            aria-label={`Imposta colore ${c}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPickerInput;
