
-- 1) translation_tokens: restrict SELECT to authenticated
DROP POLICY IF EXISTS public_read ON public.translation_tokens;
CREATE POLICY auth_read ON public.translation_tokens
  FOR SELECT TO authenticated
  USING (true);

-- 2) print_layouts: restrict SELECT to authenticated
DROP POLICY IF EXISTS public_read ON public.print_layouts;
CREATE POLICY auth_read ON public.print_layouts
  FOR SELECT TO authenticated
  USING (true);

-- 3) user_roles: prevent privilege escalation
-- Drop the overly permissive ALL policy
DROP POLICY IF EXISTS user_manage_own ON public.user_roles;

-- Users can read their own roles
CREATE POLICY users_read_own ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Only admins can insert/update/delete roles
CREATE POLICY admins_insert_roles ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY admins_update_roles ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'::app_role))
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY admins_delete_roles ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'::app_role));

-- 4) Storage: products bucket - require auth on update/delete
DROP POLICY IF EXISTS "Allow authenticated delete for products images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update for products images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload for products images" ON storage.objects;

CREATE POLICY "Authenticated delete on products bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'products');

CREATE POLICY "Authenticated update on products bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'products')
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "Authenticated upload on products bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'products');

-- 5) Storage: menu-images - drop duplicate anonymous-upload policy
DROP POLICY IF EXISTS "Allow uploads to menu-images" ON storage.objects;

-- 6) Revoke EXECUTE from anon on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_current_month() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_monthly_tokens_limit() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_remaining_tokens() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_tokens(integer) FROM PUBLIC, anon;

-- Trigger-only functions: nobody should call them directly
REVOKE EXECUTE ON FUNCTION public.check_layout_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.ensure_one_default_layout() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_categories_updated_at() FROM PUBLIC, anon, authenticated;
