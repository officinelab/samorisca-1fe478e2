
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

  // Usa layout effect per misurare una volta che gli elementi sono montati
  useEffect(() => {
    if (!containerRef.current) return;
    const newHeights: ElementHeightsMap = {};

    Array.from(containerRef.current.children).forEach((child, i) => {
      const box = (child as HTMLElement).getBoundingClientRect();
      const target = toMeasure[i]?.keyData;
      if (target) {
        newHeights[buildKey(target)] = box.height;
      }
    });

    // Aggiorna solo se cambiano le misure
    setHeights((prev) => {
      let changed = false;
      for (const k in newHeights) {
        if (prev[k] !== newHeights[k]) {
          changed = true; break;
        }
      }
      return changed ? { ...prev, ...newHeights } : prev;
    });

    // Svuota la coda di misurazione dopo aver misurato
    setToMeasure([]);
    // eslint-disable-next-line
  }, [toMeasure.length]);

  /**
   * Rende il "container shadow" fuori schermo con tutti gli elementi da misurare.
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
        pointerEvents: "none"
      }}
    >
      {toMeasure.map((elObj, idx) => (
        <div key={buildKey(elObj.keyData)}>{elObj.el}</div>
      ))}
    </div>
  );

  return { heights, requestMeasure, ShadowContainer, buildKey };
}
