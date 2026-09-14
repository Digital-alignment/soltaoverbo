-- Migration for Solta o Verbo Product Hubs Architecture
-- Includes product_meetings, product_tasks, and b2b_leads

CREATE TABLE IF NOT EXISTS public.product_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT NOT NULL, -- 'programa_21_dias' | 'programa_ciclo' | 'programa_cafe_com_letras' | 'contrate_experiencia'
  title TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  meeting_link TEXT,
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT DEFAULT 'geral', -- 'bruna' | 'júlia' | 'geral'
  due_date DATE,
  status TEXT DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.b2b_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  status TEXT DEFAULT 'novo_contato', -- 'novo_contato' | 'reuniao_agendada' | 'proposta_enviada' | 'fechado' | 'perdido'
  proposal_value NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_leads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published meetings for students
CREATE POLICY "Allow public read published meetings"
  ON public.product_meetings FOR SELECT
  USING (is_published = true);

-- Allow authenticated users to perform CRUD for admin
CREATE POLICY "Allow auth users full access to product_meetings"
  ON public.product_meetings FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth users full access to product_tasks"
  ON public.product_tasks FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow auth users full access to b2b_leads"
  ON public.b2b_leads FOR ALL
  USING (auth.role() = 'authenticated');
