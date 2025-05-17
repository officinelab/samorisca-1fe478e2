
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
 * Rendering invisibile effettivo degli elementi per misurazione DOM
 */
export function useElementHeights() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [heights, setHeights] = useState<ElementHeightsMap>({});
  const [toMeasure, setToMeasure] = useState<{ el: JSX.Element; keyData: ElementHeightKey }[]>([]);
  const elementRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
    (async () => {
      if ((document as any).fonts?.ready) {
        await (document as any).fonts.ready;
      }
      const newHeights: ElementHeightsMap = {};
      toMeasure.forEach((obj) => {
        const key = buildKey(obj.keyData);
        const ref = elementRefs.current[key];
        // Debug: log della ref e misura
        if (!ref) {
          console.warn("useElementHeights: ref NON montata per", key, obj.el);
        } else {
          const rect = ref.getBoundingClientRect();
          newHeights[key] = Math.ceil(rect.height);
          if (rect.height === 0) {
            console.warn("useElementHeights: height 0 per", key, ref, obj.el);
          } else {
            console.log("useElementHeights: misurato", key, rect.height, ref);
          }
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
  }, [toMeasure.length]);

  // Il container invisibile DEVE essere sempre presente nel DOM e con stili che lo rendano
  // misurabile (no display: none!)
  const ShadowContainer = (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        visibility: "hidden",
        pointerEvents: "none",
        left: 0,
        top: 0,
        width: "210mm",
        minHeight: "10mm",
        opacity: 0.01,
        zIndex: -9999,
        background: "white",
        fontFamily: "'Arial', sans-serif",
        fontSize: "12pt",
        lineHeight: 1.25,
        letterSpacing: "normal",
        boxSizing: "border-box",
        padding: "20mm 15mm",
      }}
      className="shadow-print-measure"
      aria-hidden="true"
      tabIndex={-1}
      data-shadow-container
    >
      {toMeasure.map((elObj, idx) => {
        const key = buildKey(elObj.keyData);
        return (
          <div
            key={key}
            ref={el => { elementRefs.current[key] = el; }}
            style={{ boxSizing: "border-box", width: '100%', minHeight: 2 }}
          >
            {elObj.el}
          </div>
        );
      })}
    </div>
  );
  return { heights, requestMeasure, ShadowContainer, buildKey };
}
