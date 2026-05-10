
-- Helper: true if current user is any admin tier
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::app_role, 'admin_supervisor'::app_role)
  )
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- ============================================================
-- Replace auth_write policies with admin-only on content tables
-- (public_read remains for the menu)
-- ============================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'products','categories','allergens','product_features','product_labels',
    'product_allergens','product_to_features','category_notes',
    'category_notes_categories','translations','site_settings'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS auth_write ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY admin_write ON public.%I FOR ALL TO authenticated USING (public.is_admin((SELECT auth.uid()))) WITH CHECK (public.is_admin((SELECT auth.uid())))',
      t
    );
  END LOOP;
END $$;

-- ============================================================
-- print_layouts: admin-only read AND write
-- ============================================================
DROP POLICY IF EXISTS auth_read ON public.print_layouts;
DROP POLICY IF EXISTS auth_write ON public.print_layouts;
CREATE POLICY admin_read ON public.print_layouts
  FOR SELECT TO authenticated
  USING (public.is_admin((SELECT auth.uid())));
CREATE POLICY admin_write ON public.print_layouts
  FOR ALL TO authenticated
  USING (public.is_admin((SELECT auth.uid())))
  WITH CHECK (public.is_admin((SELECT auth.uid())));

-- ============================================================
-- translation_tokens: admin-only read AND write
-- ============================================================
DROP POLICY IF EXISTS auth_read ON public.translation_tokens;
DROP POLICY IF EXISTS auth_write ON public.translation_tokens;
CREATE POLICY admin_read ON public.translation_tokens
  FOR SELECT TO authenticated
  USING (public.is_admin((SELECT auth.uid())));
CREATE POLICY admin_write ON public.translation_tokens
  FOR ALL TO authenticated
  USING (public.is_admin((SELECT auth.uid())))
  WITH CHECK (public.is_admin((SELECT auth.uid())));
