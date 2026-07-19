DROP POLICY IF EXISTS "Anyone can cache pubs" ON public.pubs;
DROP POLICY IF EXISTS "Anyone can update pub cache" ON public.pubs;

CREATE POLICY "Authenticated users can cache pubs"
  ON public.pubs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update pub cache"
  ON public.pubs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);