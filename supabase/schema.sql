-- PrankCreation — Schéma Supabase
-- À exécuter UNE SEULE FOIS dans l'éditeur SQL Supabase :
-- https://supabase.com/dashboard/project/tkhydffcgpgtgpswikep/sql/new

-- ── Profiles ─────────────────────────────────────────────────────────────────
-- Lié à auth.users via un trigger. Créé automatiquement à l'inscription.
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email            TEXT        NOT NULL,
  credits_balance  INTEGER     NOT NULL DEFAULT 0,   -- 0 crédit par défaut : abonnement requis pour générer
  plan             TEXT        NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── Generations ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.generations (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  prompt       TEXT        NOT NULL,
  style        TEXT        NOT NULL DEFAULT 'naturel',
  quality      TEXT        NOT NULL DEFAULT 'standard',
  mode         TEXT        NOT NULL DEFAULT 'image',
  image_url    TEXT,
  credits_used INTEGER     NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "generations_select_own"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "generations_insert_own"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── Trigger : créer le profil à l'inscription ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Trigger : updated_at automatique ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
