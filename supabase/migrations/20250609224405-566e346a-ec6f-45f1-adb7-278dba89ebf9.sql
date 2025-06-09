
-- FASE 1: Consolidamento Policy Duplicate
-- ===========================================

-- Tabella: allergens
-- Rimuovere tutte le policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.allergens;
DROP POLICY IF EXISTS "Consenti lettura pubblica allergens" ON public.allergens;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.allergens;
DROP POLICY IF EXISTS "Consenti modifica autenticata allergens" ON public.allergens;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.allergens;

-- Creare policy consolidate ottimizzate
CREATE POLICY "read_access_all" ON public.allergens
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.allergens
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: categories
-- Rimuovere policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.categories;
DROP POLICY IF EXISTS "Consenti lettura pubblica categories" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.categories;
DROP POLICY IF EXISTS "Consenti modifica autenticata categories" ON public.categories;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.categories;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.categories
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.categories
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: products
-- Rimuovere policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
DROP POLICY IF EXISTS "Consenti lettura pubblica products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.products;
DROP POLICY IF EXISTS "Consenti modifica autenticata products" ON public.products;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.products;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.products
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.products
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: product_prices
-- Rimuovere policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.product_prices;
DROP POLICY IF EXISTS "Consenti lettura pubblica product_prices" ON public.product_prices;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.product_prices;
DROP POLICY IF EXISTS "Consenti modifica autenticata product_prices" ON public.product_prices;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.product_prices;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.product_prices
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.product_prices
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: product_allergens
-- Rimuovere policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.product_allergens;
DROP POLICY IF EXISTS "Consenti lettura pubblica product_allergens" ON public.product_allergens;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.product_allergens;
DROP POLICY IF EXISTS "Consenti modifica autenticata product_allergens" ON public.product_allergens;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.product_allergens;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.product_allergens
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.product_allergens
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: product_features
-- Rimuovere eventuali policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.product_features;
DROP POLICY IF EXISTS "Consenti lettura pubblica product_features" ON public.product_features;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.product_features;
DROP POLICY IF EXISTS "Consenti modifica autenticata product_features" ON public.product_features;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.product_features;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.product_features
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.product_features
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: product_labels
-- Rimuovere eventuali policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.product_labels;
DROP POLICY IF EXISTS "Consenti lettura pubblica product_labels" ON public.product_labels;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.product_labels;
DROP POLICY IF EXISTS "Consenti modifica autenticata product_labels" ON public.product_labels;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.product_labels;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.product_labels
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.product_labels
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: product_to_features
-- Rimuovere eventuali policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.product_to_features;
DROP POLICY IF EXISTS "Consenti lettura pubblica product_to_features" ON public.product_to_features;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.product_to_features;
DROP POLICY IF EXISTS "Consenti modifica autenticata product_to_features" ON public.product_to_features;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.product_to_features;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.product_to_features
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.product_to_features
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: category_notes
-- Rimuovere eventuali policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.category_notes;
DROP POLICY IF EXISTS "Consenti lettura pubblica category_notes" ON public.category_notes;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.category_notes;
DROP POLICY IF EXISTS "Consenti modifica autenticata category_notes" ON public.category_notes;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.category_notes;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.category_notes
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.category_notes
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: category_notes_categories
-- Rimuovere eventuali policy duplicate
DROP POLICY IF EXISTS "Allow public read access" ON public.category_notes_categories;
DROP POLICY IF EXISTS "Consenti lettura pubblica category_notes_categories" ON public.category_notes_categories;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.category_notes_categories;
DROP POLICY IF EXISTS "Consenti modifica autenticata category_notes_categories" ON public.category_notes_categories;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.category_notes_categories;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.category_notes_categories
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.category_notes_categories
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: site_settings (CASO SPECIALE)
-- Rimuovere TUTTE le policy duplicate
DROP POLICY IF EXISTS "Allow anonymous access to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can delete site settings" ON public.site_settings;

-- Creare policy consolidate
CREATE POLICY "read_access_all" ON public.site_settings
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.site_settings
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Tabella: user_roles (CASO SPECIALE - Policy basate su proprietario)
-- Rimuovere policy esistenti
DROP POLICY IF EXISTS "Users can select their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can delete own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update their own roles" ON public.user_roles;

-- Creare policy ottimizzate per user_roles
CREATE POLICY "users_manage_own_roles" ON public.user_roles
FOR ALL TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Tabelle rimanenti: print_layouts, translation_tokens, translations
-- Rimuovere eventuali policy duplicate per print_layouts
DROP POLICY IF EXISTS "Allow public read access" ON public.print_layouts;
DROP POLICY IF EXISTS "Consenti lettura pubblica print_layouts" ON public.print_layouts;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.print_layouts;
DROP POLICY IF EXISTS "Consenti modifica autenticata print_layouts" ON public.print_layouts;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.print_layouts;

-- Creare policy consolidate per print_layouts
CREATE POLICY "read_access_all" ON public.print_layouts
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.print_layouts
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Rimuovere eventuali policy duplicate per translation_tokens
DROP POLICY IF EXISTS "Allow public read access" ON public.translation_tokens;
DROP POLICY IF EXISTS "Consenti lettura pubblica translation_tokens" ON public.translation_tokens;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.translation_tokens;
DROP POLICY IF EXISTS "Consenti modifica autenticata translation_tokens" ON public.translation_tokens;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.translation_tokens;

-- Creare policy consolidate per translation_tokens
CREATE POLICY "read_access_all" ON public.translation_tokens
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.translation_tokens
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Rimuovere eventuali policy duplicate per translations
DROP POLICY IF EXISTS "Allow public read access" ON public.translations;
DROP POLICY IF EXISTS "Consenti lettura pubblica translations" ON public.translations;
DROP POLICY IF EXISTS "Enable read access for anonymous users" ON public.translations;
DROP POLICY IF EXISTS "Consenti modifica autenticata translations" ON public.translations;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.translations;

-- Creare policy consolidate per translations
CREATE POLICY "read_access_all" ON public.translations
FOR SELECT USING (true);

CREATE POLICY "authenticated_write_access" ON public.translations
FOR ALL TO authenticated
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
