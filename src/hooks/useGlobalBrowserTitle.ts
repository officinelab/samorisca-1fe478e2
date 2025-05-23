
import { useEffect } from "react";

/**
 * Hook: sincronizza il titolo del browser globalmente.
 */
export function useGlobalBrowserTitle(title: string | undefined) {
  useEffect(() => {
    if (typeof title === "string" && title.length > 0) {
      document.title = title;
    }
  }, [title]);
}
