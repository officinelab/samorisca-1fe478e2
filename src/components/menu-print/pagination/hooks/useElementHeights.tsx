
import { useEffect, useRef, useCallback, useState, useLayoutEffect } from "react";
import { Category, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { mmToPx } from "@/hooks/menu-print/printUnits";

type ElementType = "category-title" | "product-item";

export type ElementHeightKey =
  | { type: "category-title"; id: string; language: string; layoutId?: string; pageIndex: number }
  | { type: "product-item"; id: string; language: string; layoutId?: string; pageIndex: number };

export type ElementHeightsMap = Record<string, number>;

function buildKey(key: ElementHeightKey): string {
  return `${key.type}_${key.id}_${key.language}_${key.layoutId || ""}_${key.pageIndex}`;
}

/**
 * Nuova versione: monta REALMENTE gli elementi (invisibili ma pieni CSS),
 * li misura via getBoundingClientRect(), e salva l’altezza in px (NON via Canvas).
 */
export function useElementHeights() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [heights, setHeights] = useState<ElementHeightsMap>({});
  const [toMeasure, setToMeasure] = useState<{ el: JSX.Element; keyData: ElementHeightKey }[]>([]);

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

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    // Attendi sempre anche il font loading
    (async () => {
      if ((document as any).fonts?.ready) {
        await (document as any).fonts.ready;
      }
      const newHeights: ElementHeightsMap = {};
      Array.from(containerRef.current.children).forEach((child, i) => {
        const box = (child as HTMLElement).getBoundingClientRect();
        const target = toMeasure[i]?.keyData;
        if (target) {
          newHeights[buildKey(target)] = Math.ceil(box.height);
        }
      });
      setHeights((prev) => {
        let changed = false;
        for (const k in newHeights) {
          if (prev[k] !== newHeights[k]) changed = true;
        }
        return changed ? { ...prev, ...newHeights } : prev;
      });
      setToMeasure([]);
    })();
    // eslint-disable-next-line
  }, [toMeasure.length]);

  // Container invisibile ma renderizzato nel DOM, con tutti gli stili print
  const ShadowContainer = (
    <div
      ref={containerRef}
      style={{
        visibility: "hidden",
        position: "absolute",
        left: "-9999px",
        top: "0",
        width: "210mm",
        minHeight: "10mm",
        zIndex: -9999,
        pointerEvents: "none",
        background: "white",
        fontFamily: "'Arial', sans-serif",
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
          style={{ boxSizing: "border-box" }}
        >
          {elObj.el}
        </div>
      ))}
    </div>
  );

  return { heights, requestMeasure, ShadowContainer, buildKey };
}
