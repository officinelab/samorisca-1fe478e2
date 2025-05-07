
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };

    checkSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Cerchiamo l'utente admin nel database
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error || !data) {
        toast.error("Credenziali non valide");
        return false;
      }
      
      // Qui normalmente verificheremmo la password con bcrypt
      // Per ora, facciamo un controllo semplice (in produzione si userebbe bcrypt)
      if (data.password_hash !== '$2a$10$EJSKbVs/MZgO9.F2xwmsWeh7qXXWwYK.ylw6/3RZJ7RiWXJgVp8He') {
        toast.error("Credenziali non valide");
        return false;
      }
      
      // Sign in con il servizio di auth di Supabase
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${username}@samorisca.internal`,
        password: password
      });
      
      if (signInError) {
        toast.error("Errore durante il login: " + signInError.message);
        return false;
      }
      
      toast.success("Login effettuato con successo!");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Si è verificato un errore durante il login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success("Logout effettuato con successo");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Si è verificato un errore durante il logout");
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
