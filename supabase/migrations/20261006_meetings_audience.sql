-- Migração para Central de Agenda & Encontros com Segmentação de Audiência (Fase 4)
-- Solta o Verbo

-- Garantir existência da tabela product_meetings
CREATE TABLE IF NOT EXISTS public.product_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT NOT NULL DEFAULT 'comunidade',
  title TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  meeting_link TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  audience_type TEXT DEFAULT 'all', -- 'all' | 'product' | 'role' | 'specific_users'
  target_products TEXT[] DEFAULT '{}',
  target_roles TEXT[] DEFAULT '{}',
  target_user_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir adição das colunas de audiência caso a tabela já exista
ALTER TABLE public.product_meetings
  ADD COLUMN IF NOT EXISTS audience_type TEXT DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS target_products TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS target_roles TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS target_user_ids UUID[] DEFAULT '{}';

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_product_meetings_published_date 
  ON public.product_meetings (is_published, date_time);

CREATE INDEX IF NOT EXISTS idx_product_meetings_audience 
  ON public.product_meetings (audience_type);

-- RLS
ALTER TABLE public.product_meetings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_meetings' AND policyname = 'Allow public read published meetings'
  ) THEN
    CREATE POLICY "Allow public read published meetings"
      ON public.product_meetings FOR SELECT
      USING (is_published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'product_meetings' AND policyname = 'Allow auth users full access to product_meetings'
  ) THEN
    CREATE POLICY "Allow auth users full access to product_meetings"
      ON public.product_meetings FOR ALL
      USING (auth.role() = 'authenticated');
  END IF;
END $$;
