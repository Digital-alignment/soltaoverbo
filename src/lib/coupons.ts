/**
 * Helpers e Serviços para Cupons Poéticos & Bolsas Comunitárias (Fase 3)
 * Solta o Verbo
 */

import { supabase } from './supabase';

export type CouponType = 'trial_extension' | 'discount_percent' | 'free_access';
export type CouponProductTarget = 'all' | '21_dias' | 'cafe_com_letras' | 'ciclo_aprofundamento';

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  type: CouponType;
  benefit_value: number;
  product_target: CouponProductTarget;
  max_uses?: number | null;
  used_count: number;
  expires_at?: string | null;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CouponRedemption {
  id: string;
  coupon_id: string;
  coupon_code: string;
  user_id: string;
  user_email?: string | null;
  benefit_type: string;
  benefit_value: number;
  product_slug?: string | null;
  metadata?: any;
  redeemed_at: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  error?: string;
  message?: string;
}

/**
 * Normaliza códigos para maiúsculas sem espaços externos
 */
export function normalizeCouponCode(code: string): string {
  return (code || '').trim().toUpperCase();
}

/**
 * Mapeia chaves de produto do frontend para slugs do banco
 */
export function mapProductKeyToSlug(productKey?: string): string {
  if (!productKey) return 'all';
  const lower = productKey.toLowerCase().replace(/-/g, '_');
  if (lower.includes('21')) return '21_dias';
  if (lower.includes('cafe')) return 'cafe_com_letras';
  if (lower.includes('ciclo') || lower.includes('aprofundamento')) return 'ciclo_aprofundamento';
  return 'all';
}

/**
 * Calcula desconto em centavos e valor final
 */
export function calculateCouponDiscount(
  coupon: Coupon,
  originalPriceInCents: number
): { discountInCents: number; finalPriceInCents: number; percent: number } {
  if (coupon.type === 'free_access') {
    return {
      discountInCents: originalPriceInCents,
      finalPriceInCents: 0,
      percent: 100,
    };
  }

  if (coupon.type === 'discount_percent') {
    const percent = Math.min(100, Math.max(0, Number(coupon.benefit_value) || 0));
    const discountInCents = Math.round((originalPriceInCents * percent) / 100);
    const finalPriceInCents = Math.max(0, originalPriceInCents - discountInCents);
    return { discountInCents, finalPriceInCents, percent };
  }

  // trial_extension não altera o preço em centavos diretamente
  return {
    discountInCents: 0,
    finalPriceInCents: originalPriceInCents,
    percent: 0,
  };
}

/**
 * Busca a lista completa de cupons gerenciados
 */
export async function fetchCoupons(): Promise<Coupon[]> {
  try {
    const res = await fetch('/api/coupons');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.coupons) && data.coupons.length > 0) {
        try {
          localStorage.setItem('solta_coupons_cache', JSON.stringify(data.coupons));
        } catch {}
        return data.coupons;
      }
    }
  } catch (err) {
    console.warn('[Coupons] Falha ao buscar /api/coupons, usando fallback:', err);
  }

  // Fallback para cache local
  try {
    const cached = localStorage.getItem('solta_coupons_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  const defaultList: Coupon[] = [
    {
      id: 'cp-2026ju',
      code: '2026JU',
      description: 'desconto especial em café com letras',
      type: 'discount_percent',
      benefit_value: 20,
      product_target: 'cafe_com_letras',
      max_uses: null,
      used_count: 0,
      expires_at: null,
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cp-amor20',
      code: 'AMOR20',
      description: '20% de desconto de boas-vindas',
      type: 'discount_percent',
      benefit_value: 20,
      product_target: 'all',
      max_uses: 100,
      used_count: 3,
      expires_at: null,
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cp-degusta15',
      code: 'DEGUSTA15',
      description: '+15 dias de degustação livre',
      type: 'trial_extension',
      benefit_value: 15,
      product_target: 'all',
      max_uses: null,
      used_count: 1,
      expires_at: null,
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'cp-bolsasolta',
      code: 'BOLSASOLTA',
      description: 'bolsa comunitária integral de acesso',
      type: 'free_access',
      benefit_value: 100,
      product_target: 'all',
      max_uses: 10,
      used_count: 0,
      expires_at: null,
      active: true,
      created_at: new Date().toISOString(),
    },
  ];

  try {
    localStorage.setItem('solta_coupons_cache', JSON.stringify(defaultList));
  } catch {}

  return defaultList;
}

/**
 * Salva ou atualiza um cupom
 */
export async function saveCoupon(payload: {
  id?: string;
  code: string;
  description?: string | null;
  type: CouponType;
  benefit_value: number;
  product_target: CouponProductTarget;
  max_uses?: number | null;
  expires_at?: string | null;
  active?: boolean;
}): Promise<{ success: boolean; coupon?: Coupon; error?: string }> {
  try {
    const res = await fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.coupon) {
        // Atualizar cache local
        try {
          const list = await fetchCoupons();
          const cleanCode = normalizeCouponCode(payload.code);
          const existingIdx = list.findIndex(c => (payload.id && c.id === payload.id) || c.code === cleanCode);
          if (existingIdx >= 0) list[existingIdx] = data.coupon;
          else list.unshift(data.coupon);
          localStorage.setItem('solta_coupons_cache', JSON.stringify(list));
        } catch {}
        return { success: true, coupon: data.coupon };
      }
    }
    const errData = await res.json().catch(() => ({}));
    if (errData?.error) {
      return { success: false, error: errData.error };
    }
  } catch (err) {
    console.warn('[Coupons] Erro de rede ao salvar cupom:', err);
  }

  // Fallback local caso offline
  try {
    const list = await fetchCoupons();
    const cleanCode = normalizeCouponCode(payload.code);
    const existingIdx = list.findIndex(c => (payload.id && c.id === payload.id) || c.code === cleanCode);
    const record: Coupon = {
      id: payload.id || `cp-${Date.now()}`,
      code: cleanCode,
      description: payload.description || null,
      type: payload.type,
      benefit_value: Number(payload.benefit_value) || 0,
      product_target: payload.product_target,
      max_uses: payload.max_uses ?? null,
      used_count: existingIdx >= 0 ? list[existingIdx].used_count : 0,
      expires_at: payload.expires_at || null,
      active: payload.active ?? true,
      created_at: existingIdx >= 0 ? list[existingIdx].created_at : new Date().toISOString(),
    };
    if (existingIdx >= 0) list[existingIdx] = record;
    else list.unshift(record);
    localStorage.setItem('solta_coupons_cache', JSON.stringify(list));
    return { success: true, coupon: record };
  } catch (fallbackErr: any) {
    return { success: false, error: fallbackErr.message || 'erro ao salvar cupom' };
  }
}

/**
 * Alterna status ativo do cupom
 */
export async function toggleCouponActive(id: string, active: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/coupons/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        try {
          const list = await fetchCoupons();
          const target = list.find(c => c.id === id);
          if (target) {
            target.active = active;
            localStorage.setItem('solta_coupons_cache', JSON.stringify(list));
          }
        } catch {}
        return { success: true };
      }
    }
  } catch {}

  // Fallback local
  try {
    const list = await fetchCoupons();
    const target = list.find(c => c.id === id);
    if (target) {
      target.active = active;
      localStorage.setItem('solta_coupons_cache', JSON.stringify(list));
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Exclui um cupom
 */
export async function deleteCoupon(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        try {
          let list = await fetchCoupons();
          list = list.filter(c => c.id !== id);
          localStorage.setItem('solta_coupons_cache', JSON.stringify(list));
        } catch {}
        return { success: true };
      }
    }
  } catch {}

  try {
    let list = await fetchCoupons();
    list = list.filter(c => c.id !== id);
    localStorage.setItem('solta_coupons_cache', JSON.stringify(list));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Busca resgates de cupons
 */
export async function fetchCouponRedemptions(): Promise<CouponRedemption[]> {
  try {
    const res = await fetch('/api/coupons/redemptions');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.redemptions)) return data.redemptions;
    }
  } catch {}
  return [];
}

/**
 * Valida um cupom verificando existência, validade, limite de usos e restrição de produto
 */
export async function validateCoupon(params: {
  code: string;
  productKey?: string;
  userId?: string;
}): Promise<CouponValidationResult> {
  const cleanCode = normalizeCouponCode(params.code);
  if (!cleanCode) {
    return { valid: false, error: 'informe um código de cupom ou bolsa.' };
  }

  const targetSlug = mapProductKeyToSlug(params.productKey);

  // 1. Tentar validação via microserviço Node.js
  try {
    const response = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        productSlug: targetSlug,
        userId: params.userId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    const errData = await response.json().catch(() => ({}));
    if (errData?.error) {
      return { valid: false, error: errData.error };
    }
  } catch (err) {
    console.warn('[Coupon] Falha na rota /api/coupons/validate, executando fallback local:', err);
  }

  // 2. Fallback resiliente usando lista gerenciada
  try {
    const allCoupons = await fetchCoupons();
    const coupon = allCoupons.find(c => (c.code || '').trim().toUpperCase() === cleanCode);

    if (!coupon) {
      return { valid: false, error: 'código de cupom não encontrado ou inválido.' };
    }

    if (!coupon.active) {
      return { valid: false, error: 'este cupom foi desativado.' };
    }

    if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
      return { valid: false, error: 'este cupom já expirou.' };
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return { valid: false, error: 'este cupom atingiu o limite máximo de utilizações.' };
    }

    if (coupon.product_target !== 'all' && targetSlug !== 'all' && coupon.product_target !== targetSlug) {
      return {
        valid: false,
        error: `este cupom é exclusivo para ${
          coupon.product_target === '21_dias'
            ? 'a oficina 21 dias'
            : coupon.product_target === 'cafe_com_letras'
            ? 'o café com letras'
            : 'o ciclo de aprofundamento'
        }.`,
      };
    }

    return {
      valid: true,
      coupon: coupon as Coupon,
      message:
        coupon.type === 'free_access'
          ? 'bolsa comunitária 100% integral disponível!'
          : coupon.type === 'trial_extension'
          ? `extensão de degustação por +${coupon.benefit_value} dias!`
          : `desconto de ${coupon.benefit_value}% aplicado com afeto!`,
    };
  } catch (err: any) {
    return { valid: false, error: err.message || 'erro ao validar cupom.' };
  }
}

/**
 * Resgata e aplica o benefício do cupom de forma atômica
 */
export async function redeemCoupon(params: {
  code: string;
  productKey?: string;
  userId: string;
  userEmail?: string;
}): Promise<{ success: boolean; message: string; error?: string; entitlement?: any }> {
  const cleanCode = normalizeCouponCode(params.code);
  const targetSlug = mapProductKeyToSlug(params.productKey);

  // 1. Chamar rota segura do backend (Node.js com Service Role)
  try {
    const response = await fetch('/api/coupons/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: cleanCode,
        productSlug: targetSlug,
        userId: params.userId,
        userEmail: params.userEmail,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    const errData = await response.json().catch(() => ({}));
    if (errData?.error) {
      return { success: false, error: errData.error, message: '' };
    }
  } catch (err) {
    console.warn('[Coupon] Falha ao resgatar via /api/coupons/redeem, tentando fallback resiliente:', err);
  }

  // 2. Fallback resiliente
  try {
    const validation = await validateCoupon({
      code: cleanCode,
      productKey: params.productKey,
      userId: params.userId,
    });

    if (!validation.valid || !validation.coupon) {
      return { success: false, error: validation.error || 'cupom inválido', message: '' };
    }

    const coupon = validation.coupon;
    const finalProductSlug =
      coupon.product_target === 'all'
        ? targetSlug === 'all'
          ? '21_dias'
          : targetSlug
        : coupon.product_target;

    let expiresAt: string | null = null;
    let durationDays = 365;

    if (coupon.type === 'trial_extension') {
      durationDays = Number(coupon.benefit_value) || 30;
      expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    } else if (coupon.type === 'free_access') {
      durationDays = finalProductSlug === 'cafe_com_letras' ? 30 : 365;
      expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    }

    // Inserir entitlement
    let entData = null;
    try {
      const { data, error: entError } = await supabase
        .from('user_entitlements')
        .insert({
          user_id: params.userId,
          product_slug: coupon.type === 'trial_extension' ? 'degustacao_estendida' : finalProductSlug,
          status: 'active',
          source: 'coupon',
          order_id: `coupon-${coupon.code}`,
          starts_at: new Date().toISOString(),
          expires_at: expiresAt,
          metadata: {
            coupon_code: coupon.code,
            benefit_type: coupon.type,
            benefit_value: coupon.benefit_value,
          },
        })
        .select()
        .single();
      if (!entError) entData = data;
    } catch {}

    // Atualizar papel para paid
    try {
      await supabase
        .from('users_profiles')
        .update({ role: 'paid' })
        .eq('id', params.userId);
    } catch {}

    // Atualizar cache local do cupom
    try {
      const list = await fetchCoupons();
      const target = list.find(c => c.id === coupon.id || c.code === coupon.code);
      if (target) {
        target.used_count = (target.used_count || 0) + 1;
        localStorage.setItem('solta_coupons_cache', JSON.stringify(list));
      }
    } catch {}

    return {
      success: true,
      message: `código ${coupon.code} ativado com afeto! seus benefícios já estão livres.`,
      entitlement: entData,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'não foi possível concluir o resgate do cupom.',
      message: '',
    };
  }
}
