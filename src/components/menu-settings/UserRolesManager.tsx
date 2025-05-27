
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

type UserRoleRow = {
  id: string;
  user_id: string;
  role: string;
};

export default function UserRolesManager() {
  const [roles, setRoles] = useState<UserRoleRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRoles() {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_roles")
        .select("id, user_id, role")
        .order("role", { ascending: true });
      if (!error && data) setRoles(data as UserRoleRow[]);
      setLoading(false);
    }
    fetchRoles();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestione utenti e ruoli</h2>
      <p className="mb-4 text-muted-foreground">
        Per assegnare o cambiare ruoli, vai nella <b>Supabase Console</b> nella tabella <b>user_roles</b>.<br />
        1. Clicca su <b>user_roles</b> &rarr; <b>Insert Row</b>.<br />
        2. Inserisci l'<b>UUID dell'utente</b> (user_id) e seleziona uno dei ruoli disponibili:<br />
        <span className="bg-muted px-2 py-1 rounded">admin</span>{' '}
        <span className="bg-muted px-2 py-1 rounded">admin_supervisor</span>
        <br /><br />
        Gli utenti sono identificati con il loro UUID, che puoi trovare nella sezione <b>Auth &rarr; Users</b> della console Supabase.<br />
        <a href="https://supabase.com/dashboard/project/dqkrmewgeeuxhbxrwpjp/auth/users" className="underline text-primary" target="_blank" rel="noopener noreferrer">
          Vai alla sezione utenti</a>
      </p>
      <Separator className="mb-4" />
      <h3 className="text-lg font-semibold mb-2">Utenti e ruoli attuali</h3>
      {loading ? (
        <div>Caricamento...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Ruolo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">Nessun ruolo assegnato</TableCell>
              </TableRow>
            ) : (
              roles.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.user_id}</TableCell>
                  <TableCell>{r.role}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
