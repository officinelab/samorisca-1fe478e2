
import {
  BookmarkPlus,
  CirclePlus,
  Plus,
  BadgePlus,
  CircleCheckBig,
} from "lucide-react";
import clsx from "clsx";

const iconsMap: Record<string, React.ComponentType<any>> = {
  "bookmark-plus": BookmarkPlus,
  "circle-plus": CirclePlus,
  "plus": Plus,
  "badge-plus": BadgePlus,
  "circle-check-big": CircleCheckBig,
};

export function ProductCardButtonIconsDemo({
  iconName,
  color = "#9b87f5",
  size = 28,
  selected = false,
}: {
  iconName: string;
  color?: string;
  size?: number;
  selected?: boolean;
}) {
  const Icon = iconsMap[iconName] || Plus;
  return (
    <span
      className={clsx("rounded-full flex items-center justify-center border", selected ? "border-primary ring-2 ring-primary" : "border-muted")}
      style={{
        backgroundColor: color,
        width: size + 12,
        height: size + 12,
      }}
    >
      <Icon size={size} color="#fff" strokeWidth={2.2} />
    </span>
  );
}
