import React, { createContext, useContext, useState, useCallback } from 'react';

interface MenuPrintPagesState {
  totalPages: number;
  contentPagesCount: number;
  isLoading: boolean;
}

interface MenuPrintPagesContextValue extends MenuPrintPagesState {
  setPagesInfo: (info: MenuPrintPagesState) => void;
}

const MenuPrintPagesContext = createContext<MenuPrintPagesContextValue | null>(null);

export const MenuPrintPagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MenuPrintPagesState>({
    totalPages: 0,
    contentPagesCount: 0,
    isLoading: true,
  });

  const setPagesInfo = useCallback((info: MenuPrintPagesState) => {
    setState(prev => {
      if (
        prev.totalPages === info.totalPages &&
        prev.contentPagesCount === info.contentPagesCount &&
        prev.isLoading === info.isLoading
      ) {
        return prev;
      }
      return info;
    });
  }, []);

  return (
    <MenuPrintPagesContext.Provider value={{ ...state, setPagesInfo }}>
      {children}
    </MenuPrintPagesContext.Provider>
  );
};

export const useMenuPrintPages = () => {
  const ctx = useContext(MenuPrintPagesContext);
  if (!ctx) {
    return { totalPages: 0, contentPagesCount: 0, isLoading: true, setPagesInfo: () => {} };
  }
  return ctx;
};