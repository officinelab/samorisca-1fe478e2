
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AppRole = "admin" | "admin_supervisor";

export const useUserRoles = () => {
  const { isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .order("role", { ascending: true });
        if (!error && data) {
          setRoles(data.map((row) => row.role as AppRole));
        } else {
          setRoles([]);
        }
      } catch {
        setRoles([]);
      }
      setIsLoading(false);
    };
    if (isAuthenticated) fetchRoles();
    else setRoles([]);
  }, [isAuthenticated]);

  return { roles, isLoading, hasRole: (role: AppRole) => roles.includes(role) };
};
