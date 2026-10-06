-- ==============================================================================
-- Migração: Adicionar rastreamento de envio de e-mail de contagem regressiva (72h)
-- Solta o Verbo · Fase 1 (Novas Funcionalidades de Retenção)
-- ==============================================================================

-- 1. Adicionar coluna na tabela users_profiles caso não exista
ALTER TABLE public.users_profiles
ADD COLUMN IF NOT EXISTS trial_reminder_sent_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Criar índice para otimizar a busca periódica de candidatas ao lembrete
CREATE INDEX IF NOT EXISTS idx_users_profiles_trial_reminder 
ON public.users_profiles (created_at, trial_reminder_sent_at) 
WHERE trial_reminder_sent_at IS NULL;

COMMENT ON COLUMN public.users_profiles.trial_reminder_sent_at IS 
'Registro de data/hora em que o e-mail de contagem regressiva de 24h restantes do período de teste foi enviado.';
