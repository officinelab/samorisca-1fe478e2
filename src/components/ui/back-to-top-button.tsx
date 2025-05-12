
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

interface BackToTopButtonProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  threshold?: number;
}

export function BackToTopButton({ scrollContainerRef, threshold = 300 }: BackToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = scrollContainerRef?.current?.scrollTop ?? window.scrollY;
      setIsVisible(scrollTop > threshold);
    };

    const container = scrollContainerRef?.current ?? window;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollContainerRef, threshold]);

  const scrollToTop = () => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      className="fixed bottom-6 right-6 rounded-full shadow-md z-30"
      onClick={scrollToTop}
      aria-label="Torna in cima"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
