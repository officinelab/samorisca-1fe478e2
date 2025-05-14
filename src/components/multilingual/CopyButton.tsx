
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: number;
}

export const CopyButton = ({ text, label, size = 18 }: CopyButtonProps) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Testo copiato!", { description: label || undefined });
    } catch (e) {
      toast.error("Errore nella copia!");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      title="Copia testo"
      className="p-1 hover:bg-muted"
      tabIndex={0}
      type="button"
      aria-label={label || "Copia"}
    >
      <Copy size={size} className="text-muted-foreground" />
    </Button>
  );
};
