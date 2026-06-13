REVOKE SELECT ON public.ratings FROM anon;

DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.ratings;

CREATE POLICY "Signed-in users can view ratings"
  ON public.ratings FOR SELECT
  TO authenticated
  USING (true);
