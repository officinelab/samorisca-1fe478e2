
-- RISOLUZIONE AVVISI RLS: Ottimizzazione Auth Initialization
-- ========================================================

-- FASE 1: RIMOZIONE POLICY ATTUALI CHE CAUSANO AVVISI
-- ===================================================

-- Rimuovi tutte le policy attuali
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      policy_record.policyname, 
                      policy_record.schemaname, 
                      policy_record.tablename);
    END LOOP;
END $$;

-- FASE 2: POLICY OTTIMIZZATE CHE EVITANO CHIAMATE ECCESSIVE A AUTH
-- ===============================================================

-- ALLERGENS: Policy ottimizzate
CREATE POLICY "public_read" ON public.allergens 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.allergens 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- CATEGORIES: Policy ottimizzate  
CREATE POLICY "public_read" ON public.categories 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.categories 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- PRODUCTS: Policy ottimizzate
CREATE POLICY "public_read" ON public.products 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.products 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- PRODUCT_PRICES: Policy ottimizzate
CREATE POLICY "public_read" ON public.product_prices 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.product_prices 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- PRODUCT_ALLERGENS: Policy ottimizzate
CREATE POLICY "public_read" ON public.product_allergens 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.product_allergens 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- PRODUCT_FEATURES: Policy ottimizzate
CREATE POLICY "public_read" ON public.product_features 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.product_features 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- PRODUCT_LABELS: Policy ottimizzate
CREATE POLICY "public_read" ON public.product_labels 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.product_labels 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- PRODUCT_TO_FEATURES: Policy ottimizzate
CREATE POLICY "public_read" ON public.product_to_features 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.product_to_features 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- CATEGORY_NOTES: Policy ottimizzate
CREATE POLICY "public_read" ON public.category_notes 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.category_notes 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- CATEGORY_NOTES_CATEGORIES: Policy ottimizzate
CREATE POLICY "public_read" ON public.category_notes_categories 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.category_notes_categories 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- SITE_SETTINGS: Policy ottimizzate
CREATE POLICY "public_read" ON public.site_settings 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.site_settings 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- PRINT_LAYOUTS: Policy ottimizzate
CREATE POLICY "public_read" ON public.print_layouts 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.print_layouts 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- TRANSLATION_TOKENS: Policy ottimizzate
CREATE POLICY "public_read" ON public.translation_tokens 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.translation_tokens 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- TRANSLATIONS: Policy ottimizzate
CREATE POLICY "public_read" ON public.translations 
FOR SELECT USING (true);

CREATE POLICY "auth_write" ON public.translations 
FOR ALL TO authenticated 
USING ((SELECT auth.uid()) IS NOT NULL) 
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- USER_ROLES: Policy specializzata (rimane con user_id = auth.uid())
CREATE POLICY "user_manage_own" ON public.user_roles 
FOR ALL TO authenticated 
USING (user_id = (SELECT auth.uid())) 
WITH CHECK (user_id = (SELECT auth.uid()));

-- FASE 3: OTTIMIZZAZIONE FINALE
-- =============================

-- Forza aggiornamento statistiche per migliorare performance
ANALYZE public.allergens;
ANALYZE public.categories;
ANALYZE public.products;
ANALYZE public.product_prices;
ANALYZE public.product_allergens;
ANALYZE public.product_features;
ANALYZE public.product_labels;
ANALYZE public.product_to_features;
ANALYZE public.category_notes;
ANALYZE public.category_notes_categories;
ANALYZE public.site_settings;
ANALYZE public.user_roles;
ANALYZE public.print_layouts;
ANALYZE public.translation_tokens;
ANALYZE public.translations;
