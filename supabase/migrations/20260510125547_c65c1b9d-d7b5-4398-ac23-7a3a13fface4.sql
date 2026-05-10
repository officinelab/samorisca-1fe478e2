
-- Restrict storage write policies to admins only
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete on products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update on products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload on products bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete category note icons" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update category note icons" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload category note icons" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

CREATE POLICY "Admins can insert menu-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'menu-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update menu-images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'menu-images' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'menu-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete menu-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'menu-images' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert products"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'products' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update products"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'products' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'products' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete products"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'products' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert category-note-icons"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'category-note-icons' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update category-note-icons"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'category-note-icons' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'category-note-icons' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete category-note-icons"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'category-note-icons' AND public.is_admin(auth.uid()));
