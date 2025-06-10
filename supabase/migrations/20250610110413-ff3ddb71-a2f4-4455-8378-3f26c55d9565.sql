
-- RISOLUZIONE DEFINITIVA: Eliminazione Multiple Permissive Policies
-- ================================================================

-- FASE 1: PULIZIA COMPLETA POLICY SOVRAPPOSTE
-- ============================================

-- Rimuovi tutte le policy esistenti
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

-- FASE 2: STRATEGIA SENZA SOVRAPPOSIZIONI - UNA POLICY PER AZIONE
-- ===============================================================

-- ALLERGENS: Policy distinte per ogni azione
CREATE POLICY "allergens_select" ON public.allergens 
FOR SELECT USING (true);

CREATE POLICY "allergens_insert" ON public.allergens 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "allergens_update" ON public.allergens 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "allergens_delete" ON public.allergens 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- CATEGORIES: Policy distinte per ogni azione
CREATE POLICY "categories_select" ON public.categories 
FOR SELECT USING (true);

CREATE POLICY "categories_insert" ON public.categories 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "categories_update" ON public.categories 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "categories_delete" ON public.categories 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCTS: Policy distinte per ogni azione (PRIORITÀ)
CREATE POLICY "products_select" ON public.products 
FOR SELECT USING (true);

CREATE POLICY "products_insert" ON public.products 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "products_update" ON public.products 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "products_delete" ON public.products 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_PRICES: Policy distinte per ogni azione
CREATE POLICY "product_prices_select" ON public.product_prices 
FOR SELECT USING (true);

CREATE POLICY "product_prices_insert" ON public.product_prices 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_prices_update" ON public.product_prices 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_prices_delete" ON public.product_prices 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_ALLERGENS: Policy distinte per ogni azione
CREATE POLICY "product_allergens_select" ON public.product_allergens 
FOR SELECT USING (true);

CREATE POLICY "product_allergens_insert" ON public.product_allergens 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_allergens_update" ON public.product_allergens 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_allergens_delete" ON public.product_allergens 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_FEATURES: Policy distinte per ogni azione
CREATE POLICY "product_features_select" ON public.product_features 
FOR SELECT USING (true);

CREATE POLICY "product_features_insert" ON public.product_features 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_features_update" ON public.product_features 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_features_delete" ON public.product_features 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_LABELS: Policy distinte per ogni azione
CREATE POLICY "product_labels_select" ON public.product_labels 
FOR SELECT USING (true);

CREATE POLICY "product_labels_insert" ON public.product_labels 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_labels_update" ON public.product_labels 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_labels_delete" ON public.product_labels 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_TO_FEATURES: Policy distinte per ogni azione
CREATE POLICY "product_to_features_select" ON public.product_to_features 
FOR SELECT USING (true);

CREATE POLICY "product_to_features_insert" ON public.product_to_features 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_to_features_update" ON public.product_to_features 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_to_features_delete" ON public.product_to_features 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- CATEGORY_NOTES: Policy distinte per ogni azione
CREATE POLICY "category_notes_select" ON public.category_notes 
FOR SELECT USING (true);

CREATE POLICY "category_notes_insert" ON public.category_notes 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "category_notes_update" ON public.category_notes 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "category_notes_delete" ON public.category_notes 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- CATEGORY_NOTES_CATEGORIES: Policy distinte per ogni azione
CREATE POLICY "category_notes_categories_select" ON public.category_notes_categories 
FOR SELECT USING (true);

CREATE POLICY "category_notes_categories_insert" ON public.category_notes_categories 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "category_notes_categories_update" ON public.category_notes_categories 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "category_notes_categories_delete" ON public.category_notes_categories 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- SITE_SETTINGS: Policy distinte per ogni azione
CREATE POLICY "site_settings_select" ON public.site_settings 
FOR SELECT USING (true);

CREATE POLICY "site_settings_insert" ON public.site_settings 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "site_settings_update" ON public.site_settings 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "site_settings_delete" ON public.site_settings 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRINT_LAYOUTS: Policy distinte per ogni azione
CREATE POLICY "print_layouts_select" ON public.print_layouts 
FOR SELECT USING (true);

CREATE POLICY "print_layouts_insert" ON public.print_layouts 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "print_layouts_update" ON public.print_layouts 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "print_layouts_delete" ON public.print_layouts 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- TRANSLATION_TOKENS: Policy distinte per ogni azione
CREATE POLICY "translation_tokens_select" ON public.translation_tokens 
FOR SELECT USING (true);

CREATE POLICY "translation_tokens_insert" ON public.translation_tokens 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "translation_tokens_update" ON public.translation_tokens 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "translation_tokens_delete" ON public.translation_tokens 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- TRANSLATIONS: Policy distinte per ogni azione
CREATE POLICY "translations_select" ON public.translations 
FOR SELECT USING (true);

CREATE POLICY "translations_insert" ON public.translations 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "translations_update" ON public.translations 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "translations_delete" ON public.translations 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- USER_ROLES: Policy specializzata basata su proprietario
CREATE POLICY "user_roles_select" ON public.user_roles 
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "user_roles_insert" ON public.user_roles 
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_roles_update" ON public.user_roles 
FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_roles_delete" ON public.user_roles 
FOR DELETE TO authenticated USING (user_id = auth.uid());

-- FASE 3: ANALISI E OTTIMIZZAZIONE
-- ================================
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
