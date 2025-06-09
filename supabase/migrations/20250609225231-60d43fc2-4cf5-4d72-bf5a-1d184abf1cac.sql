
-- MIGRAZIONE COMPLETA: Rimozione Policy Duplicate Residue
-- =====================================================

-- FASE 1: RIMOZIONE COMPLETA TUTTE LE POLICY ESISTENTI
-- ====================================================

-- Disabilita temporaneamente RLS per pulizia completa
ALTER TABLE public.allergens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_allergens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_labels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_to_features DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_notes_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_layouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations DISABLE ROW LEVEL SECURITY;

-- Rimuovi TUTTE le policy esistenti da tutte le tabelle
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    -- Loop attraverso tutte le policy nelle tabelle public
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

-- FASE 2: RIATTIVAZIONE RLS E CREAZIONE POLICY OTTIMIZZATE
-- ========================================================

-- Riabilita RLS per tutte le tabelle
ALTER TABLE public.allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_to_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_notes_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Crea policy ottimizzate per ALLERGENS
CREATE POLICY "public_read" ON public.allergens FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.allergens FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per CATEGORIES  
CREATE POLICY "public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.categories FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per PRODUCTS
CREATE POLICY "public_read" ON public.products FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.products FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per PRODUCT_PRICES
CREATE POLICY "public_read" ON public.product_prices FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.product_prices FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per PRODUCT_ALLERGENS
CREATE POLICY "public_read" ON public.product_allergens FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.product_allergens FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per PRODUCT_FEATURES
CREATE POLICY "public_read" ON public.product_features FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.product_features FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per PRODUCT_LABELS
CREATE POLICY "public_read" ON public.product_labels FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.product_labels FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per PRODUCT_TO_FEATURES
CREATE POLICY "public_read" ON public.product_to_features FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.product_to_features FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per CATEGORY_NOTES
CREATE POLICY "public_read" ON public.category_notes FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.category_notes FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per CATEGORY_NOTES_CATEGORIES
CREATE POLICY "public_read" ON public.category_notes_categories FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.category_notes_categories FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per SITE_SETTINGS
CREATE POLICY "public_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.site_settings FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per PRINT_LAYOUTS
CREATE POLICY "public_read" ON public.print_layouts FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.print_layouts FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per TRANSLATION_TOKENS
CREATE POLICY "public_read" ON public.translation_tokens FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.translation_tokens FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy ottimizzate per TRANSLATIONS
CREATE POLICY "public_read" ON public.translations FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.translations FOR ALL TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Crea policy specializzata per USER_ROLES (solo proprietario)
CREATE POLICY "user_manage_own" ON public.user_roles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

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
