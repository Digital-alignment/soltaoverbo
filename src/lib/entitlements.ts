/**
 * Helpers puros para cálculo de Trial de 4 dias (96 horas) e Entitlements de Produto
 * Solta o Verbo
 */

export const TRIAL_DURATION_HOURS = 96;
export const TRIAL_DURATION_MS = TRIAL_DURATION_HOURS * 60 * 60 * 1000;
export const WEEKLY_FREE_POST_LIMIT = 3;

export type ProductSlug = '21_dias' | 'cafe_com_letras' | 'ciclo_aprofundamento';

export interface Entitlement {
  id?: string;
  user_id?: string;
  product_slug: ProductSlug | string;
  status: 'active' | 'expired' | 'cancelled';
  source?: string | null;
  order_id?: string | null;
  starts_at?: string;
  expires_at?: string | null;
  metadata?: any;
  created_at?: string;
}

export interface TrialStatus {
  isTrial: boolean;
  isExpired: boolean;
  hoursRemaining: number;
  daysRemaining: number;
  expiresAt: Date | null;
}

/**
 * Calcula o status do trial de 96h a partir de created_at do usuário
 */
export function calculateTrialStatus(userCreatedAt?: string | null, isPremiumOrAdmin: boolean = false): TrialStatus {
  if (isPremiumOrAdmin || !userCreatedAt) {
    return {
      isTrial: false,
      isExpired: false,
      hoursRemaining: 0,
      daysRemaining: 0,
      expiresAt: null,
    };
  }

  const createdTime = new Date(userCreatedAt).getTime();
  const trialEndTime = createdTime + TRIAL_DURATION_MS;
  const now = Date.now();
  const msRemaining = trialEndTime - now;

  if (msRemaining <= 0) {
    return {
      isTrial: false,
      isExpired: true,
      hoursRemaining: 0,
      daysRemaining: 0,
      expiresAt: new Date(trialEndTime),
    };
  }

  const hoursRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60)));
  const daysRemaining = Math.ceil(hoursRemaining / 24);

  return {
    isTrial: true,
    isExpired: false,
    hoursRemaining,
    daysRemaining,
    expiresAt: new Date(trialEndTime),
  };
}

/**
 * Checa se um entitlement está ativo e dentro da validade
 */
export function isEntitlementActive(entitlement: Entitlement): boolean {
  if (entitlement.status !== 'active') return false;
  if (!entitlement.expires_at) return true; // sem expiração = vitalício ou ativo
  return new Date(entitlement.expires_at).getTime() > Date.now();
}

/**
 * Verifica se o usuário possui acesso ao produto específico
 */
export function hasProductAccess(
  productSlug: ProductSlug,
  entitlements: Entitlement[] = [],
  isAdmin: boolean = false
): boolean {
  if (isAdmin) return true;

  const activeSlugs = entitlements
    .filter(isEntitlementActive)
    .map((e) => e.product_slug);

  // Ciclo de Aprofundamento concede acesso a tudo (21 dias + cafe com letras + ciclo)
  if (activeSlugs.includes('ciclo_aprofundamento')) {
    return true;
  }

  return activeSlugs.includes(productSlug);
}

/**
 * Verifica se o usuário tem permissão para usar as ferramentas de escrita (Atelier / Zen Mode)
 * - Admin: Sim
 * - Tem assinatura ativa ou qualquer produto ativo: Sim
 * - Trial de 4 dias ativo: Sim
 * - Trial expirado sem produto ativo: Não (Modo Somente Leitura)
 */
export function canUserWrite(params: {
  isAdmin: boolean;
  isLegacyPaid: boolean;
  entitlements: Entitlement[];
  trial: TrialStatus;
}): boolean {
  const { isAdmin, isLegacyPaid, entitlements, trial } = params;

  if (isAdmin) return true;
  if (isLegacyPaid) return true;

  const hasAnyActiveProduct = entitlements.some(isEntitlementActive);
  if (hasAnyActiveProduct) return true;

  // Se o trial de 96h ainda está correndo
  return trial.isTrial;
}

/**
 * Verifica permissão para publicar na Fogueira
 * - Admin, membros pagos/com produto, e em trial: Ilimitado
 * - Trial expirado / gratuito: Permitido se postagens nos últimos 7 dias < 3
 */
export function canUserPostToFogueira(params: {
  isAdmin: boolean;
  isLegacyPaid: boolean;
  entitlements: Entitlement[];
  trial: TrialStatus;
  weeklyPostsCount: number;
}): { allowed: boolean; reason?: 'trial_active' | 'subscribed' | 'under_limit' | 'limit_reached' } {
  const { isAdmin, isLegacyPaid, entitlements, trial, weeklyPostsCount } = params;

  if (isAdmin || isLegacyPaid || entitlements.some(isEntitlementActive)) {
    return { allowed: true, reason: 'subscribed' };
  }

  if (trial.isTrial) {
    return { allowed: true, reason: 'trial_active' };
  }

  if (weeklyPostsCount < WEEKLY_FREE_POST_LIMIT) {
    return { allowed: true, reason: 'under_limit' };
  }

  return { allowed: false, reason: 'limit_reached' };
}
