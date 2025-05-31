
import { useEffect, useCallback } from 'react';

interface UseScrollHandlingProps {
  updateActiveCategory: () => void;
  setShowBackToTop: (show: boolean) => void;
}

export const useScrollHandling = ({ updateActiveCategory, setShowBackToTop }: UseScrollHandlingProps) => {
  const setupScrollListener = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateActiveCategory, 50);
    };
    
    updateActiveCategory();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [updateActiveCategory, setShowBackToTop]);

  const setupResizeListener = useCallback(() => {
    const handleResize = () => {
      setTimeout(updateActiveCategory, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveCategory]);

  useEffect(() => {
    const cleanupScroll = setupScrollListener();
    return cleanupScroll;
  }, [setupScrollListener]);

  useEffect(() => {
    const cleanupResize = setupResizeListener();
    return cleanupResize;
  }, [setupResizeListener]);
};
