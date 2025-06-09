
-- OTTIMIZZAZIONE FINALE: Risoluzione Policy Permissive Duplicate
-- ==============================================================

-- FASE 1: RIMOZIONE POLICY ATTUALI SOVRAPPOSTE
-- =============================================

-- Rimuovi tutte le policy attuali per evitare sovrapposizioni
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

-- FASE 2: CREAZIONE POLICY SPECIALIZZATE NON SOVRAPPOSTE
-- ======================================================

-- ALLERGENS: Policy consolidate senza sovrapposizioni
CREATE POLICY "allergens_select_all" ON public.allergens 
FOR SELECT USING (true);

CREATE POLICY "allergens_modify_auth" ON public.allergens 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "allergens_update_auth" ON public.allergens 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "allergens_delete_auth" ON public.allergens 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- CATEGORIES: Policy consolidate senza sovrapposizioni
CREATE POLICY "categories_select_all" ON public.categories 
FOR SELECT USING (true);

CREATE POLICY "categories_modify_auth" ON public.categories 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "categories_update_auth" ON public.categories 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "categories_delete_auth" ON public.categories 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCTS: Policy consolidate senza sovrapposizioni (PRIORITÀ ALTA)
CREATE POLICY "products_select_all" ON public.products 
FOR SELECT USING (true);

CREATE POLICY "products_modify_auth" ON public.products 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "products_update_auth" ON public.products 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "products_delete_auth" ON public.products 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_PRICES: Policy consolidate senza sovrapposizioni
CREATE POLICY "product_prices_select_all" ON public.product_prices 
FOR SELECT USING (true);

CREATE POLICY "product_prices_modify_auth" ON public.product_prices 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_prices_update_auth" ON public.product_prices 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_prices_delete_auth" ON public.product_prices 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_ALLERGENS: Policy consolidate senza sovrapposizioni
CREATE POLICY "product_allergens_select_all" ON public.product_allergens 
FOR SELECT USING (true);

CREATE POLICY "product_allergens_modify_auth" ON public.product_allergens 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_allergens_update_auth" ON public.product_allergens 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_allergens_delete_auth" ON public.product_allergens 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_FEATURES: Policy consolidate senza sovrapposizioni
CREATE POLICY "product_features_select_all" ON public.product_features 
FOR SELECT USING (true);

CREATE POLICY "product_features_modify_auth" ON public.product_features 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_features_update_auth" ON public.product_features 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_features_delete_auth" ON public.product_features 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_LABELS: Policy consolidate senza sovrapposizioni
CREATE POLICY "product_labels_select_all" ON public.product_labels 
FOR SELECT USING (true);

CREATE POLICY "product_labels_modify_auth" ON public.product_labels 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_labels_update_auth" ON public.product_labels 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_labels_delete_auth" ON public.product_labels 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRODUCT_TO_FEATURES: Policy consolidate senza sovrapposizioni
CREATE POLICY "product_to_features_select_all" ON public.product_to_features 
FOR SELECT USING (true);

CREATE POLICY "product_to_features_modify_auth" ON public.product_to_features 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_to_features_update_auth" ON public.product_to_features 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_to_features_delete_auth" ON public.product_to_features 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- CATEGORY_NOTES: Policy consolidate senza sovrapposizioni
CREATE POLICY "category_notes_select_all" ON public.category_notes 
FOR SELECT USING (true);

CREATE POLICY "category_notes_modify_auth" ON public.category_notes 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "category_notes_update_auth" ON public.category_notes 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "category_notes_delete_auth" ON public.category_notes 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- CATEGORY_NOTES_CATEGORIES: Policy consolidate senza sovrapposizioni
CREATE POLICY "category_notes_categories_select_all" ON public.category_notes_categories 
FOR SELECT USING (true);

CREATE POLICY "category_notes_categories_modify_auth" ON public.category_notes_categories 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "category_notes_categories_update_auth" ON public.category_notes_categories 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "category_notes_categories_delete_auth" ON public.category_notes_categories 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- SITE_SETTINGS: Policy consolidate senza sovrapposizioni (PRIORITÀ MEDIA)
CREATE POLICY "site_settings_select_all" ON public.site_settings 
FOR SELECT USING (true);

CREATE POLICY "site_settings_modify_auth" ON public.site_settings 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "site_settings_update_auth" ON public.site_settings 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "site_settings_delete_auth" ON public.site_settings 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- PRINT_LAYOUTS: Policy consolidate senza sovrapposizioni
CREATE POLICY "print_layouts_select_all" ON public.print_layouts 
FOR SELECT USING (true);

CREATE POLICY "print_layouts_modify_auth" ON public.print_layouts 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "print_layouts_update_auth" ON public.print_layouts 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "print_layouts_delete_auth" ON public.print_layouts 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- TRANSLATION_TOKENS: Policy consolidate senza sovrapposizioni (PRIORITÀ MEDIA)
CREATE POLICY "translation_tokens_select_all" ON public.translation_tokens 
FOR SELECT USING (true);

CREATE POLICY "translation_tokens_modify_auth" ON public.translation_tokens 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "translation_tokens_update_auth" ON public.translation_tokens 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "translation_tokens_delete_auth" ON public.translation_tokens 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- TRANSLATIONS: Policy consolidate senza sovrapposizioni
CREATE POLICY "translations_select_all" ON public.translations 
FOR SELECT USING (true);

CREATE POLICY "translations_modify_auth" ON public.translations 
FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "translations_update_auth" ON public.translations 
FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "translations_delete_auth" ON public.translations 
FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- USER_ROLES: Policy specializzata per proprietario
CREATE POLICY "user_roles_select_own" ON public.user_roles 
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "user_roles_modify_own" ON public.user_roles 
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_roles_update_own" ON public.user_roles 
FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_roles_delete_own" ON public.user_roles 
FOR DELETE TO authenticated USING (user_id = auth.uid());

-- FASE 3: OTTIMIZZAZIONE STATISTICHE
-- ==================================
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
