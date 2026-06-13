-- Allow anonymous visitors to cache pub data from Google Places.
-- Pub rows are non-sensitive public place metadata.
GRANT INSERT, UPDATE ON public.pubs TO anon;

DROP POLICY IF EXISTS "Authenticated can upsert pubs" ON public.pubs;
DROP POLICY IF EXISTS "Authenticated can update pubs" ON public.pubs;

CREATE POLICY "Anyone can cache pubs"
  ON public.pubs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update pub cache"
  ON public.pubs FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);
