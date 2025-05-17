import { useEffect, useRef, useCallback, useState } from "react";
import { Category, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";

type ElementType = "category-title" | "product-item";

export type ElementHeightKey =
  | { type: "category-title"; id: string; language: string; layoutId?: string; pageIndex: number }
  | { type: "product-item"; id: string; language: string; layoutId?: string; pageIndex: number };

export type ElementHeightsMap = Record<string, number>;

function buildKey(key: ElementHeightKey): string {
  // Crea una chiave unica per mappa JS
  return `${key.type}_${key.id}_${key.language}_${key.layoutId || ""}_${key.pageIndex}`;
}

/**
 * Per mountare titoli/prodotti reali invisibili e misurare la loro altezza DOM.
 * ATTENDE IL CARICAMENTO FONT E USA GLI STILI DI STAMPA.
 */
export function useElementHeights() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [heights, setHeights] = useState<ElementHeightsMap>({});

  // Mappa degli elementi montati da misurare
  const [toMeasure, setToMeasure] = useState<{ el: JSX.Element; keyData: ElementHeightKey }[]>([]);

  /**
   * Chiedi di misurare una specifica combinazione (renderizzata una sola volta!)
   */
  const requestMeasure = useCallback(
    (el: JSX.Element, keyData: ElementHeightKey) => {
      setToMeasure((prev) => {
        const strKey = buildKey(keyData);
        if (prev.some((v) => buildKey(v.keyData) === strKey)) return prev;
        return [...prev, { el, keyData }];
      });
    },
    []
  );

  // Usa layout effect per misurare DOPO il paint
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Attendi caricamento dei font
    (async () => {
      if ((document as any).fonts && (document as any).fonts.ready) {
        await (document as any).fonts.ready;
      }
      // 2. Misura
      const newHeights: ElementHeightsMap = {};
      Array.from(containerRef.current.children).forEach((child, i) => {
        const box = (child as HTMLElement).getBoundingClientRect();
        const target = toMeasure[i]?.keyData;
        if (target) {
          // Arrotonda l'altezza a intero superiore
          newHeights[buildKey(target)] = Math.ceil(box.height);
        }
      });

      // 3. Aggiorna solo se cambiano le misure
      setHeights((prev) => {
        let changed = false;
        for (const k in newHeights) {
          if (prev[k] !== newHeights[k]) {
            changed = true; break;
          }
        }
        return changed ? { ...prev, ...newHeights } : prev;
      });

      setToMeasure([]); // Svuota dopo misura
    })();
    // eslint-disable-next-line
  }, [toMeasure.length]);

  /**
   * Rende il "container shadow" fuori schermo con tutti gli elementi da misurare.
   * Applica lo stile *identico* a quello della stampa.
   */
  const ShadowContainer = (
    <div
      ref={containerRef}
      style={{
        visibility: "hidden",
        position: "absolute",
        left: "-9999px",
        top: "0",
        width: "210mm",
        zIndex: -99,
        pointerEvents: "none",
        fontFamily: "'Arial', sans-serif", // Style base come fallback
        fontSize: "12pt",
        lineHeight: 1.25,
        letterSpacing: "normal",
        boxSizing: "border-box",
        padding: "20mm 15mm",
      }}
      className="shadow-print-measure"
    >
      {toMeasure.map((elObj, idx) => (
        <div 
          key={buildKey(elObj.keyData)}
          style={{
            boxSizing: "border-box"
          }}
        >
          {elObj.el}
        </div>
      ))}
    </div>
  );

  return { heights, requestMeasure, ShadowContainer, buildKey };
}
