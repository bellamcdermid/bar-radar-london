
-- PUBS (cached Google Places results)
CREATE TABLE public.pubs (
  place_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pubs TO anon;
GRANT SELECT, INSERT, UPDATE ON public.pubs TO authenticated;
GRANT ALL ON public.pubs TO service_role;
ALTER TABLE public.pubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pubs are viewable by everyone" ON public.pubs FOR SELECT USING (true);
CREATE POLICY "Authenticated can upsert pubs" ON public.pubs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update pubs" ON public.pubs FOR UPDATE TO authenticated USING (true);

-- RATINGS
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES public.pubs(place_id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 10),
  comment TEXT CHECK (char_length(comment) <= 500),
  visited_at DATE NOT NULL,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ratings_place_id_idx ON public.ratings(place_id);
CREATE INDEX ratings_dow_idx ON public.ratings(day_of_week);

GRANT SELECT ON public.ratings TO anon;
GRANT SELECT, INSERT, DELETE ON public.ratings TO authenticated;
GRANT ALL ON public.ratings TO service_role;

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert own ratings" ON public.ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);
